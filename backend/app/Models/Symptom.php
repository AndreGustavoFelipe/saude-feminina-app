<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Symptom extends Model
{
    protected $fillable = ['name', 'icon'];

    public function logs(): HasMany
    {
        return $this->hasMany(SymptomLog::class);
    }
}
