<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Services\ConfigApp;

class DashboardController extends Controller
{
    public function show()
    {
        if(ConfigApp::get('show_over_view_page') && $page = ConfigApp::get('over_view_page_id')){
            $page = (new PagesController())->getPage($page);
            return inertia('Tenant/Overview', $page);
        }

        abort(404);
    }
}
