import React, { useState } from 'react';
import { supabase } from '../supabase';

export default function MatchCard({ 
  id, 
  teams, 
  date, 
  venue, 
  generalPrice, 
  premiumPrice, 
  vipPrice,
  availableSeats,
  onBookingSuccess,
}) {
  const [stand, setStand] = useState('General');
  const [customerName, setCustomerName] = useState('');
  const [ticketCount, setTicketCount] = useState('1');
  const [isBooked, setIsBooked] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingError, setBookingError] = useState('');

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

  const handleBooking = async () => {
    const name = customerName.trim();
    const tickets = Number(ticketCount);

    setBookingMessage('');
    setBookingError('');

    if (!name) {
      setBookingError('Enter your name to book tickets.');
      return;
    }

    if (!Number.isInteger(tickets) || tickets < 1) {
      setBookingError('Choose a valid number of tickets.');
      return;
    }

    if (tickets > availableSeats) {
      setBookingError(`Only ${availableSeats} seats are available.`);
      return;
    }

    if (!supabase) {
      setBookingError('Supabase is not configured. Add the values in your .env file and restart the app.');
      return;
    }

    const ticketPrice = getPrice();
    const totalPrice = ticketPrice * tickets;
    setIsBooking(true);

    try {
      const { error } = await supabase.rpc('book_ticket', {
        p_match_id: id,
        p_customer_name: name,
        p_tickets: tickets,
        p_stand: stand,
      });

      if (error) {
        throw error;
      }

      setIsBooked(true);
      setBookingMessage(`Booking confirmed for ${tickets} ticket(s). Total: ₹${totalPrice}.`);
      setCustomerName('');
      await onBookingSuccess();
    } catch (error) {
      const message = error.message || 'Please try again.';
      setBookingError(
        message.toLowerCase().includes('not enough seats')
          ? 'There are not enough seats remaining. Availability has been updated.'
          : `Booking failed: ${message}`,
      );
    } finally {
      setIsBooking(false);
    }
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
        <p>Available seats: {availableSeats}</p>
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

        <label htmlFor={`customer-name-${id}`}>Customer name:</label>
        <input
          id={`customer-name-${id}`}
          className="stand-dropdown"
          type="text"
          value={customerName}
          maxLength="120"
          required
          onChange={(e) => setCustomerName(e.target.value)}
        />

        <label htmlFor={`ticket-count-${id}`}>Number of tickets:</label>
        <input
          id={`ticket-count-${id}`}
          className="stand-dropdown"
          type="number"
          min="1"
          max={availableSeats}
          value={ticketCount}
          required
          onChange={(e) => setTicketCount(e.target.value)}
        />
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
          disabled={isBooking || availableSeats < 1}
        >
          {isBooking ? 'Booking...' : isBooked ? '✓ Reserved' : 'Book Ticket'}
        </button>
      </div>
      {bookingMessage && <p role="status">{bookingMessage}</p>}
      {bookingError && <p role="alert">{bookingError}</p>}
    </article>
  );
}
