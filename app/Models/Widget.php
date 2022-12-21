<?php

namespace App\Models;

use App\Services\Widgets\ChartWidget;
use App\Services\Widgets\DoughnutWidget;
use App\Services\Widgets\ListWidget;
use App\Services\Widgets\NumberWidget;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Widget extends Model
{
    protected $table = '_widgets_';

    protected $fillable = [
        'page_id',
        'name',
        'description',
        'type',
        'settings',
    ];

    protected $casts = [
        'settings' => 'json',
    ];

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
    }

    public function render($admin = false): array
    {
        \Log::info('Rendering widget: ' . $this->type);

        return match ($this->type){
            'number' => (new NumberWidget($this))->render($admin),
            'chart' => (new ChartWidget($this))->render($admin),
            'doughnut' => (new DoughnutWidget($this))->render($admin),
            'list' => (new ListWidget($this))->render($admin),
            default => [],
        };
    }

    public function renderNumber()
    {

    }
}
