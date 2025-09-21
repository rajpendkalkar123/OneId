import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import ReactMarkdown from 'react-markdown';

const SupportPage = () => {
  // const { account } = useWallet();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your OneID support assistant. I can help you with questions about wallet connections, document scanning, identity verification, and more. How can I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);
    setError('');

    try {
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a helpful assistant for OneID, a decentralized identity platform. 
              Please help the user with their question about OneID, wallet connections, QR code scanning, or identity verification.
              User's question: ${userMessage}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      const botResponse = data.candidates[0].content.parts[0].text;

      setMessages(prev => [...prev, { role: 'assistant', content: botResponse }]);
    } catch (err) {
      console.error('Chat error:', err);
      setError('Sorry, I encountered an error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
            >
              <h2 className="text-2xl font-bold mb-6 gradient-text">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">What is OneID?</h3>
                  <p className="text-gray-400">OneID is a decentralized identity platform that allows you to create and manage your digital identity on the blockchain.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">How do I connect my wallet?</h3>
                  <p className="text-gray-400">Click the "Connect Wallet" button in the navigation bar and follow the prompts from your wallet provider.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">How do I scan documents?</h3>
                  <p className="text-gray-400">Navigate to the Scan Document page, upload your document, and follow the on-screen instructions.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Is my data secure?</h3>
                  <p className="text-gray-400">Yes, all your data is encrypted and stored securely on the blockchain. Only you have access to your private information.</p>
                </div>
              </div>
            </motion.div>

            {/* Troubleshooting Guide */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
            >
              <h2 className="text-2xl font-bold mb-6 gradient-text">Troubleshooting Guide</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Wallet Connection Issues</h3>
                  <p className="text-gray-400">Make sure your wallet is properly installed and you're on a supported network.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Document Scanning Problems</h3>
                  <p className="text-gray-400">Ensure your document is clear and well-lit. Try adjusting your camera settings if needed.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Transaction Failures</h3>
                  <p className="text-gray-400">Check your network connection and ensure you have enough gas for the transaction.</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 h-[600px] flex flex-col"
            >
              <h2 className="text-2xl font-bold mb-6 gradient-text">Chat Support</h2>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-700 text-gray-200'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <div className="prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                              ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                              li: ({ children }) => <li className="text-gray-200">{children}</li>,
                              strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                              em: ({ children }) => <em className="italic text-gray-300">{children}</em>,
                              code: ({ children }) => <code className="bg-gray-600 px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
                              h1: ({ children }) => <h1 className="text-lg font-bold text-white mb-2">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-base font-bold text-white mb-2">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-sm font-bold text-white mb-1">{children}</h3>,
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        message.content
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-700 rounded-lg p-3 text-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              </form>

              {error && (
                <div className="mt-4 text-red-400 text-sm text-center">{error}</div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage; 