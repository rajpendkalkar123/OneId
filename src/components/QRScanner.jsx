import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { ethers } from 'ethers';

const QRScanner = () => {
  const [error, setError] = useState(null);
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setError(null);
      } catch (err) {
        console.error('Error connecting wallet:', err);
        setError('Failed to connect wallet. Please try again.');
      }
    } else {
      setError('Please install MetaMask!');
    }
  };

  const generateResultUrl = (data) => {
    try {
      // Convert the data to a base64 string
      const dataString = JSON.stringify(data);
      const base64Data = btoa(dataString);
      // Create the URL with the base64 data
      const url = `/scan-result/${base64Data}`;
      console.log('Generated URL:', url);
      return url;
    } catch (error) {
      console.error('Error generating URL:', error);
      throw error;
    }
  };

  useEffect(() => {
    let scanner;
    try {
      scanner = new Html5QrcodeScanner("qr-reader", {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true,
      });

      const success = (decodedText) => {
        try {
          console.log('QR Code scanned:', decodedText);
          // Parse the decoded text as JSON
          const parsedData = JSON.parse(decodedText);
          console.log('Parsed data:', parsedData);
          // Stop the scanner
          scanner.clear();
          // Generate URL and navigate
          const resultUrl = generateResultUrl(parsedData);
          console.log('Navigating to:', resultUrl);
          navigate(resultUrl);
        } catch (error) {
          console.error('Error parsing QR code data:', error);
          // If it's not valid JSON, try to handle it as a direct DID string
          if (decodedText.startsWith('did:')) {
            console.log('Handling as DID string:', decodedText);
            scanner.clear();
            const resultUrl = generateResultUrl({ identifier: decodedText });
            console.log('Navigating to:', resultUrl);
            navigate(resultUrl);
          } else {
            console.error('Invalid QR code format:', decodedText);
            setError('Invalid QR code format');
          }
        }
      };

      const error = (errorMessage) => {
        console.warn(`QR Code scan error: ${errorMessage}`);
        setError('Failed to scan QR code');
      };

      scanner.render(success, error);
    } catch (err) {
      console.error('Error initializing scanner:', err);
      setError('Failed to initialize camera. Please ensure you have granted camera permissions.');
    }

    // Cleanup
    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [navigate]);

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-900/50 rounded-xl p-8 backdrop-blur-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-4">
              Scan QR Code
            </h1>
            <p className="text-gray-400 mb-4">
              Position the QR code within the frame to scan
            </p>
            
            {/* Wallet Connection */}
            {!account ? (
              <div className="flex flex-col items-center gap-4 mb-4">
                <button
                  onClick={connectWallet}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg button-gradient text-white hover:opacity-90 transition-opacity"
                >
                  <span className="text-2xl">🔐</span>
                  Connect Wallet
                </button>
                <p className="text-sm text-gray-400">
                  Connect your MetaMask wallet to get started with secure identity management
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="px-4 py-2 bg-gray-800/50 rounded-lg text-sm text-gray-300">
                  {`${account.slice(0, 6)}...${account.slice(-4)}`}
                </div>
                <button
                  onClick={() => setAccount(null)}
                  className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-center">{error}</p>
            </div>
          )}

          {/* QR Scanner */}
          <div id="qr-reader" className="mb-8"></div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner; 