import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import contractABI from "./DIDRegistry.json"; // Import compiled ABI

const contractAddress = "0xYourContractAddress"; // Replace with deployed contract

function App() {
    const [account, setAccount] = useState(null);
    const [did, setDid] = useState("");
    const [publicKey, setPublicKey] = useState("");
    const [isRegistered, setIsRegistered] = useState(false);
    const [error, setError] = useState("");

    const checkDID = useCallback(async () => {
        if (!account) return;
        
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(contractAddress, contractABI, provider);

            const identity = await contract.identities(account);
            if (identity.did) {
                setDid(identity.did);
                setPublicKey(identity.publicKey);
                setIsRegistered(true);
            }
        } catch (error) {
            console.error("Error fetching DID:", error);
            setError("Failed to fetch DID information");
        }
    }, [account]);

    useEffect(() => {
        checkDID();
    }, [checkDID]);

    async function connectWallet() {
        if (window.ethereum) {
            try {
                setError("");
                const provider = new ethers.BrowserProvider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = await provider.getSigner();
                const userAddress = await signer.getAddress();
                setAccount(userAddress);
            } catch (error) {
                console.error("Error connecting wallet:", error);
                setError("Failed to connect wallet. Please try again.");
            }
        } else {
            setError("Please install MetaMask!");
        }
    }

    async function registerDID() {
        if (!account) {
            setError("Connect your wallet first!");
            return;
        }

        if (!did || !publicKey) {
            setError("Please enter both DID and Public Key");
            return;
        }

        try {
            setError("");
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);

            const tx = await contract.registerDID(did, publicKey);
            await tx.wait();
            setIsRegistered(true);
            setError("");
        } catch (error) {
            console.error("Registration failed:", error);
            setError("Failed to register DID. Please try again.");
        }
    }

    async function loginWithDID() {
        if (!isRegistered) {
            setError("Register DID first!");
            return;
        }
        
        try {
            setError("");
            const response = await fetch("http://localhost:3001/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user: account, service: "Social Media" }),
            });
            const data = await response.json();
            if (data.success) {
                setError("");
            } else {
                setError("Login Failed!");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("Failed to login. Please try again.");
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Decentralized Identity (DID)</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <button 
                    onClick={connectWallet} 
                    className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                    {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
                </button>

                {account && !isRegistered && (
                    <div className="mt-4">
                        <input 
                            type="text" 
                            placeholder="Enter DID" 
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 my-2"
                            value={did}
                            onChange={(e) => setDid(e.target.value)} 
                        />
                        <input 
                            type="text" 
                            placeholder="Enter Public Key" 
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 my-2"
                            value={publicKey}
                            onChange={(e) => setPublicKey(e.target.value)} 
                        />
                        <button 
                            onClick={registerDID} 
                            className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                        >
                            Register DID
                        </button>
                    </div>
                )}

                {isRegistered && (
                    <div className="mt-4">
                        <p className="text-sm text-gray-600"><strong>Your DID:</strong> {did}</p>
                        <p className="text-sm text-gray-600"><strong>Public Key:</strong> {publicKey}</p>
                        <button 
                            onClick={loginWithDID} 
                            className="w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition mt-2"
                        >
                            Login with DID
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
