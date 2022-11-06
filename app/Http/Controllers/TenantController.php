<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use App\Models\ListCollection;
use App\Models\Option;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Str;

class TenantController extends Controller
{
    public function index()
    {
        $perPage = Option::getOption('per_page-' . request()->path()) ?? 10;

        return Inertia::render('Admin/Apps/Index', [
            'apps' => Tenant::with('domains')
                ->paginate($perPage)
                ->onEachSide(1)
        ]);
    }

    public function store()
    {
        $this->validate(request(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'domain' => 'required|string|max:255',
            'brand' => 'image|max:2048',
        ]);


        $tenant = Tenant::create([
            'name' => request('name'),
            'description' => request('description'),
            'brand' => request()->file('brand')->store('brands'),
            'tenancy_db_username' => 't_' . \request('domain') . '_' . Str::random(10),
            'tenancy_db_password' => Str::uuid(),
        ]);

        if ($tenant) {
            $tenant->domains()->create([
                'domain' => request('domain') . '.' . config('tenancy.central_domains')[0],
            ]);
        }

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'Application created successfully.',
        ]);

    }

    public function show(Tenant $app)
    {
        return Inertia::render('Admin/Apps/Show', [
            'app' => $app->load('domains'),
            'apps' => Tenant::all()->transform(function ($app) {
                return [
                    'label' => $app->name,
                    'image' => asset('storage/' . $app->brand),
                    'value' => $app->id,
                    'subtext' => Str::excerpt($app->description, '', [
                        'radius' => 25,
                    ]),
                ];
            }),
        ]);
    }

    public function destroy(Tenant $app)
    {
        $app->delete();

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'Application deleted successfully.',
        ]);
    }

    public function picker(Request $request)
    {
        $search = $request->get('q');

        return Tenant::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->get()
            ->transform(function ($app) {
                return [
                    'label' => $app->name,
                    'image' => asset('storage/' . $app->brand),
                    'value' => $app->id,
                    'subtext' => Str::excerpt($app->description, '', [
                        'radius' => 25,
                    ]),
                ];
            });
    }
}
