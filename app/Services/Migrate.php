<?php

namespace App\Services;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\ColumnDefinition;
use Illuminate\Support\Collection;
use App\Models\Collection as CollectionModel;
use Schema;

class Migrate
{

    private string $tableName;
    private Collection $columns;
    private Blueprint $table;
    private bool $withoutForeign;
    private bool $createTable;

    public function __construct(string $tableName, Collection $columns, bool $withoutForeign = false, bool $createTable = true)
    {
        $this->tableName = $tableName;
        $this->columns = $columns;
        $this->withoutForeign = $withoutForeign;
        $this->createTable = $createTable;

        return $this;
    }

    public static function make(string $tableName, Collection $columns, bool $withoutForeign = false, bool $createTable = true): self
    {
        return new static($tableName, $columns, $withoutForeign);
    }

    public static function makeForeign(string $tableName, Collection $columns): self
    {
        return new static($tableName, $columns, false, false);
    }

    public function up(): bool
    {
        $success = true;

        try {
            if($this->createTable) {
                Schema::create($this->tableName, function (Blueprint $table) {

                    $this->table = $table;

                    $table->id();

                    $this->columns->each(function ($column) use ($table) {
                        $this->addColumn($column);
                    });

                    $table->foreignId('user_created_id')
                        ->constrained('users');

                    $table->foreignId('user_last_modified_id')
                        ->nullable()
                        ->constrained('users');

                    $table->timestamps();
                });
            } else {
                Schema::table($this->tableName, function (Blueprint $table) {
                    $this->table = $table;
                    $this->columns->each(function ($column) use ($table) {
                        if($column['type'] === 'relation') {
                            $this->addColumn($column);
                        }
                    });
                });
            }
        }
        catch (\Throwable $e) {
            $success = false;
        }

        return $success;
    }

    public function down()
    {
        Schema::dropIfExists($this->tableName);
    }

    /**
     * @throws \Exception
     */
    public function addColumn($column)
    {
        $column = (object) $column;

        $type = $column->type;

        if(!method_exists($this, $type)) {
            throw new \Exception('Method ' . $type . ' does not exist in Migration class');
        }

        $columnBuilder = $this->$type($column);

        if($column->unique) {
            $columnBuilder->unique();
        }

        if($this->createTable && !$column->required){
            $columnBuilder->nullable();
        }

    }

    public function text($column)
    {
        return $this->table->string($column->name);
    }

    public function email($column)
    {
        return $this->table->string($column->name);
    }

    public function password($column)
    {
        return $this->table->string($column->name);
    }

    public function url($column)
    {
        return $this->table->string($column->name);
    }

    public function tel($column)
    {
        return $this->table->string($column->name);
    }

    public function textarea($column)
    {
        return $this->table->text($column->name);
    }

    public function number($column)
    {
        return $this->table->decimal($column->name);
    }

    public function percent($column)
    {
        return $this->table->decimal($column->name);
    }

    public function currency($column)
    {
        return $this->table->decimal($column->name);
    }

    public function date($column)
    {
        return $this->table->timestamp($column->name);
    }

    public function datetime($column)
    {
        return $this->table->timestamp($column->name);
    }

    public function boolean($column)
    {
        return $this->table->boolean($column->name);
    }

    public function select($column)
    {
        return $this->table->string($column->name);
    }

    public function selectMultiple($column)
    {
        return $this->table->json($column->name);
    }

    public function relation($column): ?ColumnDefinition
    {
        $collectionRel = CollectionModel::find($column->relationTable);

        if(!$collectionRel) {
            return null;
        }

        $type = collect($collectionRel->columns)->first(function ($column) {
                return $column['name'] === ($column->relationColumn ?? null);
            })->type ?? null;

        if(!$this->withoutForeign && $this->notExistsForeign($column)) {
            $this->table->foreign($column->name)
                ->references($type ? $column->relationColumn : 'id')
                ->on($collectionRel->table_name ?? $collectionRel->slug)
                ->onDelete($column->relationOnDelete ?? 'cascade')
                ->onUpdate($column->relationOnUpdate ?? 'cascade');
        }

        if(!$this->createTable){
            return null;
        }

        return $type
            ? $this->$type($column->name)
            : $this->table->unsignedBigInteger($column->name);
    }

    public function notExistsForeign($column): bool
    {
        $foreignKeys = \DB::connection()->getDoctrineSchemaManager()->listTableForeignKeys($this->tableName);

        $foreignKeysNames = collect($foreignKeys)->map(function ($foreignKey) {
            return $foreignKey->getName();
        });

        $foreignKeyName = $this->tableName . '_' . $column->name . '_foreign';

        return !collect($foreignKeysNames)->contains($foreignKeyName);

//        return !collect($foreignKeys)->contains(function ($foreign) use ($column) {
//            return $foreign->getLocalColumns()[0] === $column->name;
//        });
    }
}
