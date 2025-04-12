'use client';

import { useState } from 'react';

type CredentialType = 'education' | 'certificate' | 'experience';

type CredentialFormProps = {
  onSubmit: (credential: {
    type: CredentialType;
    title: string;
    issuer: string;
    dateIssued: string;
    description: string;
    file?: File;
  }) => void;
};

export default function CredentialForm({ onSubmit }: CredentialFormProps) {
  const [type, setType] = useState<CredentialType>('education');
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [dateIssued, setDateIssued] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !issuer || !dateIssued) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    
    onSubmit({
      type,
      title,
      issuer,
      dateIssued,
      description,
      file: file || undefined,
    });
    
    // Reset form after submission
    setType('education');
    setTitle('');
    setIssuer('');
    setDateIssued('');
    setDescription('');
    setFile(null);
    setIsLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add New Credential</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Credential Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as CredentialType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="education">Education</option>
            <option value="certificate">Certificate</option>
            <option value="experience">Work Experience</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={type === 'education' ? 'Degree Name' : type === 'certificate' ? 'Certificate Name' : 'Job Title'}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Issuer <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={type === 'education' ? 'University Name' : type === 'certificate' ? 'Issuing Organization' : 'Company Name'}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Issued <span className="text-red-500">*</span>
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
          <input
            type="file"
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <p className="mt-1 text-xs text-gray-500">Supported formats: PDF, JPG, PNG</p>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition disabled:bg-indigo-400"
          >
            {isLoading ? 'Processing...' : 'Submit Credential'}
          </button>
        </div>
      </form>
    </div>
  );
} 