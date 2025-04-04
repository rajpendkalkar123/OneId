import React from 'react';

const QRScanResult = ({ data, onClose }) => {
  if (!data) return null;

  // Parse the data if it's a string
  const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="bg-gray-900/50 rounded-xl p-8 backdrop-blur-lg max-w-md w-full mx-4 shadow-2xl border border-gray-700/50">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Verification Result
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Verification Status */}
          <div className={`p-4 rounded-lg ${
            parsedData.verificationResult 
              ? 'bg-green-500/20 border-green-500/50' 
              : 'bg-red-500/20 border-red-500/50'
          } border`}>
            <div className="flex items-center space-x-2">
              {parsedData.verificationResult ? (
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <p className={`text-lg font-medium ${
                parsedData.verificationResult ? 'text-green-400' : 'text-red-400'
              }`}>
                {parsedData.verificationResult 
                  ? 'Verification Successful' 
                  : 'Verification Failed'}
              </p>
            </div>
          </div>

          {/* Verified Attributes */}
          {parsedData.attributes && (
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Verified Attributes</h3>
              <div className="space-y-2">
                {Object.entries(parsedData.attributes).map(([key, value]) => (
                  value && (
                    <div key={key} className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-300">
                        {key === 'age' ? 'Age is over 18' : key}
                      </span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanResult; 