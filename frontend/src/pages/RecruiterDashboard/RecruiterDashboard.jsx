import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './RecruiterDashboard.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

function RecruiterDashboard() {
  const { token } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/recruiter/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        });
        if (!response.ok) {
          throw new Error('Une erreur est survenue lors de la récupération de vos offres.');
        }
        const data = await response.json();
        setOffers(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOffers();
    }
  }, [token]);
  
  const handleDelete = async (offerId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette offre ? Toutes les données associées (QCM, candidatures) seront perdues.")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/job-offers/${offerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'La suppression a échoué.');
      }

      setOffers(currentOffers => currentOffers.filter(offer => offer.id !== offerId));
      
    } catch (err) {
      setError(err.message);
      alert(`Erreur: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Tableau de Bord Recruteur</h1>
        </div>
        <p>Chargement de vos offres...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Tableau de Bord Recruteur</h1>
        </div>
        <p className="error-message">Erreur: {error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Tableau de Bord Recruteur</h1>
        <Link to="/recruiter/offers/create" className="btn-create-offer">
          + Créer une nouvelle offre
        </Link>
      </div>
      
      <div className="offers-list">
        {offers.length === 0 ? (
          <div className="no-offers-message">
            <h3>Bienvenue !</h3>
            <p>Vous n'avez pas encore créé d'offre. Commencez dès maintenant en cliquant sur le bouton ci-dessus.</p>
          </div>
        ) : (
          offers.map(offer => (
            <div key={offer.id} className="offer-card">
              <div className="offer-card-header">
                <h3>{offer.title}</h3>
                <span className="offer-status">Publiée</span>
              </div>
              <div className="offer-card-body">
                <p>{offer.description.substring(0, 150)}...</p>
              </div>
              <div className="offer-card-footer">
                <div className="applications-count">
                  <strong>{offer.applications_count}</strong> 
                  <span>Candidature(s)</span>
                </div>
                <div className="offer-actions">
                  <Link to={`/recruiter/job-offers/${offer.id}/results`} className="btn-view-results">
                    Résultats
                  </Link>
                  <button onClick={() => handleDelete(offer.id)} className="btn-delete">
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RecruiterDashboard;