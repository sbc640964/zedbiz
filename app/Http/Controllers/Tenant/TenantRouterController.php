<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\ListCollection;
use App\Models\Menu;
use Inertia\Inertia;

class TenantRouterController extends Controller
{
    public function __invoke()
    {
        $parameters = request()->route()->parameters();

        $menuSlug = $parameters['menuSlug'] ?? null;
        $innerMenuSlug = $parameters['innerMenuSlug'] ?? null;
        $record = $parameters['record'] ?? null;
        $mode = $parameters['mode'] ?? null;

        $menu = Menu::where('type', 'main')->first();

        $menuActive = $menu->items->where('slug', $menuSlug ?? '/')->first();

        if($innerMenuSlug && $menuActive) {
            $menuActive = collect($menuActive['children'] ?? [])->where('slug', $innerMenuSlug)->first();
        }

        $content = $menuActive['content'] ?? null;

        if(!$content){
            abort(404);
        }

        [$type, $id] = explode(':', $content);

        return $this->{$type}($id, $record, $mode);
    }

    public function list($id, $record, $mode)
    {
        $list = ListCollection::findOrFail($id);

        return Inertia::render('Tenant/List', [
            'collection' => $list->collection,
            'records' => (new ListsController())->getList($list),
            'widgets' => (new ListsController())->getWidgets($list),
            'list' => $list,
        ]);
    }
}
