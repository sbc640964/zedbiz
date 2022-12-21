<?php

namespace App\Services;

use Illuminate\Support\Str;

class Token
{
    static public function getTokens(string $defaultValue, ?array $data = [], ?array $options = []): string
    {
        $data = array_merge(self::getTokensData($options), $data);
        $defaultValue = Str::of($defaultValue);
        $tokens = $defaultValue->matchAll('/\{\{([^\}]+)\}\}/');

        foreach ($tokens as $token) {
            $defaultValue = $defaultValue->replace('{{'.$token.'}}', static::getTokenValue($token, $data, $options));
        }

        return $defaultValue->value();
    }

    static private function getTokenValue(string $token, array $data, array $options)
    {
        $token = Str::of($token);

        $key = $token->before(':')->trim();

        return data_get($data, $key, $options['onFallback'][$key->before('.')->value()] ?? '{{'.$token.'}}');
    }

    private static function getTokensData($options) : array
    {
        $data = [
            'NOW' => now()->format($options['format_date'] ?? 'd/m/Y H:i:s'),
        ];

        return $data;
    }
}
