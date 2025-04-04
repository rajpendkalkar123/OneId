import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { ethers } from 'ethers';
import OneID from '../contracts/OneID.json';
import { Html5QrcodeScanner } from 'html5-qrcode';

const UploadDocument = () => {
  const { account } = useWallet();
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size should be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const startScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
    }

    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (decodedText) => {
        try {
          const data = JSON.parse(decodedText);
          if (data.documentType && data.documentData) {
            handleScannedDocument(data);
          } else {
            setError('Invalid QR code format');
          }
        } catch (err) {
          setError('Error parsing QR code data');
        }
        scanner.clear();
        setScanning(false);
      },
      (error) => {
        console.error('QR Scanner error:', error);
        setError('Failed to scan QR code');
        setScanning(false);
      }
    );

    scannerRef.current = scanner;
    setScanning(true);
  };

  const handleScannedDocument = async (data) => {
    try {
      setUploading(true);
      setError('');
      setSuccess('');

      // Connect to the blockchain
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.REACT_APP_CONTRACT_ADDRESS,
        OneID.abi,
        signer
      );

      // Upload document to blockchain
      const tx = await contract.uploadDocument(
        data.documentType,
        data.documentData,
        data.fileName || 'scanned_document',
        data.fileType || 'application/pdf'
      );

      await tx.wait();
      setSuccess('Document uploaded successfully!');
      setDocumentType('');
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentType) {
      setError('Please select a file and document type');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setSuccess('');

      // Read file as base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      
      reader.onload = async () => {
        const base64Data = reader.result.split(',')[1];
        
        // Connect to the blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          process.env.REACT_APP_CONTRACT_ADDRESS,
          OneID.abi,
          signer
        );

        // Upload document to blockchain
        const tx = await contract.uploadDocument(
          documentType,
          base64Data,
          selectedFile.name,
          selectedFile.type
        );

        await tx.wait();
        setSuccess('Document uploaded successfully!');
        setSelectedFile(null);
        setDocumentType('');
      };

      reader.onerror = () => {
        setError('Error reading file');
        setUploading(false);
      };
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-900 text-white pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Please connect your wallet to upload documents</h2>
            <p className="text-gray-400">You need to be logged in to upload and verify documents.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border border-gray-700"
        >
          <h2 className="text-3xl font-bold mb-8 gradient-text">Upload Document</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Document Type
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select document type</option>
                <option value="passport">Passport</option>
                <option value="drivers_license">Driver's License</option>
                <option value="national_id">National ID</option>
                <option value="utility_bill">Utility Bill</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Document File
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-700/50 hover:bg-gray-700">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">PDF, JPG, PNG (MAX. 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </label>
              </div>
              {selectedFile && (
                <p className="mt-2 text-sm text-gray-300">
                  Selected file: {selectedFile.name}
                </p>
              )}
            </div>

            <div className="text-center">
              <p className="text-gray-400 mb-4">OR</p>
              <button
                onClick={startScanner}
                className="w-full py-3 px-4 rounded-lg text-white font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {scanning ? 'Scanning...' : 'Scan QR Code'}
              </button>
            </div>

            {scanning && (
              <div id="reader" className="w-full h-64 bg-gray-700 rounded-lg"></div>
            )}

            {error && (
              <div className="text-red-400 text-sm">{error}</div>
            )}

            {success && (
              <div className="text-green-400 text-sm">{success}</div>
            )}

            <button
              onClick={handleUpload}
              disabled={uploading || !selectedFile || !documentType}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                uploading || !selectedFile || !documentType
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
              }`}
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UploadDocument; 