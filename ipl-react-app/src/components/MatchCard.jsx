import React, { useState } from 'react';

export default function MatchCard({ 
  id, 
  teams, 
  date, 
  venue, 
  generalPrice, 
  premiumPrice, 
  vipPrice 
}) {
  const [stand, setStand] = useState('General');
  const [isBooked, setIsBooked] = useState(false);

  const getPrice = () => {
    switch (stand) {
      case 'VIP':
        return vipPrice;
      case 'Premium':
        return premiumPrice;
      case 'General':
      default:
        return generalPrice;
    }
  };

  const handleBooking = () => {
    setIsBooked(prev => !prev);
  };

  return (
    <article className="match-card">
      <div className="card-top">
        <span className="match-num-tag">Match #{id}</span>
        <span className="match-venue-tag">📍 {venue}</span>
      </div>

      <h3 className="card-teams">{teams}</h3>
      <p className="card-date">🗓️ {date}</p>

      <div className="stand-selection">
        <label htmlFor={`stand-select-${id}`}>Stand Category:</label>
        <select 
          id={`stand-select-${id}`}
          value={stand}
          onChange={(e) => setStand(e.target.value)}
          className="stand-dropdown"
        >
          <option value="General">General (₹{generalPrice})</option>
          <option value="Premium">Premium (₹{premiumPrice})</option>
          <option value="VIP">VIP (₹{vipPrice})</option>
        </select>
      </div>

      <div className="card-bottom">
        <div className="price-display">
          <span className="price-label">Price per ticket:</span>
          <span className="price-val">₹{getPrice()}</span>
        </div>

        <button 
          type="button"
          className={`book-button ${isBooked ? 'booked' : ''}`}
          onClick={handleBooking}
        >
          {isBooked ? '✓ Reserved' : 'Book Ticket'}
        </button>
      </div>
    </article>
  );
}
