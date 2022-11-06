<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Option extends Model
{
    protected $guarded = [];

    static function getOption($key, $user_id = null)
    {
        return static::query()
            ->where('key', $key)
            ->where('user_id', $user_id ?? auth()->id())
            ->first()
            ->value ?? null;
    }
}
