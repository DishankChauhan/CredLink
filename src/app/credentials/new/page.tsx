'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CredentialForm from '@/app/components/CredentialForm';
import { createCredential, CredentialMetadata } from '@/utils/credentialService';
import { getCurrentUserData } from '@/utils/authService';

export default function NewCredential() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (credential: {
    type: 'education' | 'certificate' | 'experience';
    title: string;
    issuer: string;
    dateIssued: string;
    description: string;
    files?: File[];
    documentUrls?: string[];
  }) => {
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      // Check if user is logged in
      const currentUser = await getCurrentUserData();
      if (!currentUser) {
        router.push('/login');
        return;
      }
      
      // Create the credential
      await createCredential({
        type: credential.type,
        title: credential.title,
        issuer: credential.issuer,
        dateIssued: credential.dateIssued,
        description: credential.description,
        userId: currentUser.uid,
        userAddress: currentUser.walletAddress || '',
        status: 'pending',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        documentUrl: credential.documentUrls ? credential.documentUrls[0] : undefined
      });
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error: any) {
      console.error('Error creating credential:', error);
      setError(error.message || 'Failed to create credential');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <Link 
            href="/dashboard" 
            className="text-indigo-600 hover:text-indigo-800 mr-4"
          >
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Add New Credential</h1>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <p>Credential successfully created! Redirecting to dashboard...</p>
          </div>
        ) : (
          <CredentialForm onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
} 