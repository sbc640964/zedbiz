<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Page extends Model
{
    protected $table = '_pages_';

    protected $fillable = [
        'collection_id',
        'name',
        'description',
        'is_singular',
        'type',
        'content',
        'settings',
    ];

    protected $casts = [
        'content' => 'json',
        'settings' => 'json',
    ];

    protected $appends = [
        'paths',
    ];

    public function getPathsAttribute()
    {
        if(!$this->exists || !$this->id){
            return [];
        }

        $app = \Str::afterLast($this->getConnection()->getDatabaseName(), 'tenant');

        if(!is_numeric($app)){
            return [];
        }

        return [
            'show' => route('admin.apps.edit.pages.show', [$app, $this]),
            //'delete' => route('admin.apps.edit.pages.destroy', [$this->app, $this]),
        ];
    }

    public function collection(): BelongsTo
    {
        return $this->belongsTo(Collection::class);
    }

    public function widgets(): HasMany
    {
        return $this->hasMany(Widget::class);
    }
}
