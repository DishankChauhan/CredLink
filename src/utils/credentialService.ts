'use client';

import { ethers } from 'ethers';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  orderBy,
  Timestamp,
  arrayUnion,
  DocumentReference
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { getCurrentUserData, UserData } from './authService';
import { getCredentialContract } from './web3';

// Types
export type CredentialType = 'education' | 'certificate' | 'experience';
export type CredentialStatus = 'pending' | 'verified' | 'rejected' | 'revoked';

export interface CredentialMetadata {
  id: string;            // UID for the credential in Firestore
  credentialId?: string; // The blockchain credentialId (bytes32) after it's added to the chain
  type: CredentialType;
  title: string;
  issuer: string;        // Name of the issuing organization
  issuerId?: string;     // UID of the issuer in the system (if verified through our platform)
  issuerAddress?: string; // Blockchain address of the issuer who verified it
  dateIssued: string;
  expiryDate?: string;
  description: string;
  documentUrl?: string;  // URL to the uploaded supporting document
  status: CredentialStatus;
  userId: string;        // UID of the credential owner
  userAddress: string;   // Blockchain address of the credential owner
  createdAt: number;
  updatedAt: number;
  verifiedAt?: number;   // When the credential was verified
  credentialHash?: string; // Hash of the credential data stored on blockchain
  rejectionReason?: string; // Reason for rejection
  revocationReason?: string; // Reason for revocation
}

// Helper function to generate a credential hash
export function generateCredentialHash(credential: Partial<CredentialMetadata>): string {
  // Create a string with all the essential credential data
  const data = JSON.stringify({
    type: credential.type,
    title: credential.title,
    issuer: credential.issuer,
    dateIssued: credential.dateIssued,
    description: credential.description,
    userId: credential.userId,
    userAddress: credential.userAddress,
    timestamp: Date.now()
  });
  
  // Hash the data using keccak256
  return ethers.keccak256(ethers.toUtf8Bytes(data));
}

// Create a new credential
export async function createCredential(
  credential: Partial<CredentialMetadata>,
  file?: File
): Promise<CredentialMetadata> {
  try {
    // Check if user is logged in
    const currentUser = await getCurrentUserData();
    if (!currentUser) {
      throw new Error('You must be logged in to create a credential');
    }
    
    // If file is provided, upload it to Firebase Storage
    let documentUrl = '';
    if (file) {
      const fileRef = ref(storage, `documents/${currentUser.uid}/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      documentUrl = await getDownloadURL(snapshot.ref);
    }
    
    // Create credential document in Firestore
    const credentialRef = doc(collection(db, 'credentials'));
    const timestamp = Date.now();
    
    const credentialData: CredentialMetadata = {
      id: credentialRef.id,
      type: credential.type as CredentialType,
      title: credential.title || '',
      issuer: credential.issuer || '',
      dateIssued: credential.dateIssued || '',
      description: credential.description || '',
      documentUrl: documentUrl,
      status: 'pending',
      userId: currentUser.uid,
      userAddress: currentUser.walletAddress || '',
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    // Generate hash of the credential data
    credentialData.credentialHash = generateCredentialHash(credentialData);
    
    // Store in Firestore
    await setDoc(credentialRef, credentialData);
    
    // Update user's credentials list
    await updateDoc(doc(db, 'users', currentUser.uid), {
      credentials: arrayUnion(credentialRef.id)
    });
    
    return credentialData;
  } catch (error: any) {
    throw new Error(`Failed to create credential: ${error.message}`);
  }
}

// Get a single credential by ID
export async function getCredentialById(credentialId: string): Promise<CredentialMetadata | null> {
  try {
    const credentialDoc = await getDoc(doc(db, 'credentials', credentialId));
    if (credentialDoc.exists()) {
      return credentialDoc.data() as CredentialMetadata;
    }
    return null;
  } catch (error) {
    console.error('Error fetching credential:', error);
    return null;
  }
}

// Get all credentials for a user
export async function getUserCredentials(userId: string): Promise<CredentialMetadata[]> {
  try {
    // First try without orderBy which doesn't require the composite index
    const credentialsQuery = query(
      collection(db, 'credentials'),
      where('userId', '==', userId)
    );
    
    const credentialsSnapshot = await getDocs(credentialsQuery);
    
    const credentials: CredentialMetadata[] = [];
    credentialsSnapshot.forEach(doc => {
      credentials.push(doc.data() as CredentialMetadata);
    });
    
    // Sort the results in memory
    return credentials.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Error fetching user credentials:', error);
    return [];
  }
}

// Get pending credentials for an issuer
export async function getPendingCredentialsForIssuer(issuerId: string): Promise<CredentialMetadata[]> {
  try {
    // Get issuer data to check organization
    const issuerDoc = await getDoc(doc(db, 'users', issuerId));
    if (!issuerDoc.exists()) {
      throw new Error('Issuer not found');
    }
    
    const issuerData = issuerDoc.data() as UserData;
    const organization = issuerData.organization;
    
    // Query credentials that match the issuer's organization and are pending
    const credentialsQuery = query(
      collection(db, 'credentials'),
      where('issuer', '==', organization),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );
    
    const credentialsSnapshot = await getDocs(credentialsQuery);
    
    const credentials: CredentialMetadata[] = [];
    credentialsSnapshot.forEach(doc => {
      credentials.push(doc.data() as CredentialMetadata);
    });
    
    return credentials;
  } catch (error) {
    console.error('Error fetching pending credentials:', error);
    return [];
  }
}

// Verify a credential (for issuers only)
export async function verifyCredential(
  credentialId: string, 
  issuerId: string
): Promise<CredentialMetadata> {
  try {
    // Check if user is logged in and is a verified issuer
    const currentUser = await getCurrentUserData();
    if (!currentUser || currentUser.role !== 'issuer' || !currentUser.isVerified) {
      throw new Error('Unauthorized: Only verified issuers can verify credentials');
    }
    
    // Get the credential
    const credentialDoc = await getDoc(doc(db, 'credentials', credentialId));
    if (!credentialDoc.exists()) {
      throw new Error('Credential not found');
    }
    
    const credential = credentialDoc.data() as CredentialMetadata;
    
    // Check if the credential is associated with the issuer's organization
    const issuerDoc = await getDoc(doc(db, 'users', issuerId));
    if (!issuerDoc.exists()) {
      throw new Error('Issuer not found');
    }
    
    const issuerData = issuerDoc.data() as UserData;
    if (credential.issuer !== issuerData.organization) {
      throw new Error('This credential is not associated with your organization');
    }
    
    // Check if the credential is already verified
    if (credential.status !== 'pending') {
      throw new Error(`Credential is already ${credential.status}`);
    }
    
    // Prepare credential data for blockchain
    const credentialData = JSON.stringify({
      type: credential.type,
      title: credential.title,
      issuer: credential.issuer,
      dateIssued: credential.dateIssued,
      userId: credential.userId,
      timestamp: Date.now()
    });
    
    // Write to blockchain if the user has a wallet address
    if (credential.userAddress && currentUser.walletAddress) {
      try {
        // Get contract instance
        const contract = await getCredentialContract();
        if (!contract) {
          throw new Error('Failed to connect to blockchain');
        }
        
        // Add credential to blockchain
        const tx = await contract.addCredential(credentialData);
        await tx.wait();
        
        // Extract credential ID from event (implementation may vary based on contract)
        // This is a placeholder - you'll need to adjust based on your actual contract implementation
        const receipt = await tx.wait();
        const event = receipt.events?.find((e: any) => e.event === 'CredentialAdded');
        const blockchainCredentialId = event?.args?.credentialId;
        
        // Verify the credential
        const verifyTx = await contract.verifyCredential(credential.userAddress, blockchainCredentialId);
        await verifyTx.wait();
        
        // Update credential record with blockchain data
        await updateDoc(doc(db, 'credentials', credentialId), {
          status: 'verified',
          credentialId: blockchainCredentialId,
          issuerId: currentUser.uid,
          issuerAddress: currentUser.walletAddress,
          verifiedAt: Date.now(),
          updatedAt: Date.now()
        });
        
        // Return updated credential
        return {
          ...credential,
          status: 'verified',
          credentialId: blockchainCredentialId,
          issuerId: currentUser.uid,
          issuerAddress: currentUser.walletAddress,
          verifiedAt: Date.now(),
          updatedAt: Date.now()
        };
      } catch (error: any) {
        console.error('Blockchain error:', error);
        throw new Error(`Blockchain verification failed: ${error.message}`);
      }
    } else {
      // If no wallet address, just update the status in Firebase (for testing/development)
      await updateDoc(doc(db, 'credentials', credentialId), {
        status: 'verified',
        issuerId: currentUser.uid,
        verifiedAt: Date.now(),
        updatedAt: Date.now()
      });
      
      return {
        ...credential,
        status: 'verified',
        issuerId: currentUser.uid,
        verifiedAt: Date.now(),
        updatedAt: Date.now()
      };
    }
  } catch (error: any) {
    throw new Error(`Verification failed: ${error.message}`);
  }
}

// Reject a credential (for issuers only)
export async function rejectCredential(
  credentialId: string, 
  reason: string
): Promise<CredentialMetadata> {
  try {
    // Check if user is logged in and is a verified issuer
    const currentUser = await getCurrentUserData();
    if (!currentUser || currentUser.role !== 'issuer' || !currentUser.isVerified) {
      throw new Error('Unauthorized: Only verified issuers can reject credentials');
    }
    
    // Get the credential
    const credentialDoc = await getDoc(doc(db, 'credentials', credentialId));
    if (!credentialDoc.exists()) {
      throw new Error('Credential not found');
    }
    
    const credential = credentialDoc.data() as CredentialMetadata;
    
    // Check if credential is already processed
    if (credential.status !== 'pending') {
      throw new Error(`Credential is already ${credential.status}`);
    }
    
    // Update credential status
    await updateDoc(doc(db, 'credentials', credentialId), {
      status: 'rejected',
      rejectionReason: reason,
      issuerId: currentUser.uid,
      updatedAt: Date.now()
    });
    
    return {
      ...credential,
      status: 'rejected',
      rejectionReason: reason,
      issuerId: currentUser.uid,
      updatedAt: Date.now()
    };
  } catch (error: any) {
    throw new Error(`Rejection failed: ${error.message}`);
  }
}

// Revoke a credential (for issuers who verified it)
export async function revokeCredential(
  credentialId: string, 
  reason: string
): Promise<CredentialMetadata> {
  try {
    // Check if user is logged in and is a verified issuer
    const currentUser = await getCurrentUserData();
    if (!currentUser || currentUser.role !== 'issuer' || !currentUser.isVerified) {
      throw new Error('Unauthorized: Only verified issuers can revoke credentials');
    }
    
    // Get the credential
    const credentialDoc = await getDoc(doc(db, 'credentials', credentialId));
    if (!credentialDoc.exists()) {
      throw new Error('Credential not found');
    }
    
    const credential = credentialDoc.data() as CredentialMetadata;
    
    // Check if the issuer verified this credential
    if (credential.issuerId !== currentUser.uid) {
      throw new Error('You can only revoke credentials that you have verified');
    }
    
    // Check if credential is verified
    if (credential.status !== 'verified') {
      throw new Error(`Cannot revoke a credential with status: ${credential.status}`);
    }
    
    // If the credential exists on the blockchain, revoke it there
    if (credential.credentialId && currentUser.walletAddress) {
      try {
        // Get contract instance
        const contract = await getCredentialContract();
        if (!contract) {
          throw new Error('Failed to connect to blockchain');
        }
        
        // Revoke on blockchain
        const tx = await contract.revokeCredential(credential.credentialId);
        await tx.wait();
      } catch (error: any) {
        console.error('Blockchain error:', error);
        throw new Error(`Blockchain revocation failed: ${error.message}`);
      }
    }
    
    // Update in Firestore
    await updateDoc(doc(db, 'credentials', credentialId), {
      status: 'revoked',
      revocationReason: reason,
      updatedAt: Date.now()
    });
    
    return {
      ...credential,
      status: 'revoked',
      revocationReason: reason,
      updatedAt: Date.now()
    };
  } catch (error: any) {
    throw new Error(`Revocation failed: ${error.message}`);
  }
}

// Verify a credential using its ID (public function, no auth required)
export async function verifyCredentialByCredentialId(
  blockchainCredentialId: string
): Promise<{isValid: boolean, credential?: CredentialMetadata}> {
  try {
    // Check on blockchain
    const contract = await getCredentialContract();
    if (!contract) {
      throw new Error('Failed to connect to blockchain');
    }
    
    const isValid = await contract.isCredentialValid(blockchainCredentialId);
    
    if (!isValid) {
      return { isValid: false };
    }
    
    // Get credential details
    const details = await contract.getCredentialDetails(blockchainCredentialId);
    const [hash, owner, issuer] = details;
    
    // Try to find in our database for more details
    const credentialsQuery = query(
      collection(db, 'credentials'),
      where('credentialId', '==', blockchainCredentialId)
    );
    
    const credentialsSnapshot = await getDocs(credentialsQuery);
    
    if (!credentialsSnapshot.empty) {
      const credential = credentialsSnapshot.docs[0].data() as CredentialMetadata;
      return { isValid: true, credential };
    }
    
    // If not found in our database, return basic info
    return { 
      isValid: true, 
      credential: {
        id: '', // Unknown in our system
        credentialId: blockchainCredentialId,
        type: 'certificate', // Default type
        title: 'Blockchain Verified Credential',
        issuer: 'Unknown Issuer',
        issuerAddress: issuer,
        dateIssued: '',
        description: 'This credential is verified on the blockchain but details are not available in our system.',
        status: 'verified',
        userId: '',
        userAddress: owner,
        createdAt: 0,
        updatedAt: 0,
        credentialHash: hash
      }
    };
  } catch (error: any) {
    console.error('Verification error:', error);
    return { isValid: false };
  }
} 