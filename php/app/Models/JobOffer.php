<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // Ajout important
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class JobOffer extends Model
{
    use HasFactory; // Ajout important

    /**
     * The attributes that are mass assignable.
     * C'est la fameuse "liste du videur" pour la sécurité.
     *
     * @var array<int, string>
     */
    protected $fillable = ['recruiter_id', 'title', 'description']; // Ajout important

    /**
     * Récupère le recruteur (User) qui a posté cette offre.
     */
    public function recruiter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recruiter_id');
    }

    /**
     * Récupère le QCM associé à cette offre.
     */
    public function qcm(): HasOne
    {
        return $this->hasOne(Qcm::class);
    }
    public function applications(): HasManyThrough
    {
        return $this->hasManyThrough(TestSession::class, Qcm::class);
    }
}