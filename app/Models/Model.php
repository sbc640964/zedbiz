<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;

class Model extends \Illuminate\Database\Eloquent\Model
{
    public function className() : Attribute
    {
        return new Attribute(
            get: fn($value) => get_class($this),
        );
    }
}
