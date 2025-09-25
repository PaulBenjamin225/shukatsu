<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TestSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'candidate_id',
        'qcm_id',
        'status',
        'consent_given',
        'start_time',
        'end_time',
        'final_score',
        'credibility_score',
    ];

    /**
     * Récupère le candidat associé à cette session.
     */
    public function candidate(): BelongsTo
    {
        return $this->belongsTo(User::class, 'candidate_id');
    }

    /**
     * Récupère le QCM associé à cette session.
     */
    public function qcm(): BelongsTo
    {
        return $this->belongsTo(Qcm::class);
    }

    /**
     * Récupère toutes les réponses données pendant cette session.
     */
    public function responses(): HasMany
    {
        return $this->hasMany(TestResponse::class);
    }

    public function proctoringEvents(): HasMany
    {
        return $this->hasMany(ProctoringEvent::class);
    }
}