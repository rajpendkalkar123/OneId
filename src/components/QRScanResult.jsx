import React from 'react';

const QRScanResult = ({ data, onClose }) => {
  if (!data) return null;

  // Parse the data if it's a string
  const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

  // Extract DID components if present
  const didComponents = parsedData.identifier?.split(':') || [];
  const didMethod = didComponents[1];
  const didAddress = didComponents[2];
  const didTimestamp = didComponents[3];

  // Format date of birth if present
  const formatDateOfBirth = (dob) => {
    if (!dob) return '';
    try {
      const date = new Date(dob);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dob;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="bg-gray-900/50 rounded-xl p-8 backdrop-blur-lg max-w-md w-full mx-4 shadow-2xl border border-gray-700/50">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Scan Results
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
          {/* Name Field */}
          {parsedData.name && (
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
              <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
              <div className="text-white text-lg font-medium">{parsedData.name}</div>
            </div>
          )}

          {/* Date of Birth Field */}
          {parsedData.dateOfBirth && (
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
              <label className="block text-sm font-medium text-gray-400 mb-1">Date of Birth</label>
              <div className="text-white">{formatDateOfBirth(parsedData.dateOfBirth)}</div>
            </div>
          )}

          {/* DID Identifier */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
            <label className="block text-sm font-medium text-gray-400 mb-1">Decentralized Identifier (DID)</label>
            <div className="space-y-2">
              <div className="text-blue-400 font-mono break-all">
                <span className="text-gray-400">Method:</span> {didMethod}
              </div>
              <div className="text-blue-400 font-mono break-all">
                <span className="text-gray-400">Address:</span> {didAddress}
              </div>
              <div className="text-blue-400 font-mono break-all">
                <span className="text-gray-400">Timestamp:</span> {didTimestamp}
              </div>
            </div>
          </div>

          {/* Additional Fields */}
          {Object.entries(parsedData).map(([key, value]) => {
            // Skip fields that are already displayed
            if (['identifier', 'name', 'dateOfBirth'].includes(key)) return null;
            
            return (
              <div key={key} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                </label>
                <div className="text-white break-all">{value}</div>
              </div>
            );
          })}
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