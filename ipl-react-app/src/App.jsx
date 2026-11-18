import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MatchCard from './components/MatchCard';
import './App.css';

const MATCHES_DATA = [
  {
    id: 1,
    teams: 'RCB vs CSK',
    date: '10 April 2026, 7:30 PM',
    venue: 'Chinnaswamy Stadium, Bengaluru',
    generalPrice: 1000,
    premiumPrice: 2500,
    vipPrice: 5000,
  },
  {
    id: 2,
    teams: 'MI vs KKR',
    date: '11 April 2026, 7:30 PM',
    venue: 'Wankhede Stadium, Mumbai',
    generalPrice: 1200,
    premiumPrice: 2800,
    vipPrice: 5500,
  },
  {
    id: 3,
    teams: 'SRH vs RR',
    date: '12 April 2026, 3:30 PM',
    venue: 'Rajiv Gandhi Stadium, Hyderabad',
    generalPrice: 900,
    premiumPrice: 2200,
    vipPrice: 4500,
  },
  {
    id: 4,
    teams: 'CSK vs MI',
    date: '13 April 2026, 7:30 PM',
    venue: 'Chepauk Stadium, Chennai',
    generalPrice: 1200,
    premiumPrice: 3000,
    vipPrice: 6000,
  },
  {
    id: 5,
    teams: 'DC vs PBKS',
    date: '14 April 2026, 7:30 PM',
    venue: 'Arun Jaitley Stadium, Delhi',
    generalPrice: 950,
    premiumPrice: 2300,
    vipPrice: 4800,
  },
  {
    id: 6,
    teams: 'GT vs LSG',
    date: '15 April 2026, 7:30 PM',
    venue: 'Narendra Modi Stadium, Ahmedabad',
    generalPrice: 1100,
    premiumPrice: 2600,
    vipPrice: 5200,
  },
];

export default function App() {
  const [selectedTeam, setSelectedTeam] = useState('All');

  const filteredMatches = selectedTeam === 'All'
    ? MATCHES_DATA
    : MATCHES_DATA.filter((match) => match.teams.includes(selectedTeam));

  return (
    <div className="app-wrapper">
      <Navbar />
      <Hero />

      <main className="main-section" id="matches">
        <section className="matches-container">
          <div className="section-title-wrap">
            <h2 className="section-title">IPL 2026 Match Schedule & Tickets</h2>
            <p className="section-subtext">
              Browse matches rendered dynamically through React components, props, and live state.
            </p>

            <div className="filter-controls">
              <label htmlFor="team-select" className="filter-label">Filter by Team:</label>
              <select
                id="team-select"
                className="team-select"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
              >
                <option value="All">All Teams ({MATCHES_DATA.length} matches)</option>
                <option value="RCB">RCB</option>
                <option value="CSK">CSK</option>
                <option value="MI">MI</option>
                <option value="KKR">KKR</option>
                <option value="SRH">SRH</option>
                <option value="RR">RR</option>
                <option value="DC">DC</option>
                <option value="PBKS">PBKS</option>
                <option value="GT">GT</option>
                <option value="LSG">LSG</option>
              </select>
            </div>
          </div>

          <div className="matches-grid">
            {filteredMatches.map((match) => (
              <MatchCard
                key={match.id}
                id={match.id}
                teams={match.teams}
                date={match.date}
                venue={match.venue}
                generalPrice={match.generalPrice}
                premiumPrice={match.premiumPrice}
                vipPrice={match.vipPrice}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p className="footer-title">IPL 2026 Ticket Booking &mdash; React Application</p>
        <p className="footer-sub">Activity 10: Introduction to React JS &bull; Reva University - CSE</p>
      </footer>
    </div>
  );
}
