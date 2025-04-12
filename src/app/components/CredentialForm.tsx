'use client';

import { useState, useRef } from 'react';
import { uploadFile } from '@/utils/fileUpload';

type CredentialType = 'education' | 'certificate' | 'experience';

type CredentialFormProps = {
  onSubmit: (credential: {
    type: CredentialType;
    title: string;
    issuer: string;
    dateIssued: string;
    description: string;
    file?: File;
    documentUrl?: string;
  }) => void;
  initialData?: Partial<{
    type: CredentialType;
    title: string;
    issuer: string;
    dateIssued: string;
    description: string;
    documentUrl?: string;
  }>;
};

export default function CredentialForm({ onSubmit, initialData }: CredentialFormProps) {
  const [type, setType] = useState<CredentialType>(initialData?.type || 'education');
  const [title, setTitle] = useState(initialData?.title || '');
  const [issuer, setIssuer] = useState(initialData?.issuer || '');
  const [dateIssued, setDateIssued] = useState(initialData?.dateIssued || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [file, setFile] = useState<File | null>(null);
  const [existingFileUrl, setExistingFileUrl] = useState(initialData?.documentUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !issuer || !dateIssued) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      let documentUrl = existingFileUrl;
      
      // If a new file is selected, upload it
      if (file) {
        setIsUploading(true);
        
        // Upload file to Firebase Storage
        try {
          // Simulate upload progress (we can't track actual progress easily with Firebase JS SDK)
          const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
              if (prev >= 90) clearInterval(progressInterval);
              return Math.min(prev + 10, 90);
            });
          }, 300);
          
          documentUrl = await uploadFile(file);
          
          clearInterval(progressInterval);
          setUploadProgress(100);
        } catch (error: any) {
          setUploadError(error.message || 'Failed to upload document');
          setIsLoading(false);
          return;
        } finally {
          setIsUploading(false);
        }
      }
      
      onSubmit({
        type,
        title,
        issuer,
        dateIssued,
        description,
        file: file || undefined,
        documentUrl,
      });
      
      // Reset form after submission
      setType('education');
      setTitle('');
      setIssuer('');
      setDateIssued('');
      setDescription('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setExistingFileUrl('');
      setUploadProgress(0);
      setUploadError('');
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTypeSpecificInputs = () => {
    switch (type) {
      case 'education':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institution
              </label>
              <input
                type="text"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="University Name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Degree/Program
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Bachelor of Science in Computer Science"
                required
              />
            </div>
          </>
        );
      case 'certificate':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issuing Organization
              </label>
              <input
                type="text"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Certificate Authority"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Certificate Name
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="AWS Certified Solutions Architect"
                required
              />
            </div>
          </>
        );
      case 'experience':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company/Organization
              </label>
              <input
                type="text"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Company Name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position/Role
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Software Engineer"
                required
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add New Credential</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Credential Type
          </label>
          <div className="flex rounded-md shadow-sm mb-4">
            <button
              type="button"
              className={`w-1/3 py-2 px-4 border ${
                type === 'education'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } rounded-l-md focus:outline-none`}
              onClick={() => setType('education')}
            >
              Education
            </button>
            <button
              type="button"
              className={`w-1/3 py-2 px-4 border-t border-b ${
                type === 'certificate'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } focus:outline-none`}
              onClick={() => setType('certificate')}
            >
              Certificate
            </button>
            <button
              type="button"
              className={`w-1/3 py-2 px-4 border ${
                type === 'experience'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } rounded-r-md focus:outline-none`}
              onClick={() => setType('experience')}
            >
              Experience
            </button>
          </div>
        </div>
        
        {renderTypeSpecificInputs()}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Issued/Completed <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={dateIssued}
            onChange={(e) => setDateIssued(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
            placeholder={`Additional details about your ${type}`}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supporting Document
          </label>
          
          {existingFileUrl && !file && (
            <div className="mb-2 flex items-center">
              <a 
                href={existingFileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 underline mr-2"
              >
                View Existing Document
              </a>
              <button
                type="button"
                onClick={() => setExistingFileUrl('')}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                (Remove)
              </button>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            disabled={isUploading}
          />
          <p className="mt-1 text-xs text-gray-500">Supported formats: PDF, JPG, PNG, DOC</p>
          
          {isUploading && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Uploading: {uploadProgress}%</p>
            </div>
          )}
          
          {uploadError && (
            <p className="text-red-500 text-sm mt-1">{uploadError}</p>
          )}
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading || isUploading}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition disabled:bg-indigo-400 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Submit Credential'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 