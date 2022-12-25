<?php

namespace App\Services\Widgets;

use App\Models\Widget;
use function Symfony\Component\Translation\t;

abstract class WidgetBase
{
    protected $data = [];

    public function __construct(
        protected Widget $widget
    ){}

    public function setData($keys, $value): static
    {
        if(is_array($keys)){
            $keys = implode('.', $keys);
        }

        data_set($this->data, $keys, $value);

        return $this;
    }

    public function getData($keys = null, $default = null)
    {
        if(is_array($keys)){
            $keys = implode('.', $keys);
        }

        return data_get($this->data, $keys, $default);
    }

    public function getPaths(): array
    {
        $paths = [];
        $paths['update'] = route('admin.apps.edit.widgets.update', [tenant(), $this->widget]);
        $paths['delete'] = route('admin.apps.edit.widgets.delete', [tenant(), $this->widget]);
        $paths['duplicate'] = route('admin.apps.edit.widgets.duplicate', [tenant(), $this->widget]);
        return $paths;
    }

    abstract public function getResponse(bool $admin): array;

    protected function getBaseResponse(bool $admin): array
    {
        return [
            'id' => $this->widget->id,
            'name' => $this->widget->name,
            'description' => $this->widget->description,
            'admin' => $admin,
            'width' => $this->widget->settings['width'] ?? '1/1',
        ];
    }

    public function render(bool $admin): array
    {
        $this->fillData();

        return array_merge(
            $this->getBaseResponse($admin),
            $this->getResponse($admin)
        );
    }

    protected function strWithTokens(string $str, $default = null): string
    {
        // token start whit {{ and end with }}
        return preg_replace_callback('/\{\{(.*?)}}/', function($matches) use ($default) {
            $token = $this->getToken($matches[1], $default);
            if($token !== $default){
                $token = '"' . $token . '"';
            }
            return $token;
        }, $str);
    }

    protected function getToken(string $token, $default = null): ?string
    {
        $tokens = $this->getDefinedTokens();
        $tokens['self'] = $this->data;

        $token = \Str::replace('?', '', $token);

        return data_get($tokens, $token, $default);
    }

    protected function getDefinedTokens(): array
    {
        return [
            'tenant' => tenant(),
            'user' => auth()->user(),
            'page' => array_merge(
                $this->getPageStore(),
                request()->all(),
                request()->route()->parameters()
            ),
        ];
    }

    protected function getPageStore(): array
    {
        return $this->widget->page->getDefaultStoreTokens();
    }
}
