import React, { createContext, useState, useContext } from 'react';
import { ethers } from "ethers";

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const newSigner = await provider.getSigner();
        const userAddress = await newSigner.getAddress();
        setAccount(userAddress);
        setSigner(newSigner);
        return { success: true, address: userAddress };
      } catch (error) {
        console.error("Error connecting wallet:", error);
        return { success: false, error };
      }
    } else {
      alert("Please install MetaMask!");
      return { success: false, error: "MetaMask not installed" };
    }
  };

  const value = {
    account,
    signer,
    connectWallet,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}; 