// src/pages/OfferResultsPage/OfferResultsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './OfferResultsPage.css';

function OfferResultsPage() {
  const { offerId } = useParams();
  const { token } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    const fetchResults = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/recruiter/job-offers/${offerId}/results`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error('Erreur lors du chargement des résultats.');
        const data = await response.json();
        setResults(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [token, offerId]);

  if (loading) return <div>Chargement des résultats...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="results-container">
      <div className="results-header">
        <h1>Résultats des Candidatures</h1>
        <Link to="/recruiter/dashboard" className="back-link">&larr; Retour au tableau de bord</Link>
      </div>
      
      {results.length === 0 ? (
        <p className="no-results-info">Aucun candidat n'a encore terminé le test pour cette offre.</p>
      ) : (
        <div className="table-wrapper">
          <table className="results-table">
            <thead>
              <tr>
                <th>Candidat</th>
                <th>Email</th>
                <th>Score Final</th>
                <th>Score de Crédibilité</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map(result => (
                <tr key={result.id}>
                  <td>{result.candidate.first_name} {result.candidate.last_name}</td>
                  <td>{result.candidate.email}</td>
                  <td className="score-cell">
                    {result.final_score !== null ? parseFloat(result.final_score).toFixed(2) : 'N/A'} %
                  </td>
                  <td className="score-cell">
                    {result.credibility_score !== null ? parseFloat(result.credibility_score).toFixed(2) : 'N/A'} %
                  </td>


                  <td>
                    <a href={`mailto:${result.candidate.email}?subject=Suite à votre candidature`} className="btn-contact">
                      Contacter
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OfferResultsPage;