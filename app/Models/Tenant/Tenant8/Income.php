<?php

namespace App\Models\Tenant\Tenant8;

use Illuminate\Database\Eloquent\Model;

class Income extends Model
{
    protected $table = 'incomes';

    protected $guarded = [];

    protected $casts = [
        'date' => 'datetime',
    ];

    protected $appends = [
        
    ];

    

    
}
