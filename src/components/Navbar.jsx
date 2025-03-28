import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';

const Navbar = () => {
  const { account, connectWallet } = useWallet();
  const location = useLocation();

  return (
    <nav className="fixed w-full top-0 z-50 nav-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl md:text-3xl font-bold gradient-text">OneID</Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link 
                to="/" 
                className={`${location.pathname === '/' ? 'text-white' : 'text-gray-300'} hover:text-white`}
              >
                Home
              </Link>
              <Link 
                to="/dashboard" 
                className={`${location.pathname === '/dashboard' ? 'text-white' : 'text-gray-300'} hover:text-white`}
              >
                Dashboard
              </Link>
              <a href="#features" className="text-gray-300 hover:text-white">Features</a>
              <a href="#support" className="text-gray-300 hover:text-white">Support</a>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {account && (
              <span className="text-gray-300 text-sm">
                {`${account.slice(0, 6)}...${account.slice(-4)}`}
              </span>
            )}
            <button 
              onClick={connectWallet} 
              className="px-4 py-2 rounded-lg button-gradient text-white hover:opacity-90"
            >
              {account ? 'Wallet Connected' : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 