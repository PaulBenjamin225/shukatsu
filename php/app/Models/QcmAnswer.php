<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QcmAnswer extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * C'est la "liste du videur" pour le modèle QcmAnswer.
     *
     * @var array<int, string>
     */
    protected $fillable = ['question_id', 'answer_text', 'is_correct']; // <-- La ligne qui manquait

    /**
     * Récupère la question à laquelle cette réponse est associée.
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(QcmQuestion::class, 'question_id');
    }
}