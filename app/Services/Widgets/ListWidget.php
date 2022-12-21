<?php

namespace App\Services\Widgets;

use App\Http\Controllers\Tenant\ListsController;
use App\Models\Collection;
use App\Models\ListCollection;
use App\Services\SqlParser\Parser;

class ListWidget extends WidgetBase
{
    public function getResponse(bool $admin): array
    {
        return [
            'type' => 'list',
            'label' => $this->getData('self.widget.name'),
            'description' => $this->getData('self.widget.description'),
            'bg_color' => $this->getData('self.widget.settings.bg_color'),

            'keysToParser' => [],

            'widget_settings' => $admin ? $this->widget->toArray() : null,
            'paths' =>  $admin ? $this->getPaths() : [],
            'self' => $this->getData('self'),
            'listData' => $this->listData(),
        ];
    }

    protected function fillData()
    {
        //widget data
        $this->setData('self.widget', $this->widget->toArray());
    }

    private function listData(): array
    {
        $list = ListCollection::find($this->getData('self.widget.settings.list'));

        return [
            'collection' => Collection::find($this->getData('self.widget.settings.collection'))->toArray(),
            'records' => (new ListsController())->getList($list),
            'list' => $list->toArray(),
        ];
    }
}
