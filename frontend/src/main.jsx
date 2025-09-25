// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx'; 

// Importer TOUTES les pages et le Layout principal
import HomePage from './pages/HomePage/HomePage.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage/RegisterPage.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import RecruiterDashboard from './pages/RecruiterDashboard/RecruiterDashboard.jsx';
import CandidateOffers from './pages/CandidateOffers/CandidateOffers.jsx';
import CreateOfferPage from './pages/CreateOfferPage/CreateOfferPage.jsx';
import OfferDetailPage from './pages/OfferDetailPage/OfferDetailPage.jsx';
import TestPage from './pages/TestPage/TestPage.jsx'; 
import OfferResultsPage from './pages/OfferResultsPage/OfferResultsPage.jsx';
import ResultsPage from './pages/ResultsPage/ResultsPage.jsx';

// Définir la structure complète des routes
const router = createBrowserRouter([
  // --- Routes Publiques ---
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },

  // --- Routes Protégées (utilisant le MainLayout) ---
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // Routes Recruteur
      {
        path: "recruiter/dashboard",
        element: <RecruiterDashboard />,
      },
      {
        path: "recruiter/offers/create",
        element: <CreateOfferPage />,
      },
      { path: "recruiter/job-offers/:offerId/results", 
        element: <OfferResultsPage /> 
      },
      
      // Routes Candidat
      {
        path: "candidate/offers",
        element: <CandidateOffers />,
      },
      {
        path: "candidate/offer/:offerId",
        element: <OfferDetailPage />,
      },
      {
        path: "candidate/test-session/:sessionId", 
        element: <TestPage />,
      },
      { 
        path: "candidate/results/:sessionId", 
        element: <ResultsPage /> 
      },
     
    ]
  }
]);

// Rendre l'application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);