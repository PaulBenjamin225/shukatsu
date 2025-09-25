// src/contexts/AuthContext.jsx

import React, { createContext, useState, useContext } from 'react';

// On crée le contexte. Pour l'instant, il est vide.
const AuthContext = createContext(null);

// Ça, c'est le composant "gardien" du tableau d'affichage.
// Il sera responsable de mettre à jour les informations.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Info 1: Qui est l'utilisateur ? (null = personne)
  const [token, setToken] = useState(null); // Info 2: Quel est son "laissez-passer" (token) ?

  // La fonction pour ÉCRIRE sur le tableau d'affichage quand quelqu'un se connecte
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    // On garde aussi le token dans le navigateur pour ne pas le perdre si on rafraîchit la page
    localStorage.setItem('authToken', authToken); 
  };

  // La fonction pour EFFACER le tableau d'affichage quand quelqu'un se déconnecte
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  // On met toutes les informations et les fonctions à disposition
  const value = { user, token, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Ça, c'est un raccourci pour que les composants puissent
// facilement LIRE ce qu'il y a sur le tableau d'affichage.
export function useAuth() {
  return useContext(AuthContext);
}