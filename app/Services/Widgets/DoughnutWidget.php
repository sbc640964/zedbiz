<?php

namespace App\Services\Widgets;

class DoughnutWidget extends WidgetBase
{
    public function getResponse(bool $admin): array
    {
        return [
            'type' => 'doughnut',
            'label' => $this->getData('self.widget.name'),
            'description' => $this->getData('self.widget.description'),
            'bg_color' => $this->getData('self.widget.settings.bg_color'),

            'data' => [
                'datasets' => [
                    [
                        'label' => $this->getData('self.widget.settings.label_data'),
                        'data' => $this->getData('self.widget.settings.values_selector'),
                        'color' => $this->getData('self.widget.settings.color_data'),
                    ],
                ],
                'labels' => $this->getLabels(),
            ],

            'keysToParser' => [
                'data.labels',
                'data.datasets.0.data',
            ],

            'widget_settings' => $admin ? $this->widget->toArray() : null,
            'paths' =>  $admin ? $this->getPaths() : [],
            'self' => $this->getData('self'),
        ];
    }

    protected function fillData()
    {
        //widget data
        $this->setData('self.widget', $this->widget->toArray());

        //query data
        if($this->widget->settings['mode'] === 'sql_raw'){

            $sql = $this->strWithTokens($this->widget->settings['sql'], 'NULL');

            $query = \DB::select($sql);

            $query = collect($query[0])->mapWithKeys(function($item, $key) use ($query) {
                return [$key => collect($query)->pluck($key)->toArray()];
            });

            $this->setData('self.query.data', $query);
        }
    }

    private function getLabels(): array|string
    {
        //sql_raq TODO: add support for builder query
        return $this->getData('self.widget.settings.labels_selector', '');
    }
}
