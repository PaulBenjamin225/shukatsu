import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CandidateOffers.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

function CandidateOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/job-offers`);
        if (!response.ok) throw new Error('Erreur de chargement des offres.');
        const data = await response.json();
        setOffers(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  if (loading) return <div>Chargement des offres disponibles...</div>;
  if (error) return <div className="error-message">Erreur: {error}</div>;

  return (
    <div className="offers-page-container">
      <h1>Offres d'Emploi Disponibles</h1>
      <p>Trouvez votre prochaine opportunité et testez vos compétences.</p>
      
      <div className="offers-grid">
        {offers.length === 0 ? (
          <p>Il n'y a aucune offre disponible pour le moment.</p>
        ) : (
          offers.map(offer => (
            <Link to={`/candidate/offer/${offer.id}`} key={offer.id} className="offer-card-link">
              <div className="offer-card">
                <div className="offer-card-company">
                  Publié par {offer.recruiter.first_name} {offer.recruiter.last_name}
                </div>
                <h3 className="offer-card-title">{offer.title}</h3>
                <p className="offer-card-description">{offer.description.substring(0, 120)}...</p>
                <div className="offer-card-footer">
                  <span>Voir les détails et postuler</span>
                  <span className="arrow">→</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default CandidateOffers;