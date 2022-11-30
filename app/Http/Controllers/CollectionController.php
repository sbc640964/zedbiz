<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Str;

class CollectionController extends Controller
{
    public function index(Tenant $app)
    {
        $collections = $app->run(fn() => Collection::query()
            ->paginate(10)
            ->toArray()
        );

        return Inertia::render('Admin/Apps/Collections', [
            'collections' => $collections,
            'app' => $app->load('domains'),
        ]);
    }

    public function store(Tenant $app, Request $request)
    {
        $attributes = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255'],
        ]);

        $collection = $app->run(fn() => Collection::create($attributes));

        return redirect()->route('admin.apps.edit.collections.edit', [$app, $collection->id]);
    }

    public function edit(Tenant $app, $collection)
    {
        $collections = $app->run(fn() => Collection::all()->toArray());

        $collection = \Arr::first($collections, fn($item) => $item['id'] === (int)$collection);

        if(!$collection) {
            abort(404);
        }

        return Inertia::render('Admin/Apps/Collection', [
            'collection' => $collection,
            'collections' => $collections,
            'app' => $app->load('domains'),
        ]);
    }

    public function update(Tenant $app, $collection, Request $request)
    {
        $attributes = \Arr::dot($this->validateUpdate($request));

        $app->run(function () use ($attributes, $collection) {
            $collection = Collection::findOrFail($collection);

            collect($attributes)->each(function ($value, $key) use ($collection) {
                if(Str::contains($key, '.')) {
                    $keyAttribute = Str::before($key, '.');
                    $attribute = $collection->{$keyAttribute};
                    $key = Str::after($key, '.');
                    data_set($attribute, $key, $value);
                    return $collection->{$keyAttribute} = $attribute;
                }
                return $collection->{$key} = $value;
            });

            $collection->save();
        });

        return redirect()->back();
    }

    private function validateUpdate(Request $request) : array
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'regex:/^[a-z_-]+$/'],

            'settings' => ['nullable', 'array'],
            'settings.plural_label' => ['nullable', 'string', 'max:255'],
            'settings.singular_label' => ['nullable', 'string', 'max:255'],
            'settings.color' => ['nullable', 'string', 'max:255'],
            'settings.menu' => ['nullable', 'boolean'],
            'settings.menu_icon' => ['nullable', 'string', 'max:255'],
            'settings.menu_label' => ['nullable', 'string', 'max:255'],
            'settings.menu_order' => ['nullable', 'integer'],
            'settings.menu_parent' => ['nullable', 'string', 'max:255'],
            'settings.menu_badge' => ['nullable', 'string', 'max:255'],
            'settings.default_list' => ['nullable', 'string', 'max:255'],
            'settings.default_form' => ['nullable', 'string', 'max:255'],
            'settings.menu.new_form_sections' => ['nullable', 'array'],
            'settings.default_single' => ['nullable', 'string', 'max:255'],
            'settings.default_dashboard' => ['nullable', 'string', 'max:255'],
            'settings.primary_column' => ['nullable', 'string', 'max:255'],
        ];

        return $request->validate(\Arr::only($rules, $request->keys()));
    }

    public function migrate(Tenant $app, ?int $collection = null)
    {
        $request = request();

        $forces = collect($request->get('force', []));

        try {
            $app->run(function () use ($forces, $collection) {
                if($collection) {
                    $collection = Collection::findOrFail($collection);
                    $collection->migrate($forces->has($collection->id));
                    $collection->createModel();
                } else {
                    $collections = Collection::all();
                    $collections->each(function ($collection) use ($forces) {
                        $collection->migrate($forces->has($collection->id), true);
                        $collection->migrateForeign();
                        $collection->createModel();
                    });
                }
            });
        } catch (\Throwable $e) {
            dd($e);
            return redirect()->back()->with('toast', [
                'type' => 'error',
                'message' => $e->errorInfo[2] ?? $e->getMessage(),
            ]);
        }

        return redirect()->back();
    }

    public function pickerAll(Tenant $app, $collection)
    {
        $data = $app->run(function () use ($collection) {
            $lists = Collection::findOrFail($collection)->lists()->select(['name as label', 'description as subtext'])
                ->selectRaw("\"lists\" as `group`, CONCAT(\"lists:\", id) as `value`");

            return $lists->get()->toArray();
            //$forms = $collection->forms();
        });

        return response()->json(collect($data)->groupBy('group')->map(function ($item, $key) {
            return ['label' => $key, 'options' => $item];
        })->values()->toArray());
    }

    public function storeMenu(Tenant $app, $collection, Request $request)
    {
        $app->run(function () use ($collection, $request) {

            $collection = Collection::findOrFail($collection);

            $attributes = $request->validate([
                'label' => ['required', 'string', 'max:255'],
                'content' => ['required', 'string', function ($attribute, $value, $fail) {
                    [$table, $id] = explode(':', $value);
                    if(!\DB::table("_{$table}_")->where('id', $id)->first()){
                        $fail("{$attribute} is invalid.");
                    }
                }],
            ]);

            $settings = $collection->settings;

            if(empty($settings['menu']['links'])) {
                $settings['menu']['links'] = [];
            }
            $settings['menu']['links'][] = $attributes;

            $collection->update(['settings' => $settings]);
        });

        return redirect()->back();
    }

}
