// src/pages/HomePage/HomePage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; 
import logo from '../../assets/Shukatsu_logo.png';
import illustration from '../../assets/Emploi.jpeg';

function HomePage() {
  return (
    <div className="home-container">
      
      <header className="home-header">
        <div className="logo">
          <Link to="/"><img src={logo} alt="Shukatsu Logo" /></Link>
        </div>
        <nav className="home-nav">
          <Link to="/register" className="nav-link">S'inscrire</Link>
          <Link to="/login" className="nav-link nav-link-primary">Connexion</Link>
        </nav>
      </header>

      <main className="main-content">
        
        <div className="text-content">
          <h1>SHUKATSU</h1>
          
          <p>
            La plateforme de recrutement intelligente 
            qui vous aide à trouver les meilleures offres et talents.
          </p>

        </div>

        <div className="illustration-content">
          <img src={illustration} alt="Illustration de recrutement en ligne" />
        </div>

      </main>
    </div>
  );
}

export default HomePage;