import React, { useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="logo-icon">🏏</span>
          <h1 className="logo-title">IPL 2026 Tickets</h1>
        </div>

        <button 
          className="hamburger" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>

        <nav className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <a href="#hero">Home</a>
          <a href="#matches">Matches</a>
          <a href="#guidelines">Guidelines</a>
          <a href="#contact">Support</a>
        </nav>
      </div>
    </header>
  );
}
