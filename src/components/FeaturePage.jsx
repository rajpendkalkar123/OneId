import React from 'react';
import { Link } from 'react-router-dom';

const FeaturePage = () => {
  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            OneID - Decentralized Identity Management
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A revolutionary blockchain-based identity management system that puts you in control of your digital identity
          </p>
        </div>

        {/* Architecture Overview */}
        <div className="bg-gray-900/50 rounded-xl p-8 backdrop-blur-lg mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">System Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-400">Core Components</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Blockchain Network (Ethereum)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Smart Contracts for Identity Management</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Decentralized Storage (IPFS)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Web3 Authentication</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-400">Security Features</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>End-to-End Encryption</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Zero-Knowledge Proofs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Multi-Factor Authentication</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Biometric Verification</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Feature 1 */}
          <div className="bg-gray-900/50 rounded-xl p-6 backdrop-blur-lg">
            <div className="text-blue-400 text-3xl mb-4">🔐</div>
            <h3 className="text-xl font-semibold text-white mb-2">Secure Identity Management</h3>
            <p className="text-gray-400">
              Take full control of your digital identity with our secure, decentralized system
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-900/50 rounded-xl p-6 backdrop-blur-lg">
            <div className="text-blue-400 text-3xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-white mb-2">QR Code Authentication</h3>
            <p className="text-gray-400">
              Quick and secure authentication using QR codes for seamless identity verification
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-900/50 rounded-xl p-6 backdrop-blur-lg">
            <div className="text-blue-400 text-3xl mb-4">🔗</div>
            <h3 className="text-xl font-semibold text-white mb-2">Blockchain Integration</h3>
            <p className="text-gray-400">
              Leverage the power of blockchain for tamper-proof identity records
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-gray-900/50 rounded-xl p-6 backdrop-blur-lg">
            <div className="text-blue-400 text-3xl mb-4">🛡️</div>
            <h3 className="text-xl font-semibold text-white mb-2">Privacy Protection</h3>
            <p className="text-gray-400">
              Your data remains private and secure with advanced encryption
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-gray-900/50 rounded-xl p-6 backdrop-blur-lg">
            <div className="text-blue-400 text-3xl mb-4">🌐</div>
            <h3 className="text-xl font-semibold text-white mb-2">Cross-Platform Support</h3>
            <p className="text-gray-400">
              Access your identity from any device with our responsive design
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-gray-900/50 rounded-xl p-6 backdrop-blur-lg">
            <div className="text-blue-400 text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-white mb-2">Fast Verification</h3>
            <p className="text-gray-400">
              Quick and efficient identity verification process
            </p>
          </div>
        </div>

        {/* Workflow Section */}
        <div className="bg-gray-900/50 rounded-xl p-8 backdrop-blur-lg">
          <h2 className="text-2xl font-bold text-white mb-6">How It Works</h2>
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold text-xl mr-4">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Create Your Identity</h3>
                <p className="text-gray-400">
                  Set up your digital identity with secure credentials and biometric data
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold text-xl mr-4">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Generate QR Code</h3>
                <p className="text-gray-400">
                  Create a unique QR code that represents your identity
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold text-xl mr-4">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Verify Identity</h3>
                <p className="text-gray-400">
                  Scan QR codes to verify identities securely and instantly
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold text-xl mr-4">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Manage Access</h3>
                <p className="text-gray-400">
                  Control who can access your identity information
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg button-gradient text-white hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturePage; 