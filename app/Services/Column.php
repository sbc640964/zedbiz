<?php

namespace App\Services;

use App\Models\Collection;
use ArrayAccess;
use Str;

class Column implements ArrayAccess
{
    private $collection;
    private $column;

    public function __construct(Collection $collection, array $column)
    {
        $this->collection = $collection;
        $this->column = collect($column);
    }

    // get default column value
    public function getDefault()
    {
        $default = $this->column->get('default');

        if($this->getType() === 'date') {
            // if default value is 'now' then return current date
        }

        return $default;
    }

    public function getType()
    {
        return $this->column->get('type');
    }

    public function __invoke(): \Illuminate\Support\Collection
    {
        return $this->column;
    }

    public function __get(string $name)
    {
        return data_get($this->column, $name);
    }

    public function __call(string $name, array $arguments)
    {
        $name = Str::of($name);
        if ($name->startsWith('get')) {
            $name = $name->replaceFirst('get', '')->camel();
            return $this->column->get($name, $arguments[0] ?? null) === true;
        }
    }

    public function validateRules(): array
    {
        $type = $this->getType();

        $rulesItem = [$this->required ? 'required' : 'nullable'];

        $rulesItem[]  = match ($type) {
            'string','text','email','url','password','textarea','select','radio','checkbox','tel' => 'string|max:255',
            'number', 'currency', 'percent' => 'numeric',
            default => 'string',
        };

        if (in_array($type, ['select', 'checkbox'])) {
            $rulesItem[] = 'in:' . implode(',', collect($this->getOptions([]))->pluck('value')->toArray());
        }

        $rulesItem[] = match ($type) {
            'date' => 'date',
            'datetime' => 'date_format:Y-m-d H:i:s',
            'time' => 'date_format:H:i:s',
            'email' => 'email',
            'url' => 'url',
            'image' => 'image',
            'file' => 'file',
            'boolean' => 'boolean',
            default => '',
        };

        if ($type === 'relation') {
            $tableName = Collection::findOrFail($this->relationTable)->table_name;
            $rulesItem[] = 'exists:' . $tableName . ',' . ($this->relationColumn ?? 'id');
        }

        if ($this->unique && ($this->options['skipDuplicatesErrors'] ?? null) === false) {
            $rulesItem[] = 'unique:' . $this->collection->table_name . ',' . $this->name;
            $rulesItem[] = 'distinct';
        }

        return $rulesItem;
    }

    public function offsetExists($key): bool
    {
        return isset($this->column->{$key});
    }

    public function offsetGet($key)
    {
        return $this->column->{$key};
    }

    public function offsetSet(mixed $offset, mixed $value)
    {
        $this->column->{$offset} = $value;
    }

    public function offsetUnset(mixed $offset)
    {
        unset($this->column->{$offset});
    }
}
