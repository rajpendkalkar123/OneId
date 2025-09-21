import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DIDRegistration from './components/DIDRegistration';
import Dashboard from './components/Dashboard';
import FeaturePage from './components/FeaturePage';
import SupportPage from './components/SupportPage';
import DocumentScanner from './components/DocumentScanner';
import ScanResultPage from './components/ScanResultPage';
import './App.css';

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
          <Navbar />
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register" element={<DIDRegistration />} />
            <Route path="/features" element={<FeaturePage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/scan" element={<DocumentScanner />} />
            <Route path="/scan-result/:data" element={<ScanResultPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;
