import React, { useState } from 'react';

export default function Hero() {
  const [ticketAlert, setTicketAlert] = useState(false);

  return (
    <section id="hero" className="hero-banner">
      <div className="hero-content">
        <span className="hero-badge">⚡ Official IPL 2026 Ticketing Partner</span>
        <h2 className="hero-title">Experience The Stadium Energy Live!</h2>
        <p className="hero-subtitle">
          Feel every cheer, roar, and boundary from the best seats in the stadium. Book verified tickets instantly across all premier venues.
        </p>

        <div className="hero-actions">
          <a href="#matches" className="btn-primary">
            Browse Matches
          </a>
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => setTicketAlert(!ticketAlert)}
          >
            {ticketAlert ? '🔔 Notification Active' : 'Get Match Alerts'}
          </button>
        </div>

        {ticketAlert && (
          <div className="hero-alert">
            ✓ Match alert subscribed! We will notify you when new stands open.
          </div>
        )}
      </div>
    </section>
  );
}
