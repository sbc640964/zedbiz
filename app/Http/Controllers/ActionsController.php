<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use App\Http\Controllers\Tenant\ActionsController as TenantActionsController;

class ActionsController extends Controller
{
    public function index()
    {

    }

    public function action(Tenant $app, $list, $action)
    {
        return $app->run(function() use ($list, $action) {
            return (new TenantActionsController)->fetch($list, $action);
        });
    }
}
