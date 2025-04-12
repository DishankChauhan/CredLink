'use client';

import { useState } from 'react';
import CredentialForm from '../components/CredentialForm';

type Credential = {
  id: string;
  type: 'education' | 'certificate' | 'experience';
  title: string;
  issuer: string;
  dateIssued: string;
  description: string;
  verified: boolean;
  dateVerified?: string;
};

export default function CredentialsPage() {
  const [credentials, setCredentials] = useState<Credential[]>([]);

  const handleSubmitCredential = (credential: any) => {
    // In a real app, this would send data to an API
    // and handle blockchain integration
    const newCredential: Credential = {
      id: Date.now().toString(),
      ...credential,
      verified: false,
    };
    
    setCredentials([...credentials, newCredential]);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Credentials</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <CredentialForm onSubmit={handleSubmitCredential} />
        </div>
        
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">My Credential Portfolio</h2>
            
            {credentials.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>You haven&apos;t added any credentials yet.</p>
                <p className="mt-2">Use the form to add your first credential.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {credentials.map((credential) => (
                  <div key={credential.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{credential.title}</h3>
                        <p className="text-gray-600">{credential.issuer}</p>
                        <p className="text-sm text-gray-500">Issued: {new Date(credential.dateIssued).toLocaleDateString()}</p>
                      </div>
                      <div className="text-sm">
                        {credential.verified ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            Verified
                          </span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {credential.description && (
                      <p className="text-gray-700 mt-2 text-sm">{credential.description}</p>
                    )}
                    
                    <div className="mt-4 flex justify-end space-x-2">
                      <button className="text-indigo-600 text-sm hover:text-indigo-800">
                        Request Verification
                      </button>
                      <button className="text-gray-600 text-sm hover:text-gray-800">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 