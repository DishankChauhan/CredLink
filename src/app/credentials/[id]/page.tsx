'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getCredentialById, CredentialMetadata } from '@/utils/credentialService';
import { getCurrentUserData } from '@/utils/authService';

export default function CredentialDetail() {
  const router = useRouter();
  const params = useParams();
  const credentialId = params.id as string;
  const [credential, setCredential] = useState<CredentialMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user is logged in
        const currentUser = await getCurrentUserData();
        if (!currentUser) {
          router.push('/login');
          return;
        }
        
        // Fetch credential details
        const credentialData = await getCredentialById(credentialId);
        if (!credentialData) {
          setError('Credential not found');
        } else if (credentialData.userId !== currentUser.uid) {
          setError('You do not have permission to view this credential');
        } else {
          setCredential(credentialData);
        }
      } catch (error: any) {
        console.error('Error fetching credential:', error);
        setError(error.message || 'Failed to load credential');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [credentialId, router]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'revoked':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading credential details...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <Link 
            href="/dashboard" 
            className="text-indigo-600 hover:text-indigo-800 mr-4"
          >
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Credential Details</h1>
        </div>
        
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : credential ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{credential.title}</h2>
                  <p className="text-gray-500 capitalize">{credential.type}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(credential.status)}`}>
                  {credential.status}
                </span>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Issuer</h3>
                <p>{credential.issuer}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Date Issued</h3>
                <p>{credential.dateIssued}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="whitespace-pre-line">{credential.description}</p>
              </div>
              
              {credential.documentUrl && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Supporting Document</h3>
                  <div className="border rounded-md p-4 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">
                          {credential.documentUrl.includes('.pdf') ? 'PDF Document' : 'Supporting Document'}
                        </p>
                        <a 
                          href={credential.documentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 inline-flex items-center"
                        >
                          View Document
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <a 
                          href={credential.documentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                          download
                        >
                          Download
                        </a>
                      </div>
                    </div>
                    
                    {credential.documentUrl.includes('.pdf') && (
                      <div className="mt-4">
                        <iframe
                          src={`${credential.documentUrl}#toolbar=0&navpanes=0`}
                          className="w-full h-72 border rounded"
                          title="Document Preview"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {credential.credentialId && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold mb-2">Blockchain Verification</h3>
                  <div className="bg-gray-50 p-4 rounded border">
                    <div className="mb-2">
                      <span className="text-sm text-gray-500">Credential ID:</span>
                      <p className="font-mono text-sm break-all">{credential.credentialId}</p>
                    </div>
                    {credential.credentialHash && (
                      <div>
                        <span className="text-sm text-gray-500">Credential Hash:</span>
                        <p className="font-mono text-sm break-all">{credential.credentialHash}</p>
                      </div>
                    )}
                    {credential.verifiedAt && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-500">Verified On:</span>
                        <p>{new Date(credential.verifiedAt).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 px-6 py-4 border-t">
              <div className="text-right">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  Print / Save as PDF
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
} 