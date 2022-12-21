<?php

namespace App\Http\Middleware;

use App\Http\Controllers\Tenant\MenuController;
use App\Models\Menu;
use App\Services\ConfigApp;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request)
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request)
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => function () use ($request) {
                return array_merge((new Ziggy)->toArray(), [
                    'location' => $request->url(),
                ]);
            },
            'toast' => session('toast'),
            'modal' => session('modal'),
            'isAdminScreen' => $request->routeIs('admin.*') && !tenant(),
            'tenant' => tenant(),
            'menu' => fn() => tenant() ? MenuController::make() : null,
            'queryParameters' => $request->all(),
            'config' => ConfigApp::get(),
        ]);
    }
}
