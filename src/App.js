import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import { WalletProvider } from './context/WalletContext';
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
          </Routes>
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;
