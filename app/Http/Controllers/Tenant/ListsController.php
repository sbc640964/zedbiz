<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\ListCollection;
use App\Models\Model;
use App\Models\Option;
use App\Services\PrepareValues;
use App\Services\SqlParser\Parser;
use Illuminate\Database\Query\Builder;
use stdClass;
use Str;

class ListsController extends Controller
{
    public function index()
    {

    }

    public function getList(
        ListCollection|int $list,
        ?int $perPage = null,
        ?int $recordId = null,
        $returnQuery = false,
        $withoutSearch = false,
        $baseUrl = null,
        ?array $options = []
    ) {

        $perPage = $perPage ?? Option::getOption('per_page-' . request()->path()) ?? 10;

        if(is_numeric($list)) {
            $list = ListCollection::findOrFail($list);
        }

        $query = match ($list->query_mode) {
            'sql_raw' => $this->getListRaw($list, ['withoutSearch' => $withoutSearch]),
            default => $this->getListBuilder($list),
        };

        if($returnQuery){
            return $query;
        }

        $results = $this->responseQuery($list, $query, $perPage, $recordId, [
            'withoutSearch' => $withoutSearch,
            'baseUrl' => $baseUrl,
            'customParams' => $options['customParams'] ?? null,
            'whereRaw' => $options['whereRaw'] ?? null,
        ]);

        if(!($options['noFormat'] ?? false)){
            $isOneRecord = is_subclass_of($results, Model::class) || $results instanceof stdClass || is_array($results);
            if($isOneRecord && is_array($results)){
                $results = (object) $results;
            }
            $results = PrepareValues::prepareResults($isOneRecord ? collect($results) : $results, $list);
            if($isOneRecord){
                $results['formats'] = $results['formats']->first();
            }
        }

        return $results;
    }

    public function getListRaw(ListCollection|int $list, ?array $option = [])
    {
        if(is_numeric($list)) {
            $list = ListCollection::findOrFail($list);
        }

        $query = Parser::make($list->settings['raw_query']);

        $query = $query->getQuery();

        if(empty($option['withoutSearch']) && request()->has('search') && Str::length($search = request('search')) > 0) {
            $searchableColumns = collect($list->settings['columns'])
                ->where('searchable', true);
            if($searchableColumns->count() > 0) {
                $words = explode(' ', $search);
                foreach ($words as $word) {
                    $query->having(function ($query) use ($searchableColumns, $list, $word, &$isFirst, $search) {
                        $isFirst = true;
                        $searchableColumns
                            ->each(function($column) use ($word, $search, &$isFirst, $query) {
                                $method = $isFirst ? 'having' : 'orHaving';
                                $query->$method($column['name'], 'like', "%$word%");
                                $isFirst = false;
                            });
                    });
                }
            }
        }

        return $query;
    }

    public function getListBuilder(ListCollection|int $list)
    {
        if(is_numeric($list)) {
            $list = ListCollection::findOrFail($list);
        }

        $table = $list->collection->table_name ?? $list->collection->slug;

        $query = \DB::table($table);

        if($list->settings['query_joins'] ?? false){
            foreach($list->settings['query_joins'] as $join){
                $query->join(
                    $join['table'],
                    $join['table'] . '.' . $join['on_join'],
                    '=',
                    (Str::contains($join['on_query'], '.') ? '' : $table . '.' ).$join['on_query'],
                    $join['type']
                );
            }
        }

        if($list->settings['query_group_by_id'] ?? false){
            $query->groupBy($table . '.id');
        }


        if(empty($list->settings['query_selects'])){
            $query->select('*');
        } else {
            foreach ($list->settings['query_selects'] as $select) {
                ($select['type'] ?? null) === 'raw'
                    ? $query->selectRaw($select['value'])
                    : $query->addSelect($select['column']['value'] . (!empty($select['alias']) ? ' as ' . $select['alias'] : ''));
            }

            if(!collect($list->settings['query_selects'])->pluck('column.value')->contains($table . '.id')){
                $query->addSelect($table . '.id');
            }
        }

        $query->orderBy(
            $list->settings['query_default_order'] ?? 'id',
                $list->settings['query_default_order_direction'] ?? 'asc'
        );

        return $query;
    }

    public function responseQuery(ListCollection $list, Builder $query, $perPage, $recordId, ?array $options = [])
    {
        $table = Str::of($query->from)->when(Str::contains($query->from, ' as '), function($q){
            return $q->explode(' as ')[1];
        })->value();

        try {
            if(!empty($recordId)){
                return $query->where( $table . '.id', $recordId)->first();
            }

            if(!empty($options['whereRaw'])){
                $query->whereRaw($options['whereRaw']);
            }

            $query = $query
                ->when(request('sortColumn'), function(Builder $q) use ($table){
                    return $q->reorder(request('sortColumn'), request('sortDirection'));
                })
                ->paginate(request('per_page') ?? $perPage ?? 10)
                ->withQueryString();

            if(!empty($options['customParams'])){
                $query->appends($options['customParams']);
            }

            return $query->onEachSide(1);

        }catch (\Throwable $e) {
            session()->flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage()
            ]);
            return [
                'data' => [],
                'links' => [],
            ];
        }
    }

    public function selectAll(ListCollection $list)
    {
        $query = $this->getList($list);

        $query->select($list->settings['query_selects'][0]['column']['value'] . ' as id', $list->settings['query_selects'][1]['column']['value'] . ' as text');

        return $query->get();
    }

    public function getWidgets(ListCollection $list, ?array $options = [])
    {
        $widgets = data_get($list->settings, 'widgets', []);

        \Log::debug('getWidgets', [
            'widgets' => $widgets,
            'list' => $list
        ]);

        if(empty($widgets) || $list->settings['widgets']['enabled'] !== true || empty($list->settings['widgets']['items'])){
            return [];
        }

        $fromQuery = $this->getList($list,  returnQuery: true, withoutSearch: true);

        if(!empty($options['whereRaw'])){
            $fromQuery->whereRaw($options['whereRaw']);
        }

        $query = \DB::query()->fromSub($fromQuery, 'sub');

        $widgets = collect($list->settings['widgets']['items'] ?? []);

        $widgets->each(function($widget) use ($query, $list){
            $columnName = collect($list->settings['columns'])->firstWhere('id', $widget['column'])['name'];
            collect($widget['aggregations'])->each(function($aggregation) use ($columnName, $query, $widget, $list){
                $query->selectRaw($aggregation . '(' . $columnName . ') as `'. $widget['id'] . '_' . $aggregation . '`');
            });
        });

        $widgetsValues = $query->first();

        return collect($widgetsValues)->map(function($value, $key) use ($list, $widgets) {
            $widget = $widgets->firstWhere('id', explode('_', $key)[0]);
            $column = collect($list->settings['columns'])->firstWhere('id', $widget['column']);

            if(explode('_', $key)[1] === 'count') {
                return $value;
            }

            if($column['type'] === 'currency'){
                return money($value, $column['currency'] ?? 'USD')->format(style: $widget['precision'] ?? 2);
            }

            return number_format($value, $widget['precision'] ?? 2);
        });
    }
}
