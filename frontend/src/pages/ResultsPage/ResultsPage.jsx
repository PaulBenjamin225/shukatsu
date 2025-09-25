// src/pages/ResultsPage/ResultsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './ResultsPage.css';

// --- MODIFICATION 1 : Définir l'URL de l'API de manière dynamique ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

function ResultsPage() {
  const { sessionId } = useParams();
  const { token } = useAuth();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Ajout d'un état pour les erreurs

  useEffect(() => {
    if (!token) return;
    const fetchResult = async () => {
      try {
        // --- MODIFICATION 2 : Utiliser la variable d'environnement ---
        const response = await fetch(`${API_BASE_URL}/test-sessions/${sessionId}/results`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        // --- MODIFICATION 3 : Meilleure gestion des erreurs ---
        if (!response.ok) {
          throw new Error("Impossible de charger les résultats.");
        }

        const data = await response.json();
        setResult(data.session);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [sessionId, token]);

  if (loading) return <div>Chargement de vos résultats...</div>;
  if (error) return <div>Erreur: {error}</div>; // Afficher le message d'erreur
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