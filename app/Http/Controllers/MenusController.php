<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Option;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenusController extends Controller
{
    public function index(Tenant $app)
    {
        $perPage = Option::getOption('per_page-' . request()->path()) ?? 10;

        return Inertia::render('Admin/Apps/Menus', [
            'app' => $app->load('domains'),
            'menus' => $app->run(fn() => Menu::paginate($perPage)->onEachSide(1)->toArray()),
        ]);
    }

    public function create(Tenant $app)
    {
        return Inertia::render('Admin/Apps/NewMenu', [
            'app' => $app->load('domains'),
            'contentOptions' => $app->selectContentPageOptions(),
        ]);
    }

    public function store(Tenant $app, Request $request)
    {
        $data = $this->validateMenu($request);

        $app->run(fn() => Menu::create($data));

        return redirect()->route('admin.apps.edit.menu', $app->id);
    }

    public function show(Menu $menu)
    {
    }

    public function edit(Tenant $app, $menu)
    {
        $menu = $app->run(fn() => Menu::find($menu)->toArray());

        return Inertia::render('Admin/Apps/NewMenu', [
            'app' => $app->load('domains'),
            'menu' => $menu,
            'contentOptions' => $app->selectContentPageOptions(),
        ]);
    }

    public function update(Tenant $app, $menu, Request $request,)
    {
        $data = $this->validateMenu($request);

        $app->run(fn() => Menu::find($menu)->update($data));

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Menu updated successfully.',
        ]);
    }

    public function destroy(Menu $menu)
    {
    }

    public function validateMenu(Request $request)
    {
        return $request->validate([
            'is_active' => 'required|boolean',
            'label' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'items' => 'array|min:1',
            'items.*.id' => 'required|uuid',
            'items.*.label' => 'required|string|max:255',
            'items.*.slug' => 'required|string|max:255',
            'items.*.icon' => 'nullable|string|max:255',
            'items.*.content' => 'nullable|string|max:255',
//            'settings' => 'nullable|json',
        ]);
    }
}
