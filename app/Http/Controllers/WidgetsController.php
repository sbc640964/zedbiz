<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use App\Models\Widget;
use Illuminate\Http\Request;

class WidgetsController extends Controller
{
    public function index()
    {

    }

    public function update(Tenant $app, $widget, Request $request)
    {
        $app->initialize();

        $widget = Widget::findOrFail($widget);

        return $this->store($app, $request, $widget);
    }

    public function destroy(Tenant $app, $widget)
    {
        $app->initialize();
            $widget = Widget::findOrFail($widget);
            $widget->delete();
        $app->end();

        return back()->with('success', 'Widget deleted');
    }

    public function store(Tenant $app, Request $request, $widget = null)
    {
        $app->initialize();
        //validate
        $attributes = $request->validate([
            'page_id' => 'required|exists:_pages_,id',
            'name' => 'required|max:255',
            'description' => 'nullable|string',
            'type' => 'required|string',
            'settings' => 'array',
        ]);

        $widget = ($widget->exists ?? null) ? $widget->fill($attributes) : new Widget($attributes);

        $widget->save();

        $widget = $widget->toArray();

        $app->end();

        return redirect()->route('admin.apps.edit.pages.show', [$app, $widget['page_id']]);
    }

    public static function render(Widget $widget, ?Tenant $app = null)
    {
        $app && $app->initialize();
        $widget->loadMissing('page');
        $render = $widget->render(true);
        $app && $app->end();

        return $render;
    }

    public function duplicate(Tenant $app, $widget)
    {
        $app->initialize();
        $widget = Widget::findOrFail($widget);
        $newWidget = $widget->replicate();
        $newWidget->save();
        $app->end();

        return back()->with('success', 'Widget duplicated');
    }
}
