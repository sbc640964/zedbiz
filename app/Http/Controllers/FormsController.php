<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use App\Models\Tenant;

class FormsController extends Controller
{
    public function index(Tenant $app, ?Collection $collection = null)
    {
        $forms = $app->run(fn() => $collection
            ->forms()
            ->paginate(15)
            ->toArray()
        );

        return inertia('Admin/Apps/Forms', [
            'forms' => $forms,
            'app' => $app->load('domains'),
            'collection' => $collection,
        ]);
    }
}
