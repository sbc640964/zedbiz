<?php

namespace App\Imports;

use App\Models\Collection;
use App\Services\Column;
use Illuminate\Database\Eloquent\Model;
use Maatwebsite\Excel\ChunkReader;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithMappedCells;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Excel;

class RecordsImport extends ChunkReader implements ToCollection, WithValidation, WithMappedCells, WithBatchInserts
{
    use Importable;

    private Collection $collectionModel;
    private array $mapping;
    private array $options;

    public function __construct(Collection $collectionModel, $mapping = [], $options = [])
    {
        $this->collectionModel = $collectionModel;
        $this->mapping = $mapping;
        $this->options = $options;
    }

    public function getFields(array $row): array
    {
        return collect($this->collectionModel->columnsClasses)->mapWithKeys(function (Column $column) use ($row) {
            return [$column->name => $row[$column->name] ?? $column->getDefault() ?? null];
        })->toArray();
    }

    /**
     * @inheritDoc
     * @throws \Exception If model not found
     */
    public function model(array $row): Model|array|null
    {
        var_dump($this->collectionModel);
        return $this->collectionModel->model($this->getFields($row));
    }

    public function mapping(): array
    {
        return $this->mapping;
    }

    public function rules(): array
    {
        return $this->collectionModel->columnsClasses->mapWithKeys(function (Column $column) {

            $columnKey = $column->name;
            $rules = $column->validateRules();

            return [$columnKey => $rules];
        })->toArray();
    }

    public function batchSize(): int
    {
        return 10;
    }

    public function collection(\Illuminate\Support\Collection $collection)
    {
        //$collection->map()
    }
}
