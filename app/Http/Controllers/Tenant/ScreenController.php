<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use App\Models\ListCollection;

class ScreenController extends Controller
{
    public function list(Collection $collection, ListCollection $list)
    {
        $list = $list->id ? $list : $collection->getDefaultList();

        if($list->settings['enable_add_new'] && empty($list->settings['add_new_form']) && !empty($list->settings['add_new_relationship_forms'])) {

            $collectionsRelationship = Collection::findMany(
                collect($list->settings['add_new_relationship_forms'])->pluck('collection')->flatten()->toArray()
            );

            $list->settings = array_merge($list->settings, ['add_new_relationship_forms_objects' => $collectionsRelationship]);
        }



        return inertia('Tenant/List', [
            'collection' => $collection,
            'records' => (new ListsController())->getList($list),
            'widgets' => (new ListsController())->getWidgets($list),
            'list' => $list,
        ]);
    }
}
