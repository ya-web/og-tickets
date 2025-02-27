// frontend/src/pages/Home.js
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import OlympicEvent from '../components/OlympicEvent';
import { getOlympicEvents } from '../services/olympicEventsService';

const Home = () => {
  const [olympicEvents, setOlympicEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOlympicEvents()
      .then(data => {
        setOlympicEvents(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Header />
      <h1>Bienvenue aux Jeux Olympiques 2024</h1>
      <p className="home-desc">
        Les Jeux Olympiques de 2024 se dérouleront à Paris.<br />
        Venez vivre des moments historiques en assistant aux plus grandes compétitions sportives mondiales.
      </p>

      <div className="olympic-events">
        <h2>Les Épreuves</h2>

        {loading && <p>Loading events...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && olympicEvents.length === 0 && <p>No events available.</p>}
        {olympicEvents.map((olympicEvent) => (
          <OlympicEvent key={olympicEvent.pk} olympicEvent={olympicEvent} />
        ))}

        <div className="view-all">
          <Link to="/olympicEvents">
            <button>Voir toutes les épreuves</button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
