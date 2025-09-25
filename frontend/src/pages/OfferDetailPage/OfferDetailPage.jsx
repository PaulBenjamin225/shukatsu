import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './OfferDetailPage.css';

function OfferDetailPage() {
  
  const { offerId } = useParams();
  const { token, user } = useAuth(); // On récupère l'utilisateur pour vérifier son rôle
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- BLOC AJOUTÉ ---
  // Ce code s'exécute une seule fois au chargement de la page pour récupérer les détails de l'offre.
  useEffect(() => {
    const fetchOfferDetails = async () => {
      // On s'assure que loading est bien à true au début
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8000/api/job-offers/${offerId}`);
        if (!response.ok) {
          throw new Error('Offre introuvable ou erreur de chargement.');
        }
        const data = await response.json();
        setOffer(data); // On stocke les données de l'offre
      } catch (err) {
        setError(err.message); // On stocke le message d'erreur
      } finally {
        setLoading(false); // On a fini de charger, que ce soit un succès ou une erreur
      }
    };

    // On lance la fonction de récupération
    fetchOfferDetails();

  }, [offerId]); // Le tableau de dépendances indique à React de relancer ce code si l'ID de l'offre change
  // --- FIN DU BLOC AJOUTÉ ---


  // Votre fonction pour postuler. Elle est correcte et ne change pas.
  const handleApply = async () => {
    if (!window.confirm("Vous allez commencer le test. Assurez-vous d'être dans un environnement calme. Vous acceptez que votre webcam soit utilisée pour la surveillance. Continuer ?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/job-offers/${offerId}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ consent: true }) // On envoie le consentement
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Impossible de démarrer le test.');

      // Redirection vers la page de test avec l'ID de la session
      navigate(`/candidate/test-session/${data.session.id}`);

    } catch (err) {
      // Ici on stocke l'erreur dans le state au lieu de juste faire une alerte
      setError(err.message); 
    }
  };

  // Logique d'affichage
  if (loading) {
    return <div>Chargement de l'offre...</div>;
  }
  
  if (error) {
    return <div>Erreur: {error}</div>;
  }

  // Sécurité : si le chargement est fini mais que 'offer' est toujours null
  if (!offer) {
    return <div>Aucune offre trouvée.</div>;
  }

  // Le JSX à afficher une fois que tout est chargé
  return (
    <div className="offer-detail-container">
      <div className="offer-detail-header">
        <h1>{offer.title}</h1>
        {/* On ajoute une vérification pour éviter une erreur si recruiter est null */}
        <p>Publié par {offer.recruiter?.first_name} {offer.recruiter?.last_name}</p>
      </div>

      <div className="offer-detail-content">
        <div className="offer-main-content">
          <h2>Description du poste</h2>
          {/* whiteSpace: 'pre-wrap' respecte les sauts de ligne de la description */}
          <p style={{ whiteSpace: 'pre-wrap' }}>{offer.description}</p>
        </div>

        <div className="offer-sidebar">
          <h3>Prêt à tester vos compétences ?</h3>
          {/* On ajoute une vérification pour éviter une erreur si qcm est null */}
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