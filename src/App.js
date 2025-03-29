import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DIDRegistration from './components/DIDRegistration';
import DocumentScanner from './components/DocumentScanner';
import Dashboard from './components/Dashboard';
import QRScanner from './components/QRScanner';
import './App.css';

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register" element={<DIDRegistration />} />
            <Route path="/scan" element={<DocumentScanner />} />
          </Routes>
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;
