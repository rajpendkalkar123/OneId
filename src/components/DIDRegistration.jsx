import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

const DIDRegistration = () => {
  const { account, signer } = useWallet();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedDID, setGeneratedDID] = useState('');
  const [generatedPublicKey, setGeneratedPublicKey] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (account) {
      generateDIDFromWallet();
    }
  }, [account]);

  const generateDIDFromWallet = async () => {
    try {
      // Generate DID using the wallet address
      const did = `did:ethr:${account?.toLowerCase()}`;
      setGeneratedDID(did);

      // For public key, we'll use a simplified approach
      // We'll create a hash of the address to simulate a public key
      // In a real implementation, you would get this from your blockchain or wallet
      const addressHash = ethers.keccak256(ethers.toUtf8Bytes(account));
      const simplePublicKey = `0x${addressHash.slice(2, 66)}`; // Take first 32 bytes
      setGeneratedPublicKey(simplePublicKey);
      
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error generating DID:', error);
      setError('Failed to generate DID from wallet');
    }
  };

  const handleRegister = async () => {
    if (!account) {
      setError('Please connect your wallet first');
      return;
    }

    if (!generatedDID || !generatedPublicKey) {
      setError('DID and public key generation required');
      return;
    }

    setIsLoading(true);
    try {
      // Here you would interact with your smart contract
      // For now, we'll simulate the registration with a message signing
      const message = `Register DID: ${generatedDID}`;
      await signer.signMessage(message);
      
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-900/50 rounded-xl p-8 backdrop-blur-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-4">
              Register Your Decentralized Identity
            </h1>
            <p className="text-gray-400">
              We'll generate your unique Decentralized Identifier (DID) based on your wallet address.
              This will be your verifiable credential on the blockchain.
            </p>
          </div>

          {/* Illustration */}
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 relative">
              <div className="absolute inset-0 bg-purple-500/20 rounded-xl transform rotate-45"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg 
                  className="w-16 h-16 text-purple-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Wallet Connection Check */}
          {!account ? (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-center">
                Please connect your wallet to generate your DID
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Generated DID Display */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Your Generated DID
                </label>
                <div className="font-mono text-white break-all p-2 bg-gray-900/50 rounded">
                  {generatedDID || 'Generating...'}
                </div>
              </div>

              {/* Generated Public Key Display */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Your Public Key
                </label>
                <div className="font-mono text-white break-all p-2 bg-gray-900/50 rounded">
                  {generatedPublicKey ? (
                    <>
                      <span>{generatedPublicKey.slice(0, 10)}...</span>
                      <span className="opacity-50">{generatedPublicKey.slice(-8)}</span>
                    </>
                  ) : 'Generating...'}
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-400 text-center">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleRegister}
                  disabled={isLoading || !generatedDID || !generatedPublicKey}
                  className={`flex-1 px-6 py-3 rounded-lg button-gradient text-white transition-all ${
                    (isLoading || !generatedDID || !generatedPublicKey) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Registering...
                    </div>
                  ) : 'Register DID'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Success Message */}
          {isSuccess && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="bg-gray-900 p-6 rounded-xl shadow-xl">
                <div className="flex items-center justify-center mb-4">
                  <svg className="w-16 h-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white text-center mb-2">Registration Successful!</h3>
                <p className="text-gray-400 text-center">Your DID has been registered on the blockchain.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DIDRegistration; 