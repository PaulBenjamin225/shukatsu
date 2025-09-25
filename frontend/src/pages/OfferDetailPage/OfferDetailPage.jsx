import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './OfferDetailPage.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

function OfferDetailPage() {
  
  const { offerId } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOfferDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/job-offers/${offerId}`);
        if (!response.ok) {
          throw new Error('Offre introuvable ou erreur de chargement.');
        }
        const data = await response.json();
        setOffer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOfferDetails();
  }, [offerId]);


  const handleApply = async () => {
    if (!window.confirm("Vous allez commencer le test. Assurez-vous d'être dans un environnement calme. Vous acceptez que votre webcam soit utilisée pour la surveillance. Continuer ?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/job-offers/${offerId}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ consent: true })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Impossible de démarrer le test.');

      navigate(`/candidate/test-session/${data.session.id}`);

    } catch (err) {
      setError(err.message); 
    }
  };

  if (loading) {
    return <div>Chargement de l'offre...</div>;
  }
  
  if (error) {
    return <div>Erreur: {error}</div>;
  }

  if (!offer) {
    return <div>Aucune offre trouvée.</div>;
  }

  return (
    <div className="offer-detail-container">
      <div className="offer-detail-header">
        <h1>{offer.title}</h1>
        <p>Publié par {offer.recruiter?.first_name} {offer.recruiter?.last_name}</p>
      </div>

      <div className="offer-detail-content">
        <div className="offer-main-content">
          <h2>Description du poste</h2>
          <p style={{ whiteSpace: 'pre-wrap' }}>{offer.description}</p>
        </div>

        <div className="offer-sidebar">
          <h3>Prêt à tester vos compétences ?</h3>
          <p>Cette candidature inclut un QCM de <strong>{offer.qcm?.duration_minutes} minutes</strong>.</p>
          
          <button onClick={handleApply} className="btn-apply" disabled={!user || user.role !== 'candidate'}>
            {user?.role === 'candidate' ? 'Commencer le Test' : 'Réservé aux candidats'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OfferDetailPage;