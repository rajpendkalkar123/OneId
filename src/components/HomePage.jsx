          {/* How It Works Section */}
          <div className="py-16">
            <h2 className="text-3xl font-bold text-center mb-12 gradient-text">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
              >
                <div className="text-4xl mb-4">🔐</div>
                <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                <p className="text-gray-300">
                  Securely connect your MetaMask wallet to access the OneID platform.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
              >
                <div className="text-4xl mb-4">📄</div>
                <h3 className="text-xl font-semibold mb-2">Upload Documents</h3>
                <p className="text-gray-300">
                  Upload your identity documents for verification and storage.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
              >
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-semibold mb-2">Verify Identity</h3>
                <p className="text-gray-300">
                  Get your identity verified and receive your OneID credentials.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Features Section */}
          <div className="py-16">
            <h2 className="text-3xl font-bold text-center mb-12 gradient-text">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
              >
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold mb-2">Secure Storage</h3>
                <p className="text-gray-300">
                  Your documents are encrypted and stored securely on the blockchain.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
              >
                <div className="text-4xl mb-4">🌐</div>
                <h3 className="text-xl font-semibold mb-2">Decentralized Identity</h3>
                <p className="text-gray-300">
                  Take control of your digital identity with blockchain technology.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
              >
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold mb-2">Fast Verification</h3>
                <p className="text-gray-300">
                  Quick and efficient identity verification process.
                </p>
              </motion.div>
            </div>
          </div> 