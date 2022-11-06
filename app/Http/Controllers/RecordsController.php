<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use Illuminate\Http\Request;
use \App\Http\Controllers\Tenant\RecordsController as TenantRecordsController;

class RecordsController extends Controller
{
    public function search(Tenant $app, $form, $field, Request $request)
    {
        return $app->run(fn() =>
            (new TenantRecordsController())->search($form, $field, $request)
        );
    }

    public function store(Tenant $app, $form, Request $request)
    {
        return $app->run(fn() =>
            (new TenantRecordsController())->store($form, $request)
        );
    }

    public function update(Tenant $app, $form, $record, Request $request)
    {
        return $app->run(fn() =>
            (new TenantRecordsController())->update($form, $record, $request)
        );
    }
}
