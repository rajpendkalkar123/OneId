import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { ethers } from 'ethers';
import OneID from '../contracts/OneID.json';

const ScanResultPage = () => {
  const { data } = useParams();
  const navigate = useNavigate();

  // const { account } = useWallet();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  let documentData;
  try {
    documentData = JSON.parse(decodeURIComponent(data));
  } catch (err) {
    return (
      <div className="min-h-screen bg-gray-900 text-white pt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Invalid Document Data</h2>
            <p className="text-gray-400">The scanned document data is invalid or corrupted.</p>
            <button
              onClick={() => navigate('/scan')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleUpload = async () => {
    try {
      setUploading(true);
      setError('');
      setSuccess('');

      if (!process.env.REACT_APP_CONTRACT_ADDRESS) {
        throw new Error('Contract address not configured');
      }

      // Connect to the blockchain using ethers v6
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        process.env.REACT_APP_CONTRACT_ADDRESS,
        OneID.abi,
        signer
      );

      // Upload document to blockchain
      const tx = await contract.uploadDocument(
        documentData.documentType,
        documentData.documentData,
        documentData.fileName || 'scanned_document',
        documentData.fileType || 'application/pdf'
      );

      await tx.wait();
      setSuccess('Document uploaded successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border border-gray-700"
        >
          <h2 className="text-3xl font-bold mb-8 gradient-text">Document Details</h2>
          
          <div className="space-y-6">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Document Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-400">Type:</span>
                  <span className="ml-2 text-white capitalize">{documentData.documentType}</span>
                </div>
                <div>
                  <span className="text-gray-400">File Name:</span>
                  <span className="ml-2 text-white">{documentData.fileName || 'scanned_document'}</span>
                </div>
                <div>
                  <span className="text-gray-400">File Type:</span>
                  <span className="ml-2 text-white">{documentData.fileType || 'application/pdf'}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm">{error}</div>
            )}

            {success && (
              <div className="text-green-400 text-sm">{success}</div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/scan')}
                className="flex-1 py-3 px-4 rounded-lg text-white font-medium bg-gray-700 hover:bg-gray-600"
              >
                Scan Another
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !process.env.REACT_APP_CONTRACT_ADDRESS}
                className={`flex-1 py-3 px-4 rounded-lg text-white font-medium ${
                  uploading || !process.env.REACT_APP_CONTRACT_ADDRESS
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                }`}
              >
                {uploading ? 'Uploading...' : 'Upload to Blockchain'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ScanResultPage; 