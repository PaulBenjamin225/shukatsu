<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QcmQuestion extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * C'est la "liste du videur" pour le modèle QcmQuestion.
     *
     * @var array<int, string>
     */
    protected $fillable = ['qcm_id', 'question_text']; // <-- La ligne qui manquait

    /**
     * Récupère le QCM auquel cette question appartient.
     */
    public function qcm(): BelongsTo
    {
        return $this->belongsTo(Qcm::class);
    }

    /**
     * Récupère toutes les réponses possibles pour cette question.
     */
    public function answers(): HasMany
    {
        return $this->hasMany(QcmAnswer::class, 'question_id');
    }
}