import React, { useCallback, useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MatchCard from './components/MatchCard';
import { supabase } from './supabase';
import './App.css';

function formatMatchDate(matchDate) {
  return new Date(matchDate)
    .toLocaleString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    })
    .replace(' at ', ', ')
    .replace(/\b(am|pm)\b/i, (period) => period.toUpperCase());
}

export default function App() {
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [error, setError] = useState(
    supabase ? '' : 'Add your Supabase URL and publishable key to ipl-react-app/.env, then restart the app.',
  );
  const [realtimeError, setRealtimeError] = useState('');

  const loadMatches = useCallback(async () => {
    if (!supabase) {
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('matches')
        .select('*');

      if (fetchError) {
        throw fetchError;
      }

      setMatches(data.map((match) => ({
        ...match,
        date: formatMatchDate(match.match_date),
        generalPrice: match.general_price,
        premiumPrice: match.premium_price,
        vipPrice: match.vip_price,
        availableSeats: match.available_seats,
      })));
      setError('');
    } catch (fetchError) {
      setError(`Could not load matches: ${fetchError.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      return undefined;
    }

    Promise.resolve().then(loadMatches);

    const channel = supabase
      .channel('matches-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'matches' },
        () => loadMatches(),
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setRealtimeError('Live seat updates are unavailable. Check that Realtime is enabled for the matches table.');
        } else if (status === 'SUBSCRIBED') {
          setRealtimeError('');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadMatches]);

  const filteredMatches = selectedTeam === 'All'
    ? matches
    : matches.filter((match) => match.teams.includes(selectedTeam));

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
                <option value="All">All Teams ({matches.length} matches)</option>
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

          {loading && <p role="status">Loading matches...</p>}
          {error && <p role="alert">{error}</p>}
          {realtimeError && <p role="status">{realtimeError}</p>}

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
                availableSeats={match.availableSeats}
                onBookingSuccess={loadMatches}
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
