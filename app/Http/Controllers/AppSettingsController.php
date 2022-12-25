<?php

namespace App\Http\Controllers;

use App\Models\Option;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Stancl\Tenancy\Exceptions\TenantCouldNotBeIdentifiedById;

class AppSettingsController extends Controller
{
    const CASTS = [
        'show_over_view_page' => 'boolean',
        'over_view_page_menu_label' => 'string',
    ];

    const RULES = [
        'show_over_view_page' => 'boolean',
        'over_view_page_menu_label' => ['string','nullable'],
    ];

    public function applyCasts($data)
    {
        foreach (self::CASTS as $key => $type) {
            if (isset($data[$key])) {
                settype($data[$key], $type);
            }
        }
        return $data;
    }

    public function validateCasts($key, $value)
    {
        if (isset(self::CASTS[$key])) {
            $type = self::CASTS[$key];
            return gettype($value) === $type;
        }
        return true;
    }

    /**
     * @param Tenant $app
     * @param Request $request
     * @throws TenantCouldNotBeIdentifiedById
     */
    public function storeOrUpdate(Tenant $app, Request $request)
    {
        $this->validate($request, [
            'key' => 'required|string',
            'value' => [function ($attribute, $value, $fail) use ($request) {
                if (!$this->validateCasts($request->key, $value)) {
                    $fail('The value is not of the correct type.');
                }
            }, ...$this->getRules($request->key)],
        ]);

        $app->initialize();

        Option::updateOrCreate(
            $request->only('key', 'user_id'),
            $request->only('value')
        );

        $app->end();

        return back();
    }

    public function getAllSettings(Tenant $app)
    {
        $isAdminCentral = $app->id !== tenant('id');

        $isAdminCentral && $app->initialize();

        $settings = Option::whereNull('user_id')
            ->get(['key', 'value'])
            ->transform(function (Option $item) {
                return $item->pluck('value', 'key');
            })
            ->collapse()
            ->toArray();

        $isAdminCentral && $app->end();

        return $this->applyCasts($settings);
    }

    public function index(Tenant $app)
    {
        $settings = $this->getAllSettings($app);

        return Inertia::render('Admin/Apps/Settings/Index', [
            'settings' => $settings,
            'app' => $app->load('domains'),
        ]);
    }

    private function getRules(mixed $key)
    {
        if (isset(self::RULES[$key])) {
            return (array)self::RULES[$key];
        }
        return [];
    }
}
