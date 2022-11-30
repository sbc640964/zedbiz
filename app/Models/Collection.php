<?php

namespace App\Models;

use App\Services\Column;
use App\Services\Migrate;
use App\Services\ModelCreate;
use Illuminate\Database\Eloquent\Casts\Attribute;
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
        'class_name',
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
            return $this->model()::query();
        }
        return \DB::table($this->table_name);
    }

    public function pages(): HasMany
    {
        return $this->hasMany(Page::class);
    }

    /**
     * @param ...$args
     * @return Model
     * @throws \Exception If model not found
     */
    public function model(...$args)
    {
        if(!$this->has_model) {
            throw new \Exception('Collection has no model');
        }

        $model = app($this->modelNamespace() . $this->model_name);

        return empty($args) ? $model : $model->newInstance(...$args);
    }

    public function forms(): HasMany
    {
        return $this->hasMany(Form::class);
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
        return join(DIRECTORY_SEPARATOR, [
            app_path('Models'),
            'Tenant',
            'Tenant' . tenant()->id,
            $this->model_name . '.php'
        ]);
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

    public function migrate($force = false, $withoutForeign = false) : bool
    {
        $hasTable = $this->has_table;

        if($force && $hasTable) {
            $this->drop();
        } elseif(!$force && $hasTable) {
            return false;
        }

        $migrate = Migrate::make($this->table_name ?? $this->slug, $this->columns, $withoutForeign)->up();

        if($migrate) {
            $this->update(['table_name' => $this->table_name]);
        }

        return $migrate;
    }

    public function drop()
    {
        Schema::dropIfExists($this->table_name);

        $this->dropModel();

        $this->update([
            'table_name' => null,
            'model_name' => null,
        ]);
    }

    public function migrateForeign()
    {
        Migrate::makeForeign($this->table_name, $this->columns)->up();
    }

    public function createModel()
    {
        ModelCreate::make(tenant(), $this)->create();

        $this->update(['model_name' => $this->model_name]);
    }

    public function dropModel()
    {
        //remove model file
        $modelPath = join(DIRECTORY_SEPARATOR, [app_path(), 'Models', 'Tenant', 'Tenant' . tenant()->id, $this->model_name . '.php']);
        if(file_exists($modelPath)) {
            unlink($modelPath);
        }
    }

    /** END MIGRATE METHODS */

    /** METHODS */

    /**
     * return fake ListCollection from collection columns
     * @return ListCollection
     */

    public function getDefaultList(): ListCollection
    {
        if(!empty($this->settings['default_list'])
            && $this->settings['default_list']
            && $list = ListCollection::find($this->settings['default_list'])
        ) {
            return $list;
        }

        $list = new ListCollection();
        $list->collection_id = $this->id;
        $list->setRelation('collection', $this);
        $list->type = 'table';
        $list->query_mode = 'sql_raw';
        $list->settings = [
            'actions' => [],
            'columns' => $this->columns
                ->map(function ($column) {
                    $column = (object) $column;
                    return [
                        'id' => uuid_create(),
                        'name' => $column->name,
                        'show' => true,
                        'sortable' => true,
                        'searchable' => true,
                        'label' => $column->label,
                        'type' => $column->type,
                    ];
                })->prepend([
                    'id' => uuid_create(),
                    'name' => 'id',
                    'show' => true,
                    'type' => 'text',
                    'label' => 'ID',
                ])->toArray(),
            'raw_query' => $this->getRawQueryDefaultList(),
            'enable_add_new' => true,
            'query_group_by_id' => true,
            'enable_import' => true,
            'extra_sections' => $this->getExtraSectionsForm(),
        ];

        $list->name = $this->name;

        return $list;
    }

    private function getExtraSectionsForm() : ?\Illuminate\Database\Eloquent\Collection
    {
        if(empty($this->settings['menu']['new_form_sections'])) {
            return null;
        }

        return Collection::findMany(collect($this->settings['menu']['new_form_sections'])->pluck('collection')->flatten()->toArray());
    }

    private function getRawQueryDefaultList(): string
    {
        $relations = $this->columns->where('type', 'relation')->map(fn ($column) => (object) $column);

        $sql = 'SELECT '. $this->columns
                ->where('type', '!=', 'relation')
                ->pluck('name')
                ->prepend('id')
                ->map(fn($column) => "$this->table_name.$column")
                ->join(',');

        $relations->map(function ($relation) use (&$sql) {
            $sql .= ', ' . '__relation_' . $relation->name . '.' . ($relation->relationSelectorLabel ?? 'id') . ' as ' . $relation->name;
        });

        $sql .= ' FROM ' . $this->table_name;


        if($relations->count()) {
            $collectionsRelations = Collection::whereIn('id', $relations->pluck('relationTable'))->get();

            $relations->map(function ($relation) use (&$sql, $collectionsRelations) {
                $collection = $collectionsRelations->where('id', $relation->relationTable)->first();
                $collection && $sql .= ' LEFT JOIN ' . $collection->table_name . ' as __relation_' . $relation->name . ' ON __relation_' . $relation->name . '.id = ' . $this->table_name . '.' . $relation->name;
            });
        }

        return $sql;
    }

    /** END METHODS */
}
