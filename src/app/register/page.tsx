'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerUser, registerIssuer } from '@/utils/authService';
import { connectWallet } from '@/utils/web3';
import { UserRole } from '@/types';

export default function Register() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<UserRole>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [organization, setOrganization] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    try {
      const result = await connectWallet();
      if (result.success) {
        setWalletConnected(true);
        setWalletAddress(result.address || '');
      } else {
        setError(result.error || 'Failed to connect wallet');
      }
    } catch (error: any) {
      setError(error.message || 'Error connecting wallet');
    }
  };

  const validateForm = () => {
    if (!email || !password || !displayName) {
      setError('All fields are required');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (accountType === 'issuer' && !organization) {
      setError('Organization name is required for issuers');
      return false;
    }
    
    if (accountType === 'issuer' && !walletConnected) {
      setError('Wallet connection is required for issuers');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      if (accountType === 'user') {
        await registerUser(email, password, displayName, walletAddress);
        router.push('/dashboard');
      } else if (accountType === 'issuer') {
        await registerIssuer(email, password, displayName, organization, walletAddress);
        router.push('/issuer/pending');
      }
    } catch (error: any) {
      setError(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Create Your Account</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="flex rounded-md shadow-sm mb-6">
        <button
          type="button"
          className={`w-1/2 py-2 px-4 border ${
            accountType === 'user'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          } rounded-l-md focus:outline-none`}
          onClick={() => setAccountType('user')}
        >
          Regular User
        </button>
        <button
          type="button"
          className={`w-1/2 py-2 px-4 border ${
            accountType === 'issuer'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          } rounded-r-md focus:outline-none`}
          onClick={() => setAccountType('issuer')}
        >
          Credential Issuer
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        {accountType === 'issuer' && (
          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
              Organization Name
            </label>
            <input
              id="organization"
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        )}
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div>
          <button
            type="button"
            onClick={handleConnect}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              walletConnected ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {walletConnected 
              ? `Connected: ${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` 
              : 'Connect Wallet (Optional for Users)'}
          </button>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </div>
      </form>
      
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign in
        </Link>
      </p>
      
      {accountType === 'issuer' && (
        <div className="mt-4 p-4 bg-yellow-50 rounded-md border border-yellow-200">
          <p className="text-sm text-yellow-700">
            <strong>Note:</strong> Issuer accounts require verification by an admin before you can verify credentials.
          </p>
        </div>
      )}
    </div>
  );
} 