<?php

namespace App\Models;

use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;
use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;
use Stancl\Tenancy\Exceptions\TenantCouldNotBeIdentifiedById;

class Tenant extends BaseTenant implements TenantWithDatabase
{
    use HasDatabase, HasDomains;

    public $hidden = [
        'tenancy_db_name',
        'tenancy_db_username',
        'tenancy_db_password',
    ];

    public static function getCustomColumns(): array
    {
        return [
            'id',
            'name',
            'description',
            'brand',
        ];
    }

    public function getIncrementing(): bool
    {
        return true;
    }

    /**
     * Initializes the tenant.
     * All queries will be scoped to this tenant.
     * @return void
     * @throws TenantCouldNotBeIdentifiedById
     */
    public function initialize()
    {
        tenancy()->initialize($this);
    }

    /**
     * Ends the tenant.
     * All queries will be scoped to the global tenant.
     * if $originalTenant is provided, it will be used as the global tenant.
     * @param Tenant|null $originalTenant
     * @return void
     * @throws TenantCouldNotBeIdentifiedById
     */
    public function end(Tenant $originalTenant = null): void
    {
        if(!$this->id){
            return;
        }
        $originalTenant ? tenancy()->initialize($originalTenant) : tenancy()->end();
    }

    public function selectContentPageOptions()
    {
        return $this->run(function () {
            $lists = ListCollection::with('collection')
                ->get()
                ->transform(function ($list) {
                    return [
                        'group' => $list->collection->id,
                        'group_label' => $list->collection->name,
                        'label' => $list->name,
                        'value' => 'list:' . $list->id,
                        'subtext' => 'List',
                    ];
                });

            return collect()
                ->merge($lists);
        });
    }
}
