<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use App\Models\Page;
use App\Models\Tenant;
use App\Models\Widget;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;

class PagesController extends Controller
{
    public function index(Tenant $app)
    {
        $app->initialize();
        $pages = Page::with('collection:name,id')->paginate(10)->toArray();
        $app->end();

        return Inertia::render('Admin/Apps/Pages/Index', [
            'pages' => $pages,
            'app' => $app->load('domains')
        ]);
    }

    public function store(Tenant $app, Request $request)
    {
        $app->initialize();

        //validate
        $attributes = $request->validate([
            'name' => 'required|max:255',
            'description' => 'nullable',
            'type' => 'required|in:dashboard',
            'collection_id' => 'nullable|exists:collections,id',
            'is_singular' => 'nullable|boolean',
        ]);

        $page = new Page($attributes);

        $page->save();

        $app->end();

        return redirect()->route('admin.apps.edit.pages', [$app]);
    }

    public function update(Tenant $app, $page)
    {
        $app->initialize();

        $page = Page::findOrFail($page);

        $rangeDates = [
            'today',
            'yesterday',
            'this_week',
            'last_week',
            'last_7_days',
            'last_30_days',
            'this_month',
            'last_month',
            'last_3_months',
            'last_6_months',
            'this_year',
            'last_year',
        ];

        //validate
        $attributes = request()->validate([
            'name' => 'required|max:255',
            'description' => 'nullable',
            'settings.default_range_date' => 'nullable|in:'.implode(',', $rangeDates),
        ]);

        $page->update($attributes);

        $app->end();

        return back();
    }

    public function collectionIndex(Tenant $app, $collection)
    {
        $data = $app->run(function () use ($collection) {
            $collection = Collection::findOrFail($collection);
            $pages = $collection->pages()->paginate()->toArray();
            $collection = $collection->toArray();
            return compact('collection', 'pages');
        });

        return Inertia::render('Admin/Apps/Collections/Pages/Index', array_merge($data, [
            'app' => $app->load('domains'),
        ]));
    }

    public function show(Tenant $app, $page)
    {
        $app->initialize();
        $renderResponse = (new \App\Http\Controllers\Tenant\PagesController())->getPage($page);
        $app->end();

        $renderResponse['app'] = $app->load('domains');
        $renderResponse['session_store'] = fn() => session("/" .\request()->path() . "_session_store");

        return Inertia::render('Admin/Apps/Pages/Edit', $renderResponse);
    }

    public function picker(Tenant $app, Request $request, ?int $collection = null)
    {
        $app->initialize();

        $pages = Page::query()
            ->when($collection, fn($query) => $query->where('collection_id', $collection), fn($query) => $query->whereNull('collection_id'))
            ->when($request->has('search'), fn($query) => $query->where('name', 'like', '%' . $request->search . '%'))
            ->get(['id as value', 'name as label', 'description as subtext'])
            ->toArray();

        $app->end();

        return $pages;
    }
}
