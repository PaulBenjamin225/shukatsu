// src/pages/ResultsPage/ResultsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './ResultsPage.css';

function ResultsPage() {
  const { sessionId } = useParams();
  const { token } = useAuth();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetchResult = async () => {
      const response = await fetch(`http://localhost:8000/api/test-sessions/${sessionId}/results`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setResult(data.session);
      setLoading(false);
    };
    fetchResult();
  }, [sessionId, token]);

  if (loading) return <div>Chargement de vos résultats...</div>;
  if (!result) return <div>Impossible de trouver les résultats.</div>;

  return (
    <div className="results-page-container">
      <div className="results-card">
        <h1>Test Terminé !</h1>
        <p>Merci d'avoir passé le test pour l'offre : <strong>{result.qcm.title}</strong></p>
        <div className="score-display">
          <p>Votre Score Final</p>
          <span>{parseFloat(result.final_score).toFixed(0)}%</span>
        </div>
        <p>Un recruteur examinera vos résultats et vous contactera si votre profil correspond.</p>
        <Link to="/candidate/offers" className="back-to-offers-btn">Retour aux offres</Link>
      </div>
    </div>
  );
}

export default ResultsPage;