<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TestResponse extends Model
{
    use HasFactory;

    protected $fillable = [
        'test_session_id',
        'question_id',
        'answer_id',
    ];

    /**
     * Récupère la session de test associée à cette réponse.
     */
    public function testSession(): BelongsTo
    {
        return $this->belongsTo(TestSession::class);
    }
}