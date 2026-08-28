<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class LifePhase extends Model
{
    protected $fillable = ['name', 'slug'];

    protected static function booted(): void
    {
        static::creating(function (LifePhase $lifePhase) {
            $lifePhase->slug = Str::slug($lifePhase->name);
        });

        static::updating(function (LifePhase $lifePhase) {
            if ($lifePhase->isDirty('name')) {
                $lifePhase->slug = Str::slug($lifePhase->name);
            }
        });
    }

    public function articles(): HasMany
    {
        return $this->hasMany(Article::class);
    }
}
