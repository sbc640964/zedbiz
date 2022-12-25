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
        'is_singular' => 'boolean',
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

    public function getDefaultStoreTokens(): array
    {
        $dateRange = match ($this->settings['default_range_date'] ?? 'this_month'){
            'today' => [now()->startOfDay(), now()->endOfDay()],
            'yesterday' => [now()->subDay()->startOfDay(), now()->subDay()->endOfDay()],
            'this_week' => [now()->startOfWeek(), now()->endOfWeek()],
            'last_week' => [now()->subWeek()->startOfWeek(), now()->subWeek()->endOfWeek()],
            'last_7_days' => [now()->subDays(7)->startOfDay(), now()],
            'last_30_days' => [now()->subDays(30)->startOfDay(), now()],
//            'this_month' => [now()->startOfMonth(), now()->endOfMonth()], // is default match
            'last_month' => [now()->subMonth()->startOfMonth(), now()->subMonth()->endOfMonth()],
            'last_3_months' => [now()->subMonths(3)->startOfDay(), now()],
            'last_6_months' => [now()->subMonths(6)->startOfDay(), now()],
            'this_year' => [now()->startOfYear(), now()->endOfYear()],
            'last_year' => [now()->subYear()->startOfYear(), now()->subYear()->endOfYear()],
            default => [now()->startOfMonth(), now()->endOfMonth()],
        };

        return [
            'name' => $this->name,
            'description' => $this->description,
            'settings' => $this->settings,
            'range_date_start' => $dateRange[0]->format('Y-m-d H:i:s'),
            'range_date_end' => $dateRange[1]->format('Y-m-d H:i:s'),
        ];
    }
}
