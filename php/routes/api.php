<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\JobOfferController;
use App\Http\Controllers\Api\TestSessionController;


// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Route pour voir toutes les offres d'emploi
Route::get('/job-offers', [JobOfferController::class, 'index']);

// Route pour voir une seule offre d'emploi en détail (avec son QCM)
Route::get('/job-offers/{jobOffer}', [JobOfferController::class, 'show']);

// --- Routes Protégées ---
Route::middleware('auth:sanctum')->group(function () {
Route::post('/job-offers', [JobOfferController::class, 'store']);
Route::post('/logout', [AuthController::class, 'logout']);

// Route pour un candidat qui "postule" (crée une session de test)
Route::post('/job-offers/{jobOffer}/apply', [TestSessionController::class, 'create']);

// Route pour DÉMARRER un test (change le statut, récupère les questions)
Route::post('/test-sessions/{testSession}/start', [TestSessionController::class, 'start']);

// Route pour SOUMETTRE les réponses d'un test
Route::post('/test-sessions/{testSession}/submit', [TestSessionController::class, 'submit']);

// Route pour VOIR les résultats d'un test terminé
Route::get('/test-sessions/{testSession}/results', [TestSessionController::class, 'results']);

// --- Routes Recruteur ---
Route::post('/job-offers', [JobOfferController::class, 'store']);

// NOUVELLES ROUTES POUR LE TABLEAU DE BORD
// Récupérer la liste des offres créées par le recruteur connecté
Route::get('/recruiter/dashboard', [JobOfferController::class, 'recruiterDashboard']);

// Récupérer les détails d'une offre et les résultats des candidats
Route::get('/recruiter/job-offers/{jobOffer}/results', [JobOfferController::class, 'recruiterOfferResults']);

// Route pour enregistrer un événement de proctoring
Route::post('/test-sessions/{testSession}/proctoring-event', [TestSessionController::class, 'recordProctoringEvent']);

// Route pour supprimer une offre d'emploi
Route::delete('/job-offers/{jobOffer}', [JobOfferController::class, 'destroy']);

});