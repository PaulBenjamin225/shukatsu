<?php

namespace App\Models;

// Ajouts importants pour Sanctum et les relations
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    // On ajoute HasApiTokens pour l'authentification par API
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     * On adapte cette liste à notre base de données.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name', // On remplace 'name' par nos champs
        'last_name',
        'email',
        'password',
        'role', // On ajoute le rôle (recruiter ou candidate)
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Récupère toutes les offres d'emploi postées par cet utilisateur (s'il est recruteur).
     */
    public function jobOffers(): HasMany
    {
        return $this->hasMany(JobOffer::class, 'recruiter_id');
    }
}