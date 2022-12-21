<?php

namespace App\Services;

use App\Models\Option;

class ConfigApp
{
    static array $config = [];

    public static function get(string $key = null, $default = null)
    {
        if (empty(self::$config)) {
            self::init();
        }

        if (is_null($key)) {
            return self::$config;
        }

        return self::$config[$key] ?? $default;
    }

    public static function init()
    {
        self::$config = Option::all()->pluck('value', 'key')->toArray();
    }

    public static function set(string $key, $value)
    {
        self::$config[$key] = $value;
    }

}
