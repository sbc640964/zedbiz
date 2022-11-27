<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Str;

class ColumnsController extends Controller
{
    public function index(Tenant $app, $collection)
    {
        $collection = $app->run(fn() => Collection::findOrFail($collection)->toArray());

        return Inertia::render('Admin/Apps/Columns', [
            'collection' => $collection,
            'app' => $app->load('domains'),
        ]);
    }

    public function store(Tenant $app, $collection, Request $request)
    {
        $collection = $app->run(fn() => Collection::findOrFail($collection));

        $attributes = $this->validateData($app, $request, $collection);

        $app->run(function () use ($app, $collection, $attributes) {
            $columns = $collection->columns ?? collect();
            $columns->add(array_merge($attributes, ['id' => Str::uuid()]));
            $collection->columns = $columns;
            $collection->save();
        });

        return redirect()->route('admin.apps.edit.collections.columns', [
            'app' => $app,
            'collection' => $collection,
        ])->with('toast', [
            'type' => 'success',
            'message' => 'Column added successfully',
        ]);
    }

    public function update(Tenant $app, $collection, $column, Request $request)
    {
        $collection = $app->run(fn() => Collection::findOrFail($collection));

        $attributes = $this->validateData($app, $request, $collection);

        $app->run(function () use ($app, $collection, $column, $attributes) {
            $columns = $collection->columns->map(function ($item) use ($column, $attributes) {
                if ($item['id'] === $column) {
                    return array_merge($item, $attributes);
                }
                return $item;
            });
            $collection->columns = $columns;
            $collection->save();
        });

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'Column updated successfully',
        ]);
    }

    public function destroy(Tenant $app, $collection, $column)
    {
        $app->run(function () use ($app, $collection, $column) {
            $collection = Collection::findOrFail($collection);
            $columns = $collection->columns->filter(function ($item) use ($column) {
                return $item['id'] !== $column;
            });
            $collection->columns = $columns;
            $collection->save();
        });

        return redirect()->route('admin.apps.edit.collections.columns', [
            'app' => $app,
            'collection' => $collection,
        ])->with('toast', [
            'type' => 'success',
            'message' => 'Column deleted successfully',
        ]);
    }

    public function create(Tenant $app, $collection, $column = null)
    {
        $collection = $app->run(fn() => Collection::findOrFail($collection)->toArray());
        $collections = $app->run(fn() => Collection::all('id', 'name', 'columns', 'settings->singular_label as singular_label')->toArray());

        return Inertia::render('Admin/Apps/Column', [
            'collection' => $collection,
            'collections' => $collections,
            'app' => $app->load('domains'),
            'columnId' => $column
        ]);
    }

    public function validateData(Tenant $app, Request $request, Collection $collection)
    {
        $types = [
            'text' => 'string',
            'textarea' => 'text',
            'number' => 'integer',
            'date' => 'timestamp',
            'datetime' => 'timestamp',
            'time' => 'timestamp',
            'select' => null,
            'checkbox' => 'json',
            'acceptance' => 'boolean',
            'radio' => 'string',
            'file' => 'json',
            'image' => 'json',
            'currency' => 'float',
            'percentage' => 'float',
            'url' => 'string',
            'email' => 'string',
            'password' => 'string',
            'color' => 'string',
            'icon' => 'string',
            'relation' => null,
            'as' => null,
            'id' => 'id',
        ];


        return $request->validate([
            'id' => 'nullable|uuid',
            'label' => 'required|string|max:255',
            'type' => 'required|string|max:255|in:'.implode(',', array_keys($types)),
            'name' => ['required','string','max:255','regex:/^[a-zA-Z0-9_]+$/', function ($attribute, $value, $fail) use ($collection, $app, $request) {
                if(($collection->columns ?? collect())
                    ->filter(fn($c) => $c['id'] !== $request->id)
                    ->pluck('name')
                    ->contains($value)
                ) {
                    $fail('The name has already been taken.');
                }
            }],
            'description' => 'nullable|string|max:255',
            'required' => 'nullable|boolean',
            'default' => 'nullable|string|max:255',
            'unique' => 'nullable|boolean',

            'enable_dynamic_default' => 'nullable|boolean',
            'dynamic_default_expression' => 'nullable|string|max:255',

            'currency_mode' => 'nullable|string|max:255|in_array:'.implode(',', ['static', 'by_selection']),
            'currency_selection' => 'nullable|array|max:255',
            'currency_selection.*' => 'nullable|string|max:255|in_array:'.implode(',', ['USD', 'ILS']), //TODO: add currencies;

            'hebrew_calendar' => 'nullable|boolean',

            'options' => ['array', Rule::excludeIf(!in_array($request->type, ['select', 'checkbox', 'radio'])), 'required'],
            'options.*.value' => 'required_if:type,select|required_if:type,checkbox|required_if:type,radio|string|max:255',
            'options.*.description' => 'nullable|string|max:255',
            'options.*.icon' => 'nullable|string|max:255',
            'options.*.image' => 'nullable|string|max:255',
            'options.*.color' => 'nullable|string|max:255',

            'relationTable' => ['required_if:type,relation', 'max:255', function ($attribute, $value, $fail) use ($app) {
                if (! $app->run(fn() => Collection::find($value))) {
                    $fail('The relation table does not exist.');
                }
            }],

            'relationTableColumn' => 'nullable|string|max:255',
            'relationSelectorLabel' => 'nullable|string|max:255',

            'select_label_selector' => 'nullable|string|max:255',
            'select_group_by_selector' => 'nullable|string|max:255',
            'select_extra_type' => 'nullable|string|max:255|in:icon,color,image,subtext',
            'select_icon_selector' => [
                Rule::requiredIf(fn() => 'relation' === $request->get('type') && $request->get('select_extra_type') === 'icon'),
                'string|max:255'
            ],
            'select_image_selector' => [
                Rule::requiredIf(fn() => 'relation' === $request->get('type') && $request->get('select_extra_type') === 'image'),
                'string|max:255'
            ],
            'select_color_selector' => [
                Rule::requiredIf(fn() => 'relation' === $request->get('type') && $request->get('select_extra_type') === 'color'),
                'string|max:255'
            ],
            'select_subtext_selector' => [
                Rule::requiredIf(fn() => 'relation' === $request->get('type') && $request->get('select_extra_type') === 'subtext'),
                'string|max:255'
            ],
        ]);
    }
}
