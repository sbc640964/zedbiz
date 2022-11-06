<?php

namespace App\Services;

use App\Models\Collection;
use App\Models\Tenant;
use Str;

class ModelCreate
{
    private string $modelName;
    private string $tableName;
    private \Illuminate\Support\Collection $columns;
    private Collection $collection;
    private Tenant $app;

    public function __construct(Tenant $app, Collection $collection){
        $this->collection = $collection;
        $this->tableName = $collection->table_name;
        $this->modelName = $this->collection->model_name;
        $this->columns = $this->collection->columns;
        $this->app = $app;
    }

    public static function make(Tenant $app, Collection $collection): self
    {
        return new static($app, $collection);
    }

    public function create(): void
    {
        $pathModels = app_path('Models\Tenant').'\\Tenant'.$this->app->id.'\\';

        if ( !is_dir($pathModels) ) {
            mkdir($pathModels);
        }

        $contentModelFile = $this->getContentModelFile();

        $fileName = $pathModels. $this->modelName .'.php';

        file_put_contents($fileName, $contentModelFile);

        exec(' ./vendor/bin/pint ' . $fileName);
    }

    private function getContentModelFile(): string
    {
        $contentModelFile = file_get_contents(app_path('Models/Tenant/BaseModelTenant.php'));

        $contentModelFile = Str::of($contentModelFile)
            ->replace(':tenant_id', $this->app->id)
            ->replace(':class_name', $this->modelName)
            ->replace(':table_name', $this->tableName)
            ->replace(':casts', $this->getCasts())
            ->replace(':attributes', $this->getAttributes())
            ->replace(':relations', $this->getRelations())
            ->replace(':appends', $this->getAppends());

        return $contentModelFile->value();
    }

    private function getCasts(): string
    {
        $columns = '';

        foreach ($this->columns as $column) {
            $type = $this->getCastColumn($column['type']);
            if($type) {
                $columns .= "'{$column['name']}' => '$type',";
            }
        }

        return $columns;
    }

    private function getCastColumn(string $type): ?string
    {
        return match ($type) {
            'date', 'datetime' => 'datetime',
            'boolean' => 'boolean',
            default => null,
        };
    }

    private function getAttributes(): string
    {
        //TODO: get attributes
        return '';
    }

    private function getRelations(): string
    {
        //TODO: get relations
        return '';
    }

    private function getAppends(): string
    {
        return '';
    }

}
