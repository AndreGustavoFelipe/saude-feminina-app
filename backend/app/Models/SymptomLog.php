<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SymptomLog extends Model
{
    protected $fillable = ['user_id', 'symptom_id', 'log_date', 'intensity', 'notes'];

    protected $casts = [
        'log_date' => 'date',
    ];

    public function symptom(): BelongsTo
    {
        return $this->belongsTo(Symptom::class);
    }
}
