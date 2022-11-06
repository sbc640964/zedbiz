<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    public function overview()
    {
        return inertia('Tenant/Overview', [
            'tenant' => tenant()->toArray(),
        ]);
    }
}
