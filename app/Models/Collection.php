<?php

namespace App\Models;

use App\Services\Column;
use App\Services\Migrate;
use App\Services\ModelCreate;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Query\Builder;
use \Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Schema;
use Str;

class Collection extends Model
{
    use SoftDeletes;

    protected $table = '_collections_';

    static array $hasTable = [];

    protected $appends = [
        'has_table',
        'has_model',
        'table_name',
    ];

    protected $fillable = [
        'name',
        'description',
        'slug',
        'settings',
        'columns',
        'custom_attributes',
        'permissions',
        'workflows',
        'table_name',
        'model_name',
    ];

    protected $casts = [
        'settings' => 'json',
        'custom_attributes' => 'array',
        'columns' => 'collection',
        'permissions' => 'json',
        'workflows' => 'array',
    ];

    /** RELATIONSHIP`S **/

    public function lists(): HasMany
    {
        return $this->hasMany(ListCollection::class);
    }

    public function records(): EloquentBuilder|Builder
    {
        if($this->has_model) {
            return app($this->modelPath())::query();
        }
        return \DB::table($this->table_name);
    }

    /**
     * @param ...$args
     * @return Model
     * @throws \Exception If model not found
     */
    public function model(...$args): Model
    {
        if(!$this->has_model) {
            throw new \Exception('Collection has no model');
        }

        $model = app($this->modelPath());

        return empty($args) ? $model : $model->newInstance(...$args);
    }

    /** END RELATIONSHIP`S **/


    /** ACCESSOR'S **/

    function getHasTableAttribute()
    {
        if(empty( self::$hasTable[$this->name] )) {
            self::$hasTable[$this->name] = Schema::hasTable($this->table_name);
        }

        return self::$hasTable[$this->name];
    }

    function getHasModelAttribute()
    {
        return class_exists('App\Models\Tenant\Tenant' . tenant()->id . '\\' . $this->model_name);
    }

    function getTableNameAttribute()
    {
        return $this->attributes['table_name'] ?? $this->attributes['slug'] ?? null;
    }

    function getModelNameAttribute()
    {
        return Str::of($this->attributes['model_name']
            ?? ( preg_replace('/[^a-zA-Z]+/','', $this->settings['singular_label'] ?? '')
                    ? preg_replace('/[^a-zA-Z]+/','', $this->settings['singular_label'] ?? '')
                    : null )
            ?? Str::of($this->attributes['slug'] ?? '')->singular()->ucfirst()->value()
        )->studly()->value() ?? null;
    }

    public function modelPath(): string
    {
        return 'App\Models\Tenant\Tenant' . tenant()->id . '\\' . $this->model_name;
    }

    public function modelNamespace(): string
    {
        return 'App\Models\Tenant\Tenant' . tenant()->id . '\\';
    }

    public function columnsClasses() : Attribute
    {
        return new Attribute(
            get: fn($value) => collect(json_decode($value, true))->map(fn($column) => new Column($this, $column)),
        );
    }

    /** END ACCESSOR'S **/


    /** MIGRATE METHODS */

    public function migrate($force = false, $withoutForeign = false)
    {
        $hasTable = $this->has_table;

        if($force && $hasTable) {
            $this->drop();
        } elseif(!$force && $hasTable) {

            return false;
        }

        Migrate::make($this->table_name ?? $this->slug, $this->columns, $withoutForeign)->up();
    }

    public function drop()
    {
        Schema::dropIfExists($this->table_name);
    }

    public function migrateForeign()
    {
        Migrate::makeForeign($this->table_name, $this->columns)->up();
    }

    public function createModel()
    {
        ModelCreate::make(tenant(), $this)->create();
    }

    /** END MIGRATE METHODS */
}