<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Form extends Model
{
    protected $table = '_forms_';

    protected $fillable = [
        'collection_id',
        'name',
        'description',
        'settings',
        'fields',
    ];

    protected $casts = [
        'settings' => 'json',
        'fields' => 'collection',
    ];

    public function collection(): BelongsTo
    {
        return $this->belongsTo(Collection::class);
    }

    public function render() : Attribute
    {
        return new Attribute(
            get: fn() => $this->formRender()
        );
    }

    public function formRender() : array
    {
        $collections = $this->settings['collections'] ? Collection::whereIn('id', $this->settings['collections'])->get() : collect([]);

        $this->collection && $collections->add($this->collection);

        $fields = $this->fields;

        $form = [];

        foreach ($fields as $section) {
            $form[] = match ($section['type']) {
                'fields' => [
                    'type' => 'fields',
                    'collection' => $section['collection'],
                    'relationship' => $section['relationship'] ?? null,
                    'fields' => $collections->firstWhere('id', $section['collection'])?->columns,
                ],
                'repeater' => [
                    'type' => 'repeater',
                    'collection' => $section['collection'],
                    'relationship' => $section['relationship'],
                    'fields' => $collections->firstWhere('id', $section['collection'])?->columns,
                ],
                default => null,
            };
        }
        return $form;
    }

    public function model()
    {
        return $this->collection?->model();
    }
}
