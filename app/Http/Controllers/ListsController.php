<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use App\Models\ListCollection;
use App\Models\Option;
use App\Models\Tenant;
use App\Services\SqlParser\Parser;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ListsController extends Controller
{
    public function index(Tenant $app, $collection)
    {
        $collection = $app->run(fn() =>
            Collection::with('lists')
                ->findOrFail($collection)->toArray()
        );

        return Inertia::render('Admin/Apps/Lists', [
            'collection' => $collection,
            'app' => $app->load('domains'),
        ]);
    }

    public function create(Tenant $app, $collection)
    {
        $collection = $app->run(fn() => Collection::findOrFail($collection)->toArray());
        $collections = $app->run(fn() => Collection::all('name', 'table_name', 'slug', 'columns')
            ->append('table_name')
            ->toArray()
        );

        return Inertia::render('Admin/Apps/NewList', [
            'collection' => $collection,
            'app' => $app->load('domains'),
            'collections' => $collections,
        ]);
    }

    public function store(Tenant $app, $collection, Request $request)
    {
        $attributes = $this->validateAttributes($request, $app);

        $list = $app->run(fn() =>
            Collection::findOrFail($collection)
                ->lists()
                ->create($attributes)
        );

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'List created successfully'
        ]);
    }

    public function destroy(Tenant $app, $collection, $list)
    {
        $list = $app->run(fn() =>
            ListCollection::findOrFail($list)->delete()
        );

        return redirect()->route('admin.apps.edit.collections.lists', [
            'app' => $app->id,
            'collection' => $collection,
        ])->with('toast', [
            'type' => 'success',
            'message' => 'List deleted successfully'
        ]);
    }

    public function edit(Tenant $app, $collection, $list)
    {
        $list = $app->run(fn() =>
            ListCollection::with('collection')
                ->findOrFail($list)
        );

        $collections = $app->run(fn() => Collection::with('lists')->get(['id', 'name', 'table_name', 'slug', 'columns'])
            ->append('table_name')
            ->toArray()
        );

        $perPage = Option::getOption('per_page-' . request()->path()) ?? 10;

        return Inertia::render('Admin/Apps/List', [
            'app' => $app->load('domains'),
            'collections' => $collections,
            'collection' => $app->run(fn() => $list->collection->toArray()),
            'records' => $app->run(fn() =>
                (new \App\Http\Controllers\Tenant\ListsController())->getList($list, $perPage)
            ),
            'widgets' => $app->run(fn() =>
                (new \App\Http\Controllers\Tenant\ListsController())->getWidgets($list)
            ),
            'list' => $app->run(fn() => $list->toArray()),
        ]);
    }

    public function selectAll(Tenant $app, $collection, $list, Request $request)
    {
        $list = $app->run(fn() =>
            ListCollection::with('collection')
                ->findOrFail($list)
        );

        return $app->run(fn() => (new \App\Http\Controllers\Tenant\ListsController())->getList($list, returnQuery: true)->get('id')->pluck('id'));
    }

    public function update(Tenant $app, $collection, $list, Request $request)
    {
        $attributes = $this->validateAttributes($request, $app);

        $list = $app->run(fn() =>
            ListCollection::findOrFail($list)
                ->update($attributes)
        );

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'List updated successfully'
        ]);
    }

    public function picker(Tenant $app, $collection, Request $request)
    {
        $data = $app->run(fn() => Collection::findOrFail($collection)->lists()->when($request->get('q'), function ($query, $value) {
            $query->where('name', 'like', '%' . $value . '%');
        })->get(['id as value', 'name as label'])->toArray());

        return $data;
    }

    public function validateAttributes(Request $request, Tenant $app)
    {
        $attributes = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'query_mode' => ['required', 'string', 'max:255'],
            'settings.raw_query' => ['required_if:query_mode,raw_sql', 'string', function ($attribute, $value, $fail) use ($app) {
                $app->run(function () use ($value, $fail) {
//                    try {
                        Parser::make($value)->getQuery()->get();
//                    } catch (\Throwable $e) {
//                        $fail('Invalid SQL query');
//                    }
                });
            }],
            'settings.bulk_actions.enabled' => ['nullable', 'boolean'],

            'settings.widgets.enabled' => ['nullable', 'boolean'],
            'settings.widgets.items' => ['nullable', 'array'],

            'settings.query_selects' => ['array'],
            'settings.query_joins' => ['nullable', 'array'],
            'settings.query_group_by_id' => ['nullable'],
            'settings.enable_add_new' => ['nullable', 'boolean'],
            'settings.add_new_label' => ['nullable', 'string'],
            'settings.add_new_form' => ['nullable', 'int', 'exists:_forms_,id'],
            'settings.add_new_relationship_forms' => ['nullable', 'array'],
            'settings.add_new_view_method' => ['nullable', 'string', 'in:modal,page'],
            'settings.enable_import' => ['nullable', 'boolean'],
            'settings.enable_export' => ['nullable', 'boolean'],

            'settings.actions' => ['nullable', 'array'],
            'settings.columns' => ['nullable', 'array'],
        ]);

        return $attributes;
    }
}
