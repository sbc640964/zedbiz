<?php

use App\Http\Controllers\ActionsController;
use App\Http\Controllers\CollectionController;
use App\Http\Controllers\ColumnsController;
use App\Http\Controllers\ListsController;
use App\Http\Controllers\MenusController;
use App\Http\Controllers\OptionsController;
use App\Http\Controllers\RecordsController;
use App\Http\Controllers\TenantController;
use App\Http\Controllers\UsersController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Tenant\UsersController as TenantUsersController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->name('admin.')->group(function () {
    Route::get('/users', [UsersController::class, 'index'])->name('users');
    Route::post('/users', [UsersController::class, 'store'])->name('users.store');
    Route::get('/users/{user}', [UsersController::class, 'show'])->name('users.show');
    Route::get('/users/{user}/edit', [UsersController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [UsersController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UsersController::class, 'destroy'])->name('users.destroy');
});

Route::middleware(['auth', 'verified'])->name('options.')->group(function () {
    Route::put('/options', [OptionsController::class, 'update'])->name('update');
});

Route::middleware(['auth', 'verified'])->name('admin.apps')->group(function () {
    Route::get('/apps', [TenantController::class, 'index']);
    Route::get('/apps-picker', [TenantController::class, 'picker'])->name('.picker');
    Route::post('/apps', [TenantController::class, 'store'])->name('.store');
    Route::prefix('/apps/{app}')->name('.edit')->group(function () {
        Route::get('/', [TenantController::class, 'show']);

        Route::get('/select-content-page-options', [TenantController::class, 'selectContentPageOptions'])->name('.select-content');

        Route::get('/users', [TenantUsersController::class, 'index'])->name('.users');
        Route::post('/users', [TenantUsersController::class, 'store'])->name('.users.store');
        Route::get('/users/{user}', [TenantUsersController::class, 'show'])->name('.users.show');
        Route::get('/users/{user}/edit', [TenantUsersController::class, 'edit'])->name('.users.edit');
        Route::put('/users/{user}', [TenantUsersController::class, 'update'])->name('.users.update');
        Route::delete('/users/{user}', [TenantUsersController::class, 'destroy'])->name('.users.destroy');

        Route::get('/menu', [MenusController::class, 'index'])->name('.menu');
        Route::get('/menu/new', [MenusController::class, 'create'])->name('.menu.create');
        Route::post('/menu', [MenusController::class, 'store'])->name('.menu.store');
        Route::get('/menu/{menu}', [MenusController::class, 'show'])->name('.menu.show');
        Route::get('/menu/{menu}/edit', [MenusController::class, 'edit'])->name('.menu.edit');
        Route::put('/menu/{menu}', [MenusController::class, 'update'])->name('.menu.update');
        Route::delete('/menu/{menu}', [MenusController::class, 'destroy'])->name('.menu.destroy');

        Route::get('/collections', [CollectionController::class, 'index'])->name('.collections');
        Route::post('/collections', [CollectionController::class, 'store'])->name('.collections.store');
        Route::post('/collections/migrate/{collection?}', [CollectionController::class, 'migrate'])->name('.collections.migrate');
        Route::get('/collections/{collection}', [CollectionController::class, 'edit'])->name('.collections.edit');
        Route::put('/collections/{collection}', [CollectionController::class, 'update'])->name('.collections.update');
        Route::post('/collections/{collection}/store_menu', [CollectionController::class, 'storeMenu'])->name('.collections.store_menu');

        Route::get('/{form}/{field}', [RecordsController::class, 'search'])->name('.search-records');
        Route::post('/collections/{form}/records', [RecordsController::class, 'store'])->name('.collections.records.store');
        Route::put('/collections/{form}/records/{record}', [RecordsController::class, 'update'])->name('.collections.records.update');

        Route::get('/collections/{collection}/columns', [ColumnsController::class, 'index'])->name('.collections.columns');
        Route::get('/collections/{collection}/columns/new', [ColumnsController::class, 'create'])->name('.collections.columns.create');
        Route::get('/collections/{collection}/columns/{column}', [ColumnsController::class, 'create'])->name('.collections.columns.edit');
        Route::put('/collections/{collection}/columns/{column}', [ColumnsController::class, 'update'])->name('.collections.columns.update');
        Route::delete('/collections/{collection}/columns/{column}', [ColumnsController::class, 'destroy'])->name('.collections.columns.destroy');
        Route::post('/collections/{collection}/columns', [ColumnsController::class, 'store'])->name('.collections.columns.store');



        Route::get('/collections/{collection}/picker_lists', [ListsController::class, 'picker'])->name('.collections.picker_lists');

        Route::get('/collections/{collection}/picker_all', [CollectionController::class, 'pickerAll'])->name('.collections.picker_all');

        Route::get('/collections/{collection}/lists', [ListsController::class, 'index'])->name('.collections.lists');
        Route::get('/collections/{collection}/lists/new', [ListsController::class, 'create'])->name('.collections.lists.create');
        Route::post('/collections/{collection}/lists', [ListsController::class, 'store'])->name('.collections.lists.store');
        Route::get('/collections/{collection}/lists/{list}', [ListsController::class, 'edit'])->name('.collections.lists.edit');
        Route::put('/collections/{collection}/lists/{list}', [ListsController::class, 'update'])->name('.collections.lists.update');
        Route::delete('/collections/{collection}/lists/{list}', [ListsController::class, 'destroy'])->name('.collections.lists.delete');

        Route::get('/collections/{collection}/lists/{list}/select_all', [ListsController::class, 'selectAll'])->name('.collections.lists.select-all');

        Route::get('/actions/{list}/{action}', [ActionsController::class, 'action'])->name('.collections.action');

//        Route::get('/collections/{collection}/picker_forms', [ListsController::class, 'picker'])->name('.collections.picker_forms');

        Route::get('/collections/{collection}/forms', [CollectionController::class, 'edit'])->name('.collections.forms');
//        Route::get('/collections/{collection}/forms/{form}', [CollectionController::class, 'edit'])->name('.collections.forms.edit');
        Route::get('/collections/{collection}/dashboards', [CollectionController::class, 'edit'])->name('.collections.dashboards');
//        Route::get('/collections/{collection}/dashboards/{dashboard}', [CollectionController::class, ''])->name('.collections.dashboards.edit');
        Route::get('/collections/{collection}/singles', [CollectionController::class, 'edit'])->name('.collections.singles');
//        Route::get('/collections/{collection}/singles/{single}', [CollectionController::class, 'edit'])->name('.collections.singles.edit');
        Route::get('/collections/{collection}/workflows', [CollectionController::class, 'edit'])->name('.collections.workflows');
//        Route::get('/collections/{collection}/workflows/{workflow}', [CollectionController::class, 'edit'])->name('.collections.workflow.edit');
        Route::get('/collections/{collection}/permissions', [CollectionController::class, 'edit'])->name('.collections.permissions');
//        Route::get('/collections/{collection}/permissions/{permission}', [CollectionController::class, 'edit'])->name('.collections.permissions.edit');

        Route::get('/payments', [TenantController::class, 'update'])->name('.payments');
        Route::get('/settings', [TenantController::class, 'destroy'])->name('.settings');
    });
    Route::get('/apps/{app}', [TenantController::class, 'show'])->name('.edit');
    Route::put('/apps/{app}', [TenantController::class, 'update'])->name('.update');
    Route::delete('/apps/{app}', [TenantController::class, 'destroy'])->name('.destroy');
});

require __DIR__.'/auth.php';
