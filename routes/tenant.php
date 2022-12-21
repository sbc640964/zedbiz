<?php

declare(strict_types=1);

use App\Http\Controllers\OptionsController;
use App\Http\Controllers\Tenant\ActionsController;
use App\Http\Controllers\Tenant\DashboardController;
use App\Http\Controllers\Tenant\ImportController;
use App\Http\Controllers\Tenant\RecordsController;
use App\Http\Controllers\Tenant\ScreenController;
use App\Http\Controllers\Tenant\TenantRouterController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| Here you can register the tenant routes for your application.
| These routes are loaded by the TenantRouteServiceProvider.
|
| Feel free to customize them however you want. Good luck!
|
*/

Route::middleware([
    'web',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
])->group(function () {

    require __DIR__.'/auth.php';

    Route::get('/', function () {
        $tenantId = Str::ucfirst(tenant()->id);
        return 'This is your multi-tenant application. The id of the current tenant is '.tenant('id');
    });

    Route::group(['prefix' => 'app', 'middleware' => ['auth']], function () {

        Route::get('/', [DashboardController::class, 'show'])->name('tenant.dashboard');

        Route::put('/options', [OptionsController::class, 'update'])->name('options.update');

        //Route::get('/', [DashboardController::class, 'overview'])->name('app');

        Route::post('/{collection}/import/validate', [ImportController::class, 'validateRows'])->name('import.validate');
        Route::post('/{collection}/import/store', [ImportController::class, 'store'])->name('import.store');
        Route::get('/{collection:slug}/list/{list?}', [ScreenController::class, 'list'])->name('tenant.collections.lists.show');


        Route::get('__collectionsApi/search-records/{form}/{field}', [RecordsController::class, 'search'])->name('search-records');
        Route::post('__collectionsApi/{form}/records', [RecordsController::class, 'store'])->name('collections.records.store');
        Route::put('__collectionsApi/{form}/records/{record}', [RecordsController::class, 'update'])->name('collections.records.update');
//        Route::post('__collectionsApi/{list}/actions/{action}', [ActionsController::class, 'fetch'])->name('collections.action');
        Route::get('__collectionsApi/{list}/actions/{action}', [ActionsController::class, 'fetch'])->name('collections.action');

        Route::get('{menuSlug?}/{innerMenuSlug?}/{record?}/{mode?}', TenantRouterController::class)->where('router', '.*');
    });
});
