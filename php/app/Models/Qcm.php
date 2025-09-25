<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Qcm extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * C'est la "liste du videur" pour le modèle Qcm.
     *
     * @var array<int, string>
     */
    protected $fillable = ['job_offer_id', 'title', 'duration_minutes']; // <-- La ligne qui manquait

    /**
     * Récupère l'offre d'emploi à laquelle ce QCM est associé.
     */
    public function jobOffer(): BelongsTo
    {
        return $this->belongsTo(JobOffer::class);
    }

    /**
     * Récupère toutes les questions de ce QCM.
     */
    public function questions(): HasMany
    {
        return $this->hasMany(QcmQuestion::class);
    }

    public function testSessions(): HasMany
    {
        return $this->hasMany(TestSession::class);
    }
}