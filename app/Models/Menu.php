<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    protected $table = '_menus_';

    protected $casts = [
        'items' => 'collection',
        'settings' => 'json',
    ];

    protected $fillable = [
        'name',
        'description',
        'slug',
        'items',
        'settings',
        'is_active',
        'type',
        'label',
    ];
}

