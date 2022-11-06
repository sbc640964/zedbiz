<?php

namespace App\Models\Tenant\Tenant8;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $table = 'expenses';

    protected $guarded = [];

    protected $casts = [
        'date' => 'datetime',
    ];

    protected $appends = [
        
    ];

    

    
}
