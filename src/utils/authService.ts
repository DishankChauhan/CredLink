'use client';

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  updateProfile,
  sendPasswordResetEmail,
  User,
  UserCredential
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { auth, db } from './firebase';

// User types
export type UserRole = 'user' | 'issuer' | 'admin';

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  walletAddress?: string;
  isVerified?: boolean;
  organization?: string;
  createdAt: number;
}

// Register a new user
export async function registerUser(
  email: string, 
  password: string, 
  displayName: string,
  walletAddress?: string,
  role: UserRole = 'user'
): Promise<UserData> {
  try {
    // Create user with Firebase auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    await updateProfile(user, {
      displayName: displayName
    });
    
    // Create user document in Firestore
    const userData: UserData = {
      uid: user.uid,
      email: user.email || email,
      displayName: displayName,
      role: role,
      walletAddress: walletAddress || '',
      isVerified: role === 'user', // Users are auto-verified, issuers need admin approval
      createdAt: Date.now()
    };
    
    await setDoc(doc(db, 'users', user.uid), userData);
    
    return userData;
  } catch (error: any) {
    throw new Error(`Registration failed: ${error.message}`);
  }
}

// Register a new issuer
export async function registerIssuer(
  email: string,
  password: string,
  displayName: string,
  organization: string,
  walletAddress: string
): Promise<UserData> {
  try {
    // Use the registerUser function but set role to 'issuer'
    const userData = await registerUser(email, password, displayName, walletAddress, 'issuer');
    
    // Add organization info
    await updateDoc(doc(db, 'users', userData.uid), {
      organization: organization,
      isVerified: false // Issuers need verification by admin
    });
    
    return { 
      ...userData, 
      organization, 
      isVerified: false
    };
  } catch (error: any) {
    throw new Error(`Issuer registration failed: ${error.message}`);
  }
}

// Sign in user
export async function signIn(email: string, password: string): Promise<UserData> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    } else {
      throw new Error('User document not found');
    }
  } catch (error: any) {
    throw new Error(`Login failed: ${error.message}`);
  }
}

// Sign out user
export async function signOut(): Promise<void> {
  return firebaseSignOut(auth);
}

// Get current user data from Firestore
export async function getCurrentUserData(): Promise<UserData | null> {
  if (!auth.currentUser) return null;
  
  const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
  if (userDoc.exists()) {
    return userDoc.data() as UserData;
  }
  
  return null;
}

// Update user wallet address
export async function updateUserWallet(userId: string, walletAddress: string): Promise<void> {
  await updateDoc(doc(db, 'users', userId), {
    walletAddress: walletAddress
  });
}

// Verify issuer (admin only)
export async function verifyIssuer(issuerId: string, verify: boolean = true): Promise<void> {
  // Get current user to check if admin
  const currentUser = await getCurrentUserData();
  if (!currentUser || currentUser.role !== 'admin') {
    throw new Error('Unauthorized: Only admins can verify issuers');
  }
  
  await updateDoc(doc(db, 'users', issuerId), {
    isVerified: verify
  });
}

// Get all issuers
export async function getAllIssuers(): Promise<UserData[]> {
  const issuersQuery = query(collection(db, 'users'), where('role', '==', 'issuer'));
  const issuersSnapshot = await getDocs(issuersQuery);
  
  const issuers: UserData[] = [];
  issuersSnapshot.forEach(doc => {
    issuers.push(doc.data() as UserData);
  });
  
  return issuers;
}

// Get all verified issuers
export async function getVerifiedIssuers(): Promise<UserData[]> {
  const verifiedIssuersQuery = query(
    collection(db, 'users'), 
    where('role', '==', 'issuer'),
    where('isVerified', '==', true)
  );
  
  const issuersSnapshot = await getDocs(verifiedIssuersQuery);
  
  const issuers: UserData[] = [];
  issuersSnapshot.forEach(doc => {
    issuers.push(doc.data() as UserData);
  });
  
  return issuers;
}

// Password reset
export async function resetPassword(email: string): Promise<void> {
  return sendPasswordResetEmail(auth, email);
} 