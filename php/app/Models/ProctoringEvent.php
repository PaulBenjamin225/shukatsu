<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProctoringEvent extends Model
{
    protected $fillable = ['test_session_id', 'event_type', 'details'];
}
