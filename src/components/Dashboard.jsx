import React from 'react';
import { useWallet } from '../context/WalletContext';

const Dashboard = () => {
  const { account } = useWallet();

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-900/50 rounded-xl p-6 backdrop-blur-lg">
          <h1 className="text-3xl font-bold mb-6 gradient-text">Dashboard</h1>
          
          {/* User Info Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Your Identity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-gray-400">Wallet Address</p>
                <p className="text-white font-mono">{account}</p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-gray-400">DID Status</p>
                <p className="text-green-400">Active</p>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white">DID Registration</p>
                    <p className="text-gray-400 text-sm">Identity created on Ethereum blockchain</p>
                  </div>
                  <span className="text-gray-400 text-sm">Just now</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 bg-gray-800/50 rounded-lg text-white hover:bg-gray-700/50 transition-colors">
                Verify Credentials
              </button>
              <button className="p-4 bg-gray-800/50 rounded-lg text-white hover:bg-gray-700/50 transition-colors">
                Update Profile
              </button>
              <button className="p-4 bg-gray-800/50 rounded-lg text-white hover:bg-gray-700/50 transition-colors">
                View History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 