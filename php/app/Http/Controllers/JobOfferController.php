<?php

namespace App\Http\Controllers;

use App\Models\JobOffer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class JobOfferController extends Controller
{
    /**
     * Store a newly created resource in storage.
     * C'est la méthode pour créer une nouvelle Offre d'Emploi et son QCM.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        // 1. Vérifier que l'utilisateur est bien un recruteur
        if ($user->role !== 'recruiter') {
            return response()->json(['message' => 'Accès non autorisé. Seuls les recruteurs peuvent poster des offres.'], 403);
        }

        // 2. Valider TOUTES les données reçues en une seule fois
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'qcm.title' => 'required|string|max:255',
            'qcm.duration_minutes' => 'required|integer|min:1',
            'qcm.questions' => 'required|array|min:1',
            'qcm.questions.*.question_text' => 'required|string',
            'qcm.questions.*.answers' => 'required|array|min:2|max:4',
            'qcm.questions.*.answers.*.answer_text' => 'required|string',
            'qcm.questions.*.answers.*.is_correct' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // 3. Utiliser une transaction de base de données pour garantir l'intégrité
        try {
            DB::beginTransaction();

            $jobOffer = JobOffer::create([
                'recruiter_id' => $user->id,
                'title' => $request->title,
                'description' => $request->description,
            ]);

            $qcmData = $request->input('qcm');
            $qcm = $jobOffer->qcm()->create([
                'title' => $qcmData['title'],
                'duration_minutes' => $qcmData['duration_minutes'],
            ]);

            foreach ($qcmData['questions'] as $questionData) {
                $question = $qcm->questions()->create([
                    'question_text' => $questionData['question_text'],
                ]);

                foreach ($questionData['answers'] as $answerData) {
                    $question->answers()->create([
                        'answer_text' => $answerData['answer_text'],
                        'is_correct' => $answerData['is_correct'],
                    ]);
                }
            }

            DB::commit();

            return response()->json($jobOffer->load('qcm.questions.answers'), 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Une erreur est survenue lors de la création de l\'offre.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display a listing of the resource.
     * C'est la méthode pour afficher TOUTES les offres.
     */
    public function index()
    {
        $jobOffers = JobOffer::with('recruiter')->latest()->paginate(10);
        return response()->json($jobOffers);
    }

    /**
     * Display the specified resource.
     * C'est la méthode pour afficher UNE SEULE offre en détail.
     */
    public function show(JobOffer $jobOffer)
    {
        $jobOffer->load('recruiter', 'qcm.questions.answers');
        return response()->json($jobOffer);
    }

    /**
     * Affiche le tableau de bord du recruteur avec ses offres.
     */
    public function recruiterDashboard(Request $request)
    {
        $recruiter = $request->user();

        if ($recruiter->role !== 'recruiter') {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $jobOffers = $recruiter->jobOffers()
                            ->withCount('applications as applications_count')
                            ->latest()
                            ->paginate(10);

        return response()->json($jobOffers);
    }

    /**
     * Affiche les résultats des candidats pour une offre spécifique du recruteur.
     */
    public function recruiterOfferResults(Request $request, JobOffer $jobOffer)
    {
        $recruiter = $request->user();

        if ($recruiter->id !== $jobOffer->recruiter_id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        
        $qcm = $jobOffer->qcm;
        if (!$qcm) {
            return response()->json(['data' => []]);
        }

        $results = $qcm->testSessions()
                    ->where('status', 'completed')
                    ->with('candidate:id,first_name,last_name,email')
                    ->orderBy('final_score', 'desc')
                    ->paginate(20);

        return response()->json($results);
    }

    /**
     * Remove the specified resource from storage.
     * C'est la méthode pour la suppression.
     */
    public function destroy(Request $request, JobOffer $jobOffer)
    {
        // Sécurité : On vérifie que la personne qui fait la demande est bien le propriétaire de l'offre.
        if ($request->user()->id !== $jobOffer->recruiter_id) {
            return response()->json(['message' => 'Action non autorisée.'], 403);
        }

        // Si la vérification passe, on supprime l'offre.
        $jobOffer->delete();

        // Grâce aux contraintes 'onDelete('cascade')' dans nos migrations,
        // la suppression de cette offre va automatiquement entraîner la suppression
        // de son QCM, de ses questions, de ses réponses, et de toutes les sessions de test associées.
        return response()->json(['message' => 'L\'offre et toutes ses données associées ont été supprimées avec succès.'], 200);
    }
}