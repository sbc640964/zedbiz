<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Option extends Model
{
    protected $guarded = [];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->setTable(tenant() ? '_options_' : 'options');
    }


    static function getOption($key, $user_id = null)
    {
        return static::query()
            ->where('key', $key)
            ->where('user_id', $user_id ?? auth()->id())
            ->first()
            ->value ?? null;
    }

    static function getOptions(array $keys = [], $user_id = null)
    {
        return static::query()
            ->where('user_id', $user_id ?? auth()->id())
            ->whereIn('key', $keys)
            ->get()
            ->pluck('value', 'key')
            ->collapse();
    }
}
