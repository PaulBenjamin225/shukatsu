// src/pages/RegisterPage/RegisterPage.jsx
import React, { useState } from 'react';
// On importe "useNavigate" ici
import { Link, useNavigate } from 'react-router-dom'; 
import './../Form.css';
import { useAuth } from '../../contexts/AuthContext';

function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate(); // Maintenant, cette ligne est correcte
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'candidate',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    // Ajout de la vérification des mots de passe côté client pour un meilleur feedback
    if (formData.password !== formData.password_confirmation) {
        setError("Les mots de passe ne correspondent pas.");
        setLoading(false);
        return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessages = Object.values(data).flat().join('\n');
        throw new Error(errorMessages || 'Erreur d\'inscription');
      }

      // 1. On connecte l'utilisateur
      login(data.user, data.access_token);
      
      // 2. On le redirige vers la bonne page
      if (data.user.role === 'recruiter') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/candidate/offers');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page-container">
      <form className="form-container" onSubmit={handleSubmit}>
        <h2>INSCRIPTION</h2>
        {error && <div className="form-error">{error}</div>}
        
        <div className="form-group">
          <label>Prénom</label>
          <input type="text" name="first_name" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Nom</label>
          <input type="text" name="last_name" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Mot de passe</label>
          <input type="password" name="password" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Confirmer le mot de passe</label>
          <input type="password" name="password_confirmation" onChange={handleChange} required />
        </div>

         <div className="form-group">
          <label>Je suis un :</label>
          <div className="radio-group">
            <label className="radio-label">
              <input type="radio" name="role" value="candidate" checked={formData.role === 'candidate'} onChange={handleChange} />
              Candidat
            </label>
            <label className="radio-label">
              <input type="radio" name="role" value="recruiter" checked={formData.role === 'recruiter'} onChange={handleChange} />
              Recruteur
            </label>
          </div>
        </div>

        <button type="submit" className="form-button" disabled={loading}>
          {loading ? 'Inscription en cours...' : 'S\'inscrire'}
        </button>
        <p className="form-link">
          Déjà un compte ? <Link to="/login">Connectez-vous</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;