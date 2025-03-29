import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import blockchainSecurity from './images/blockchain-security.png';

const Hero = () => {
  const { connectWallet, account } = useWallet();
  const navigate = useNavigate();

  const handleRegisterDID = async () => {
    if (!account) {
      await connectWallet();
    }
    navigate('/register');
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] pt-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start relative z-10">
            <div className="pt-12">
              <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                Secure Your Identity<br />
                <span className="gradient-text">With Blockchain</span>
              </h1>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl">
                Enter the future of decentralized identity management. Simplify authentication, enhance security, and take control of your digital identity.
              </p>
              <div className="flex space-x-4">
                <button 
                  onClick={connectWallet}
                  className="px-6 py-3 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                >
                  Connect Wallet
                </button>
                <button 
                  onClick={handleRegisterDID}
                  className="px-6 py-3 rounded-lg button-gradient text-white hover:opacity-90 transition-opacity"
                >
                  Register DID
                </button>
              </div>
              <div className="mt-8 text-sm text-purple-400">
                Powered by Ethereum Blockchain
              </div>
            </div>
            <div className="flex justify-center items-center p-4">
              <div className="w-full max-w-xl">
                <img 
                  src={blockchainSecurity}
                  alt="Blockchain Security Illustration" 
                  className="w-full h-auto transform hover:scale-105 transition-transform duration-300"
                  style={{
                    filter: 'drop-shadow(0 0 10px rgba(78, 132, 238, 0.2))',
                    maxHeight: '600px',
                    objectFit: 'contain'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Abstract geometric illustration */}
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-1/2 opacity-50">
            <div className="relative">
              <div className="absolute w-96 h-96 border border-purple-500/20 rounded-lg transform rotate-45"></div>
              <div className="absolute w-96 h-96 border border-purple-500/20 rounded-lg transform -rotate-12"></div>
              <div className="absolute w-4 h-4 bg-purple-500 rounded-full top-20 right-20"></div>
              <div className="absolute w-3 h-3 bg-blue-500 rounded-full top-40 right-40"></div>
              <div className="absolute w-2 h-2 bg-indigo-500 rounded-full top-60 right-60"></div>
            </div>
          </div>
        </div>

        {/* Workflow Steps */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center gradient-text">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl hero-gradient backdrop-blur-lg transform hover:scale-105 transition-all">
              <div className="h-48 mb-6 flex items-center justify-center">
                <img 
                  src="/images/wallet-connect.png" 
                  alt="Connect Wallet" 
                  className="h-32 w-auto object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4 gradient-text">Connect Wallet</h3>
              <p className="text-gray-400">Connect your MetaMask wallet to get started with secure identity management.</p>
            </div>
            
            <div className="p-6 rounded-xl hero-gradient backdrop-blur-lg transform hover:scale-105 transition-all">
              <div className="h-48 mb-6 flex items-center justify-center">
                <img 
                  src="/images/document-scan.png" 
                  alt="Document Scanning" 
                  className="h-32 w-auto object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4 gradient-text">Document Verification</h3>
              <p className="text-gray-400">Upload your documents for AI-powered scanning and secure data extraction.</p>
            </div>

            <div className="p-6 rounded-xl hero-gradient backdrop-blur-lg transform hover:scale-105 transition-all">
              <div className="h-48 mb-6 flex items-center justify-center">
                <img 
                  src="/images/blockchain-manage.png" 
                  alt="Blockchain Management" 
                  className="h-32 w-auto object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4 gradient-text">DID Management</h3>
              <p className="text-gray-400">Control your digital identity and manage document permissions through smart contracts.</p>
            </div>
          </div>
        </div>

        {/* Features section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl hero-gradient backdrop-blur-lg">
              <h3 className="text-xl font-semibold mb-4 gradient-text">Decentralized Identity</h3>
              <p className="text-gray-400">Take control of your digital identity with blockchain-powered DID technology.</p>
            </div>
            <div className="p-6 rounded-xl hero-gradient backdrop-blur-lg">
              <h3 className="text-xl font-semibold mb-4 gradient-text">Secure Authentication</h3>
              <p className="text-gray-400">Authenticate securely across platforms using your decentralized identity.</p>
            </div>
            <div className="p-6 rounded-xl hero-gradient backdrop-blur-lg">
              <h3 className="text-xl font-semibold mb-4 gradient-text">Privacy Control</h3>
              <p className="text-gray-400">Maintain complete control over your personal data and digital credentials.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero; 