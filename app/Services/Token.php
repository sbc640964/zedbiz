<?php

namespace App\Services;

use Illuminate\Support\Str;

class Token
{
    static public function getTokens(string $defaultValue, ?array $data = []): string
    {
        $defaultValue = Str::of($defaultValue);
        $tokens = $defaultValue->matchAll('/\{\{([^\}]+)\}\}/');

        foreach ($tokens as $token) {
            $defaultValue = $defaultValue->replace('{{'.$token.'}}', static::getTokenValue($token, $data));
        }

        return $defaultValue->value();
    }

    static public function getTokenValue(string $token, ?array $data = [])
    {
        $token = Str::of($token);

        $key =$token->before(':')->trim();

        if($key->startsWith('NOW')) {
            return now()->format('Y-m-d\TH:i:s');
        }

        return data_get($data, $key, '{{'.$token.'}}');
    }
}
