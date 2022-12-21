<?php

namespace App\Services\Widgets;

use App\Services\SqlParser\Parser;

class ChartWidget extends WidgetBase
{
    public function getResponse(bool $admin): array
    {
        return [
            'type' => 'chart',
            'label' => $this->getData('self.widget.name'),
            'description' => $this->getData('self.widget.description'),
            'bg_color' => $this->getData('self.widget.settings.bg_color'),

            'data' => [
                'datasets' => $this->getDatasets(),
                'labels' => $this->getLabels(),
            ],

            'keysToParser' => [
                'data.labels',
                ...collect($this->getData('self.widget.settings.datasets', []))
                    ->values()
                    ->map(fn($item, $index) => "data.datasets.$index.data")
                    ->toArray(),
            ],

            'widget_settings' => $admin ? $this->widget->toArray() : null,
            'paths' =>  $admin ? $this->getPaths() : [],
            'self' => $this->getData('self'),

            //
            'className' => 'w-full md:w-1/2 lg:w-3/4 p-3 h-96',
        ];
    }

    protected function getDatasets(): array
    {
        $datasets = [];

        foreach ($this->widget->settings['datasets'] as $dataset){
            $datasets[] = [
                'label' => $dataset['label'],
                //TODO: add support for builder query
                'data' => $this->widget->settings['mode'] === 'sql_raw' ? $dataset['selector'] : [],
//                'backgroundColor' => $dataset['background_color'] ?? null,
//                'borderColor' => $dataset['border_color'] ?? null,
//                'borderWidth' => $dataset['border_width'] ?? null,
//                'fill' => $dataset['fill'] ?? null,
                'color' => $dataset['color'] ?? null,
            ];
        }

        return $datasets;
    }

    protected function fillData()
    {
        //widget data
        $this->setData('self.widget', $this->widget->toArray());

        //query data
        if($this->widget->settings['mode'] === 'sql_raw'){
            $query = \DB::select($this->widget->settings['sql'] ?? false);

            $query = collect($query[0])->mapWithKeys(function($item, $key) use ($query) {
                return [$key => collect($query)->pluck($key)->toArray()];
            });

            $this->setData('self.query.data', $query);
        }
    }

    protected function getCompare(): array
    {
        return [
            'value' => $this->getData('self.widget.settings.compare_selector'),
            'format' => $this->getData('self.widget.settings.compare_value.format', 'number'),
            'prefix' => $this->getData('self.widget.settings.compare_value.before_text', ''),
            'suffix' => $this->getData('self.widget.settings.compare_value.after_text', ''),
            'currency_code' => $this->getData('self.widget.settings.compare_value.currency_code', 'USD'),
            'currency_position' => $this->getData('self.widget.settings.compare_value.currency_position', 'before'),
            'decimal_places' => $this->getData('self.widget.settings.compare_value.decimal_places', 0),
            'thousand_separator' => $this->getData('self.widget.settings.compare_value.thousand_separator', true),
            'trend_mode_enable' => $this->getData('self.widget.settings.compare_value.trend_mode_enable', true),
            'trend_color_negative' => $this->getData('self.widget.settings.compare_value.trend_color_negative', 'danger'),
            'trend_color_positive' => $this->getData('self.widget.settings.compare_value.trend_color_positive', 'success'),
        ];
    }

    protected function getValue(): array
    {
        return [
            'value' => $this->getData('self.widget.settings.value_selector'),
            'format' => $this->getData('self.widget.settings.primary_value.format', 'number'),
            'prefix' => $this->getData('self.widget.settings.primary_value.before_text', ''),
            'suffix' => $this->getData('self.widget.settings.primary_value.after_text', ''),
            'currency_code' => $this->getData('self.widget.settings.primary_value.currency_code', 'USD'),
            'currency_position' => $this->getData('self.widget.settings.primary_value.currency_position', 'before'),
            'decimal_places' => $this->getData('self.widget.settings.primary_value.decimal_places', 0),
            'thousand_separator' => $this->getData('self.widget.settings.primary_value.thousand_separator', true),
        ];
    }
    protected function getIcon(): array
    {
        return [
            'name' => $this->getData('self.widget.settings.icon', 'trending-up'),
            'color' => $this->getData('self.widget.settings.icon_color', 'white'),
        ];
    }

    private function getLabels(): array|string
    {
        //sql_raq TODO: add support for builder query
        return $this->getData('self.widget.settings.labels_selector', '');
    }
}
