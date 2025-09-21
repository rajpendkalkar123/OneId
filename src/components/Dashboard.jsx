import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '../context/WalletContext';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import AadharDID from '../contracts/AadharDID.json';
import { QRCodeSVG } from 'qrcode.react';
import { formatDistanceToNow } from 'date-fns';
// import ZeroKnowledgeProof from './ZeroKnowledgeProof';

const Dashboard = () => {
  const { account, signer } = useWallet();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // const [userDID, setUserDID] = useState('');
  const [userPublicKey, setUserPublicKey] = useState('');
  const [recentActivity, setRecentActivity] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showCredentialSelector, setShowCredentialSelector] = useState(false);
  const [selectedCredentials, setSelectedCredentials] = useState([]);
  const [availableCredentials, setAvailableCredentials] = useState([]);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [ageThreshold, setAgeThreshold] = useState(18);
  const [ageVerified, setAgeVerified] = useState(false);

  const getContract = async () => {
    if (!signer) {
      throw new Error('Signer not available');
    }

    const provider = signer.provider;
    let address = process.env.REACT_APP_AADHAR_DID_ADDRESS;

    try {
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      // Network-specific address resolution
      if (chainId === 17000) {
        // Holesky testnet
        address = process.env.REACT_APP_AADHAR_DID_ADDRESS_HOLESKY || address;
      } else if (chainId === 31337 || chainId === 1337) {
        // Localhost Hardhat
        address = process.env.REACT_APP_AADHAR_DID_ADDRESS_LOCALHOST || AadharDID.address || address;
      }

      // Fallback to networks mapping in artifact
      if (!address && AadharDID.networks && AadharDID.networks[chainId]?.address) {
        address = AadharDID.networks[chainId].address;
      }

      if (!address) {
        throw new Error(`Contract address not configured for chain ${chainId}. Deploy the contract or set REACT_APP_AADHAR_DID_ADDRESS_${chainId === 17000 ? 'HOLESKY' : 'LOCALHOST'} in .env`);
      }
      if (!ethers.isAddress(address)) {
        throw new Error('Invalid contract address configured.');
      }

      // Verify code exists at the address on the current chain
      const code = await provider.getCode(address);
      if (!code || code === '0x') {
        throw new Error(`No contract found at ${address} on chain ${chainId}. Deploy the contract or set a correct address for this network.`);
      }

      return new ethers.Contract(address, AadharDID.abi, signer);
    } catch (e) {
      // Surface a helpful message
      throw e;
    }
  };

  const loadUserDIDs = useCallback(async () => {
    try {
      setLoading(true);
      const contract = await getContract();

      // Get user's DIDs
      const userDIDs = await contract.getUserDIDs(account);
      
      // For each DID, get the details
      const detailsPromises = userDIDs.map(async (did, index) => {
        const details = await contract.getAadharDetails(account, index);
        return {
          identifier: details.identifier,
          name: details.name,
          dateOfBirth: details.dateOfBirth,
          gender: details.gender,
          address: details.addr,
          aadharNumber: details.aadharNumber,
          active: details.active,
          createdAt: Number(details.createdAt),
          updatedAt: Number(details.updatedAt)
        };
      });

      const documentsWithDetails = await Promise.all(detailsPromises);
      setDocuments(documentsWithDetails);

      // Set recent activity based on the documents
      const activity = documentsWithDetails.map(doc => ({
        type: 'DID Registration',
        description: `Identity created for ${doc.name}`,
        timestamp: doc.createdAt
      }));

      setRecentActivity(activity);
    } catch (err) {
      console.error('Error loading DIDs:', err);
      setError(`Failed to load your DIDs: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  }, [account, signer]);

  useEffect(() => {
    if (!account) {
      navigate('/');
      return;
    }

    // Generate DID from wallet address
    const did = `did:ethr:${account.toLowerCase()}`;
    // setUserDID(did);

    // Generate public key from wallet address
    const addressHash = ethers.keccak256(ethers.toUtf8Bytes(account));
    const publicKey = `0x${addressHash.slice(2, 66)}`;
    setUserPublicKey(publicKey);

    // Load DIDs and recent activity
    loadUserDIDs();
  }, [account, navigate, loadUserDIDs]);


  const handleShowQRCode = (document) => {
    setSelectedDocument(document);
    // Set available credentials first
    setAvailableCredentials([
      { key: 'name', label: 'Full Name', value: document.name },
      { key: 'aadharNumber', label: 'Aadhar Number', value: document.aadharNumber },
      { key: 'gender', label: 'Gender', value: document.gender },
      { key: 'address', label: 'Address', value: document.address },
      { key: 'createdAt', label: 'Created At', value: new Date(document.createdAt * 1000).toLocaleString() }
    ]);
    // Show age verification first
    setShowAgeVerification(true);
  };

  const handleAgeVerification = (threshold) => {
    if (!selectedDocument || !selectedDocument.dateOfBirth) {
      setError('Document or date of birth not available');
      return;
    }

    const dob = new Date(selectedDocument.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    setAgeVerified(age >= threshold);
    setAgeThreshold(threshold);
    setShowAgeVerification(false);
    // After age verification, show credential selector
    setShowCredentialSelector(true);
  };

  const handleCredentialSelection = () => {
    setShowCredentialSelector(false);
    setShowQRCode(true);
  };

  const generateQRData = () => {
    if (!selectedDocument) return '';
    
    const selectedData = [];
    availableCredentials.forEach(cred => {
      if (selectedCredentials.includes(cred.key)) {
        selectedData.push(`${cred.label}: ${cred.value}`);
      }
    });

    // Add age verification result
    selectedData.push(`Age Verification: ${ageVerified ? 'Verified' : 'Not Verified'} (${ageThreshold}+)`);
    
    return `Document ID: ${selectedDocument.identifier}\n${selectedData.join('\n')}`;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const timeAgo = formatDistanceToNow(date, { addSuffix: true });
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
                {recentActivity.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No recent activity</p>
                  </div>
                )}
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
                        <p className="text-sm text-gray-400 mt-1">Aadhar: {doc.aadharNumber}</p>
                        <p className="text-xs text-gray-500 mt-2">Created: {formatTimestamp(doc.createdAt)}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className={`px-3 py-1 rounded-full text-xs ${
                          doc.active ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {doc.active ? 'Active' : 'Inactive'}
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

        {/* Age Verification Modal */}
        {showAgeVerification && selectedDocument && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-700/50 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold gradient-text">Age Verification</h2>
                <button
                  onClick={() => setShowAgeVerification(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  <h3 className="font-medium text-lg text-white">{selectedDocument.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">Aadhar: {selectedDocument.aadharNumber}</p>
                </div>
                
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-300">
                    Enter Age Threshold
                  </label>
                  <input
                    type="number"
                    min="12"
                    max="100"
                    value={ageThreshold}
                    onChange={(e) => setAgeThreshold(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => handleAgeVerification(ageThreshold)}
                    className="w-full px-6 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                  >
                    Verify Age
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Credential Selector Modal */}
        {showCredentialSelector && selectedDocument && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-700/50 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold gradient-text">Select Credentials</h2>
                <button
                  onClick={() => setShowCredentialSelector(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                {availableCredentials.map((cred) => (
                  <label key={cred.key} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedCredentials.includes(cred.key)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCredentials([...selectedCredentials, cred.key]);
                        } else {
                          setSelectedCredentials(selectedCredentials.filter(key => key !== cred.key));
                        }
                      }}
                      className="form-checkbox h-5 w-5 text-purple-500 rounded border-gray-600 bg-gray-700/50 focus:ring-purple-500"
                    />
                    <span className="text-white">{cred.label}</span>
                  </label>
                ))}
                
                <button
                  onClick={handleCredentialSelection}
                  className="w-full px-6 py-2 mt-6 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                >
                  Generate QR Code
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QR Code Display */}
        {showQRCode && selectedDocument && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-700/50 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold gradient-text">QR Code</h2>
                <button
                  onClick={() => setShowQRCode(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <QRCodeSVG 
                  value={generateQRData()} 
                  size={256}
                  level="H"
                  className="mx-auto bg-white p-4 rounded-lg"
                />
                <p className="text-center text-sm text-gray-400 mt-4">
                  Scan this QR code to verify the credentials
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-500 text-center">{error}</div>
        )}

        {loading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="text-white">Loading...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 