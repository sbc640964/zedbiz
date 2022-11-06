<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ListCollection extends Model
{
    protected $table = '_lists_';

    protected $guarded = [];

    protected $casts = [
        'settings' => 'json',
        'columns' => 'array',
        'permissions' => 'json',
    ];

    public function collection(): BelongsTo
    {
        return $this->belongsTo(Collection::class);
    }
}
