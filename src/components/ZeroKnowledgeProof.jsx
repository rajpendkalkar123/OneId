import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';

const ZeroKnowledgeProof = ({ document }) => {
  // const { account } = useWallet();
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAgeThreshold, setSelectedAgeThreshold] = useState(18);

  // Function to calculate accurate age
  const calculateAge = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const currentDate = new Date();
    
    let age = currentDate.getFullYear() - dob.getFullYear();
    const monthDiff = currentDate.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < dob.getDate())) {
      age--;
    }
    
    return age;
  };

  // Function to verify age
  const verifyAge = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!document || !document.dateOfBirth) {
        throw new Error('Document or date of birth not provided');
      }

      // Calculate accurate age
      const age = calculateAge(document.dateOfBirth);
      
      // Verify if age meets the threshold
      const meetsThreshold = age >= selectedAgeThreshold;
      
      setVerificationResult({
        meetsThreshold,
        age
      });
    } catch (error) {
      console.error('Error verifying age:', error);
      setError(error.message || 'Failed to verify age. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
        <h3 className="text-lg font-medium text-white mb-2">Age Verification</h3>
        <p className="text-sm text-gray-400">
          Verify if the person meets the selected age requirement
        </p>
      </div>

      {/* Age Threshold Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select Age Threshold
        </label>
        <select
          value={selectedAgeThreshold}
          onChange={(e) => setSelectedAgeThreshold(Number(e.target.value))}
          className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          {Array.from({ length: 9 }, (_, i) => i + 12).map((age) => (
            <option key={age} value={age}>
              {age} years or older
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/50">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={verifyAge}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify Age'}
        </button>
      </div>

      {verificationResult !== null && (
        <div className={`p-4 rounded-lg ${
          verificationResult.meetsThreshold ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50'
        } border`}>
          <p className={`text-sm ${
            verificationResult.meetsThreshold ? 'text-green-400' : 'text-red-400'
          }`}>
            {verificationResult.meetsThreshold 
              ? `Age verification successful! The person meets the ${selectedAgeThreshold}+ age requirement.` 
              : `Age verification failed! The person does not meet the ${selectedAgeThreshold}+ age requirement.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default ZeroKnowledgeProof; 