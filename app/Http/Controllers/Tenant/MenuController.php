<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use Log;

class MenuController extends Controller
{
    public static function make()
    {
        $collections = Collection::where('settings->menu->enable', true)->get();

        $items = $collections->map(function ($menu) {

            if(data_get($menu, 'settings.menu.is_simple') && !data_get($menu, 'settings.menu.list')){
                return null;
            }

            $listId = data_get($menu, 'settings.menu.list');

            return [
                'label' => data_get($menu, 'settings.menu.label', $menu->settings['plural_label'] ?? $menu->name),
                'url' => route('tenant.collections.lists.show', [$menu->slug, $listId]),
                'icon' => data_get($menu, 'settings.menu.icon', 'bookmark'),
                'active' => request()->url() === route('tenant.collections.lists.show', [$menu->slug, $listId]),
                'links' => data_get($menu, 'settings.menu.links')
            ];
        })->filter();

        return compact('items');
    }
}
