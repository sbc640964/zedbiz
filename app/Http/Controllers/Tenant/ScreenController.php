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

        return inertia('Tenant/List', [
            'collection' => $collection,
            'records' => (new ListsController())->getList($list),
            'widgets' => (new ListsController())->getWidgets($list),
            'list' => $list,
        ]);
    }
}
