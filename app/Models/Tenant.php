<?php

namespace App\Models;

use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;
use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;

class Tenant extends BaseTenant implements TenantWithDatabase
{
    use HasDatabase, HasDomains;

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
