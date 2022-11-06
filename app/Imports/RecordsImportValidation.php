<?php

namespace App\Imports;

use App\Models\Collection;
use App\Services\Column;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithMappedCells;

class RecordsImportValidation implements ToCollection, WithMappedCells
{
    use Importable;

    private string $collection;
    private array $mapping;
    private array $options;
    private array $errors = [];
    private \Illuminate\Validation\Validator|\Illuminate\Contracts\Validation\Validator $validator;

    public function __construct(Collection $collection, $mapping = [], $options = [])
    {
        $this->collection = $collection;
        $this->mapping = $mapping;
        $this->options = $options;
    }

    public function getFields(array $row): array
    {
        return collect($this->collection->columnsClasses)->mapWithKeys(function (Column $column) use ($row) {
            return [$column->name => $row[$column->name] ?? $column->getDefault() ?? null];
        })->toArray();
    }

    /**
     * @inheritDoc
     * @throws \Exception If model not found
     */
    public function model(array $row): Model|array|null
    {
        return $this->collection->model($this->getFields($row));
    }

    public function mapping(): array
    {
        return $this->mapping;
    }

    public function rules(): array
    {
        return $this->collection->columnsClasses->mapWithKeys(function (Column $column) {
            $columnKey = '*.' . $column->name;
            $rules = $column->validateRules();
            return [$columnKey => $rules];
        })->toArray();
    }

    /**
     * @throws \Exception
     */
    public function collection(\Illuminate\Support\Collection $collection)
    {
        //validate collection
        $this->validate($collection);

        foreach ($collection as $row) {
            $this->model($row);
        }
    }

    public function validate($collection)
    {
        $this->validator = Validator::make(
            $collection->toArray(),
            $this->rules(),
            $this->messages(),
        );

        if($this->validator->fails()) {
            $this->validator->errors()->
            $this->errors = $this->validator->errors()->toArray();
        }
    }

    private function messages(): array
    {
        return [];
    }

}
