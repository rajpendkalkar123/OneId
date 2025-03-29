import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import AadharDID from '../contracts/AadharDID.json';
import { QRCodeSVG } from 'qrcode.react';
import { formatDistanceToNow } from 'date-fns';

const Dashboard = () => {
  const { account, signer } = useWallet();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userDID, setUserDID] = useState('');
  const [userPublicKey, setUserPublicKey] = useState('');
  const [recentActivity, setRecentActivity] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    if (!account) {
      navigate('/');
      return;
    }

    // Generate DID from wallet address
    const did = `did:ethr:${account.toLowerCase()}`;
    setUserDID(did);

    // Generate public key from wallet address
    const addressHash = ethers.keccak256(ethers.toUtf8Bytes(account));
    const publicKey = `0x${addressHash.slice(2, 66)}`;
    setUserPublicKey(publicKey);

    // Set mock recent activity data
    setRecentActivity([
      {
        type: 'DID Registration',
        description: 'Identity created on Ethereum blockchain',
        timestamp: Math.floor(Date.now() / 1000) // Just now
      },
      {
        type: 'Profile Update',
        description: 'Added new credentials',
        timestamp: Math.floor(Date.now() / 1000) - 7200 // 2 hours ago
      },
      {
        type: 'Verification Request',
        description: 'Credential verification completed',
        timestamp: Math.floor(Date.now() / 1000) - 86400 // 1 day ago
      }
    ]);

    loadDocuments();
  }, [account, navigate]);

  const getContract = () => {
    const contractAddress = process.env.REACT_APP_AADHAR_DID_ADDRESS;
    if (!contractAddress) {
      throw new Error('Contract address not found in environment variables');
    }
    if (!signer) {
      throw new Error('Signer not available');
    }
    return new ethers.Contract(contractAddress, AadharDID.abi, signer);
  };

  const loadDocuments = async () => {
    try {
      const contract = getContract();
      const docs = await contract.getDocumentsByAddress(account);
      setDocuments(docs);
    } catch (err) {
      console.error('Error loading documents:', err);
      setError(err.message || 'Failed to load documents');
    }
  };

  const handleShowQRCode = (document) => {
    setSelectedDocument(document);
    setShowQRCode(true);
  };

  const qrData = selectedDocument ? JSON.stringify({
    did: userDID,
    documentId: selectedDocument.id,
    documentHash: selectedDocument.hash,
    timestamp: selectedDocument.timestamp
  }) : '';

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const timeAgo = formatDistanceToNow(date, { addSuffix: true });
    
    // Convert "about 1 hour ago" to "1 hour ago"
    return timeAgo.replace('about ', '');
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white pt-24">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 gradient-text">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Block - Identity and Recent Activity */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-2xl p-8 backdrop-blur-lg border border-gray-700/50 shadow-xl">
              <h2 className="text-3xl font-bold mb-8 gradient-text">Your Identity</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Wallet Address</label>
                  <div className="font-mono text-white break-all p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                    {account}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Public Key</label>
                  <div className="font-mono text-white break-all p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                    <span className="opacity-100">{userPublicKey.slice(0, 20)}</span>
                    <span className="opacity-50">...</span>
                    <span className="opacity-100">{userPublicKey.slice(-8)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-2xl p-8 backdrop-blur-lg border border-gray-700/50 shadow-xl">
              <h2 className="text-3xl font-bold mb-8 gradient-text">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="group p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-medium text-lg text-white">{activity.type}</h3>
                        <p className="text-sm text-gray-400">{activity.description}</p>
                      </div>
                      <span className="text-sm text-gray-400">
                        {formatTimestamp(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Block - Documents */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-2xl p-8 backdrop-blur-lg border border-gray-700/50 shadow-xl">
              <h2 className="text-3xl font-bold mb-8 gradient-text">Your Documents</h2>
              <div className="space-y-4">
                {documents.map((doc, index) => (
                  <div key={index} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{doc.name}</h3>
                        <p className="text-sm text-gray-400 mt-1">{doc.type}</p>
                        <p className="text-xs text-gray-500 mt-2">Added: {new Date(doc.timestamp * 1000).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className={`px-3 py-1 rounded-full text-xs ${
                          doc.verified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {doc.verified ? 'Verified' : 'Pending'}
                        </div>
                        <button
                          onClick={() => handleShowQRCode(doc)}
                          className="p-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
                        >
                          View QR
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {documents.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No documents found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Modal */}
        {showQRCode && selectedDocument && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-700/50 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold gradient-text">Document QR Code</h2>
                <button
                  onClick={() => setShowQRCode(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  <h3 className="font-medium text-lg">{selectedDocument.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{selectedDocument.type}</p>
                </div>
                <div className="flex justify-center p-6 bg-white rounded-2xl shadow-lg">
                  <QRCodeSVG value={qrData} size={200} />
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-500 text-center">{error}</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 