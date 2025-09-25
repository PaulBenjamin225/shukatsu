<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobOffer;
use App\Models\TestSession;
use App\Models\QcmAnswer;
use App\Models\TestResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TestSessionController extends Controller
{
    public function create(Request $request, JobOffer $jobOffer)
    {
        $user = $request->user();

        if ($user->role !== 'candidate') {
            return response()->json(['message' => 'Seuls les candidats peuvent postuler.'], 403);
        }

        $qcm = $jobOffer->qcm;
        if (!$qcm) {
            return response()->json(['message' => 'Cette offre n\'a pas de QCM associé.'], 404);
        }

        $existingSession = TestSession::where('candidate_id', $user->id)
                                      ->where('qcm_id', $qcm->id)
                                      ->first();

        if ($existingSession) {
            return response()->json(['message' => 'Vous avez déjà postulé à cette offre.'], 409);
        }
        
        $request->validate(['consent' => 'required|accepted']);

        $testSession = TestSession::create([
            'candidate_id' => $user->id,
            'qcm_id' => $qcm->id,
            'status' => 'not_started',
            'consent_given' => true,
        ]);

        return response()->json([
            'message' => 'Session de test créée avec succès. Vous pouvez commencer le QCM.',
            'session' => $testSession
        ], 201);
    }

    public function start(Request $request, TestSession $testSession)
    {
        if ($request->user()->id !== $testSession->candidate_id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        if ($testSession->status !== 'not_started') {
            return response()->json(['message' => 'Ce test a déjà été démarré ou est terminé.'], 409);
        }

        try {
            DB::beginTransaction();

            $testSession->status = 'in_progress';
            $testSession->start_time = now();
            $testSession->save();

            $qcm = $testSession->load(['qcm.questions.answers' => function ($query) {
                $query->select('id', 'question_id', 'answer_text');
            }])->qcm;

            DB::commit();

            return response()->json([
                'message' => 'Test démarré. Bonne chance !',
                'session_id' => $testSession->id,
                'start_time' => $testSession->start_time,
                'duration_minutes' => $qcm->duration_minutes,
                'qcm' => $qcm
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Une erreur interne est survenue lors du démarrage du test.'], 500);
        }
    }

    public function submit(Request $request, TestSession $testSession)
    {
        if ($request->user()->id !== $testSession->candidate_id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        
        // On pourrait ajouter une vérification pour s'assurer qu'on ne soumet qu'un test "in_progress"
        if ($testSession->status !== 'in_progress') {
            return response()->json(['message' => 'Ce test ne peut pas être soumis.'], 409);
        }
        
        $request->validate([
            'responses' => 'present|array', // 'present' autorise un tableau vide
            'responses.*.question_id' => 'required|integer|exists:qcm_questions,id',
            'responses.*.answer_id' => 'required|integer|exists:qcm_answers,id',
        ]);

        $testSession->status = 'completed';
        $testSession->end_time = now();

        $totalQuestions = $testSession->qcm->questions()->count();
        if ($totalQuestions == 0) { // Eviter la division par zéro
             $testSession->final_score = 0;
        } else {
            $correctAnswers = 0;
            foreach ($request->responses as $response) {
                TestResponse::create([
                    'test_session_id' => $testSession->id,
                    'question_id' => $response['question_id'],
                    'answer_id' => $response['answer_id'],
                ]);
                
                $answer = QcmAnswer::find($response['answer_id']);
                if ($answer && $answer->is_correct) {
                    $correctAnswers++;
                }
            }
            $testSession->final_score = ($correctAnswers / $totalQuestions) * 100;
        }

        // Si le score n'a pas été initialisé, on le met à 100
        if(is_null($testSession->credibility_score)) {
            $testSession->credibility_score = 100;
        }

        $testSession->save();

        return response()->json([
            'message' => 'Test terminé et soumis avec succès.',
            'final_score' => $testSession->final_score
        ]);
    }

    public function results(Request $request, TestSession $testSession)
    {
        $user = $request->user();
        // Le candidat ou le recruteur de l'offre peuvent voir les résultats
        if ($user->id !== $testSession->candidate_id && $user->id !== $testSession->qcm->jobOffer->recruiter_id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        if ($testSession->status !== 'completed') {
            return response()->json(['message' => 'Les résultats ne sont pas encore disponibles.'], 403);
        }

        return response()->json([
            'session' => $testSession->load(['qcm', 'candidate', 'responses'])
        ]);
    }

    public function recordProctoringEvent(Request $request, TestSession $testSession)
    {
        if ($request->user()->id !== $testSession->candidate_id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        
        // On ne peut enregistrer des événements que sur un test en cours
        if ($testSession->status !== 'in_progress') {
            return response()->json(['message' => 'Le test n\'est pas en cours.'], 409);
        }
        
        $request->validate([
            'event_type' => 'required|string',
            'details' => 'nullable|string',
        ]);

        $testSession->proctoringEvents()->create([
            'event_type' => $request->event_type,
            'details' => $request->details,
        ]);
        
        // Initialiser le score s'il est null
        if(is_null($testSession->credibility_score)) {
            $testSession->credibility_score = 100;
        }

        $testSession->credibility_score = max(0, $testSession->credibility_score - 10);
        $testSession->save();

        return response()->json(['message' => 'Événement enregistré.']);
    }
}