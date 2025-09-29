<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\JobOfferController;
use App\Http\Controllers\Api\TestSessionController;

// --- ROUTES PUBLIQUES ---
// Ces routes seront exclues de la protection par défaut
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/job-offers', [JobOfferController::class, 'index']);
Route::get('/job-offers/{jobOffer}', [JobOfferController::class, 'show']);

// --- ROUTES PROTÉGÉES ---
// Celles-ci nécessiteront un token
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Routes Recruteur
    Route::post('/job-offers', [JobOfferController::class, 'store']);
    Route::delete('/job-offers/{jobOffer}', [JobOfferController::class, 'destroy']);
    Route::get('/recruiter/dashboard', [JobOfferController::class, 'recruiterDashboard']);
    Route::get('/recruiter/job-offers/{jobOffer}/results', [JobOfferController::class, 'recruiterOfferResults']);

    // Routes Candidat
    Route::post('/job-offers/{jobOffer}/apply', [TestSessionController::class, 'create']);
    Route::post('/test-sessions/{testSession}/start', [TestSessionController::class, 'start']);
    Route::post('/test-sessions/{testSession}/submit', [TestSessionController::class, 'submit']);
    Route::get('/test-sessions/{testSession}/results', [TestSessionController::class, 'results']);
    Route::post('/test-sessions/{testSession}/proctoring-event', [TestSessionController::class, 'recordProctoringEvent']);
});