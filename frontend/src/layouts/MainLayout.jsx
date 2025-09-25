// src/layouts/MainLayout.jsx
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './MainLayout.css';
import logo from '../assets/Shukatsu_logo.png'; 

function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Idéalement, on appelle aussi la route de déconnexion de l'API
    // pour invalider le token côté serveur.
    // C'est une sécurité supplémentaire.
    logout();
    navigate('/login');
  };

  if (!user) {
    // Si pour une raison quelconque l'utilisateur n'est pas chargé, on affiche un chargement
    return <div>Chargement...</div>;
  }

  return (
    <div className="layout-container">
      <header className="main-header">
        <div className="logo">
          <Link to="/"><img src={logo} alt="Shukatsu Logo" /></Link>
        </div>
        <nav className="main-nav">
          <span className="welcome-message">Bonjour, {user.first_name} !</span>
          <button onClick={handleLogout} className="logout-button">Déconnexion</button>
        </nav>
      </header>

      <main className="main-content-area">
        <Outlet /> {/* Le contenu de la page enfant (Dashboard, Offers) s'affichera ici */}
      </main>
    </div>
  );
}

export default MainLayout;