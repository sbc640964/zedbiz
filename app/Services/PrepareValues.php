<?php

namespace App\Services;

use Carbon\Carbon;

class PrepareValues
{
    public static function prepareResults($results, $list): array
    {
        $formats = $results->map(function ($record) use ($list) {
            return collect($record)->mapWithKeys(function ($value, $key) use ($list) {
                $column = collect($list->settings['columns'])->firstWhere('name', $key);
                return [$key => self::prepareValue($value, $column['type'] ?? 'text', $column)];
            });
        });

        $results = $results->toArray();
        $results['formats'] = $formats;

        return $results;
    }

    public static function prepareValue($value, $type, $options = null)
    {
        $format = null;

        if($type === 'number'){
            $format = self::prepareNumber($value, $options);
        }

        if($type === 'datetime'){
            $format =  self::prepareDateTime($value, $options);
        }

        if($type === 'currency'){
            $format =  self::prepareCurrency($value, $options);
        }

        return $format ?? $value;
    }

    static public function prepareNumber($value, mixed $options): string
    {
        return number_format(
            $value,
                $options['decimal_places'] ?? 2,
            '.',
            ($options['thousands_separator'] ?? true) ? ',' : ''
        );
    }

    static public function prepareDateTime($value, mixed $options)
    {
        if($format  = $options['format_date'] ?? "d/m/Y"){
            $value = Carbon::parse($value)->format($format);
        }

        return $value;
    }

    static public function prepareCurrency($value, mixed $options): string
    {
        return money($value ?? 0, $options['currency'] ?? 'USD')->format();
    }

}
