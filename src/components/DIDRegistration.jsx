import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import AadharDID from '../contracts/AadharDID.json';
import { createWorker } from 'tesseract.js';

const DIDRegistration = () => {
  const { account, signer } = useWallet();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [aadharData, setAadharData] = useState({
    name: '',
    aadharNumber: '',
    dob: '',
    address: '',
    gender: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (!account) {
      navigate('/');
    }
  }, [account, navigate]);

  // Function to clean extracted text
  const cleanText = (text) => {
    return text.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  };

  // Function to extract specific information based on pattern
  const extractSpecificText = (text, pattern) => {
    const regex = new RegExp(pattern, 'g');
    const matches = text.match(regex);
    return matches ? matches[0] : '';
  };

  const preprocessImage = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set canvas size to match image
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw image
          ctx.drawImage(img, 0, 0);
          
          // Apply grayscale and contrast
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            const contrast = 1.5; // Adjust contrast factor as needed
            
            const newValue = ((avg - 128) * contrast) + 128;
            data[i] = data[i + 1] = data[i + 2] = newValue;
          }
          
          ctx.putImageData(imageData, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Start scanning
    setScanning(true);
    setScanProgress(0);
    setError('');

    try {
      // Preprocess the image
      setScanProgress(20);
      const processedImageData = await preprocessImage(file);

      // Initialize Tesseract worker
      setScanProgress(40);
      const worker = await createWorker();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');

      // Set up progress monitoring
      worker.setProgressHandler(progress => {
        setScanProgress(40 + Math.floor(progress.progress * 40));
      });

      // Perform OCR
      setScanProgress(60);
      const { data: { text } } = await worker.recognize(processedImageData);
      await worker.terminate();

      // Clean and extract data
      setScanProgress(80);
      const cleanedText = cleanText(text);
      
      // Extract specific information
      const extractedData = {
        name: extractSpecificText(cleanedText, /([A-Za-z]+(?:\s[A-Za-z]+)+)/g),
        aadharNumber: extractSpecificText(cleanedText, /\d{4}\s?\d{4}\s?\d{4}/g),
        dob: extractSpecificText(cleanedText, /\d{2}\/\d{2}\/\d{4}/g),
        gender: extractSpecificText(cleanedText, /Gender\s*:\s*([MF])/i),
        address: extractSpecificText(cleanedText, /Address\s*:\s*([^\n]+)/i)
      };

      setAadharData(extractedData);
      setScanProgress(100);
      setScanning(false);
    } catch (err) {
      console.error('Error scanning image:', err);
      setError('Failed to scan Aadhar card. Please try again.');
      setScanning(false);
      setScanProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const contract = new ethers.Contract(
        process.env.REACT_APP_AADHAR_DID_ADDRESS,
        AadharDID.abi,
        signer
      );

      const tx = await contract.createAadharDID(
        aadharData.name,
        aadharData.aadharNumber,
        aadharData.dob,
        aadharData.address,
        aadharData.gender
      );

      await tx.wait();
      setSuccess('DID registered successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error('Error registering DID:', err);
      setError(err.message || 'Failed to register DID. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center gradient-text">
          Register Your DID
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Upload Aadhar Card Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                required
              />
            </div>

            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Aadhar Preview"
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            )}

            {scanning && (
              <div className="mt-4">
                <div className="text-center text-purple-400 mb-2">
                  Scanning Aadhar card... {scanProgress}%
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-purple-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={aadharData.name}
                  onChange={(e) => setAadharData({ ...aadharData, name: e.target.value })}
                  className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Aadhar Number</label>
                <input
                  type="text"
                  value={aadharData.aadharNumber}
                  onChange={(e) => setAadharData({ ...aadharData, aadharNumber: e.target.value })}
                  className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date of Birth</label>
                <input
                  type="text"
                  value={aadharData.dob}
                  onChange={(e) => setAadharData({ ...aadharData, dob: e.target.value })}
                  className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Gender</label>
                <input
                  type="text"
                  value={aadharData.gender}
                  onChange={(e) => setAadharData({ ...aadharData, gender: e.target.value })}
                  className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <textarea
                value={aadharData.address}
                onChange={(e) => setAadharData({ ...aadharData, address: e.target.value })}
                className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                rows="3"
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          {success && (
            <div className="text-green-500 text-sm">{success}</div>
          )}

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 rounded-lg button-gradient text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register DID'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="py-2 px-4 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DIDRegistration; 