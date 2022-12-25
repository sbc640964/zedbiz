<?php

namespace App\Services\Widgets;

use App\Services\SqlParser\Parser;

class NumberWidget extends WidgetBase
{
    public function getResponse(bool $admin): array
    {
        return [
            'type' => 'number',
            'label' => $this->getData('self.widget.name'),
            'description' => $this->getData('self.widget.description'),
            'bg_color' => $this->getData('self.widget.settings.bg_color'),

            'value' => $this->getValue(),
            'comparison' => $this->getCompare(),
            'icon' => $this->getIcon(),

            'keysToParser' => [
                'value.value',
                'comparison.value',
            ],

            'widget_settings' => $admin ? $this->widget->toArray() : null,
            'paths' =>  $admin ? $this->getPaths() : [],
            'iconInSIde' => true,
            'className' => 'w-full md:w-1/2 lg:w-1/3 p-3',

            'self' => $this->getData('self'),
        ];
    }

    protected function fillData()
    {
        //widget data
        $this->setData('self.widget', $this->widget->toArray());

        //query data
        if($this->widget->settings['mode'] === 'sql_raw' && ($this->widget->settings['sql'] ?? false)){

            $sql = $this->widget->settings['sql'];

            $sql = $this->strWithTokens($sql, 'NULL');

            $query = Parser::make($sql)
                ->getQuery();

            $this->setData('self.query.data', $query->get()[0]);
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
}
