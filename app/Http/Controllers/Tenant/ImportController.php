<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use Arr;
use Carbon\Carbon;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Log;

class ImportController extends Controller
{
    public function validateRows(Collection $collection, Request $request, $returnData = false)
    {
        $rules = [
            'rows' => 'required|array',
        ];

        collect($collection->columns)->each(function ($column) use ($request, $collection, &$rules) {
            $columnKey = 'rows.*.' . $column['name'];
            $rulesItem = [$column['required'] ? 'required' : 'nullable'];
            if (in_array($column['type'], ['string', 'text', 'email', 'url', 'password', 'textarea', 'select', 'radio', 'checkbox', 'tel'])) {
                $rulesItem[] = 'string';
                $rulesItem[] = 'max:' . ($column['max'] ?? '255');
            }
            if (in_array($column['type'], ['number', 'currency', 'percent'])) {
                $rulesItem[] = 'integer';
            }
            if (in_array($column['type'], ['select', 'checkbox'])) {
                $rulesItem[] = 'in:' . implode(',', collect($column['options'])->pluck('value')->toArray());
            }
            if ($column['type'] === 'date') {
                $rulesItem[] = 'date';
            }
            if ($column['type'] === 'datetime') {
                $rulesItem[] = 'date_format:Y-m-d H:i:s';
            }
            if ($column['type'] === 'time') {
                $rulesItem[] = 'date_format:H:i:s';
            }
            if ($column['type'] === 'email') {
                $rulesItem[] = 'email';
            }
            if ($column['type'] === 'url') {
                $rulesItem[] = 'url';
            }
            if ($column['type'] === 'image') {
                $rulesItem[] = 'image';
            }
            if ($column['type'] === 'file') {
                $rulesItem[] = 'file';
            }
            if ($column['type'] === 'boolean') {
                $rulesItem[] = 'boolean';
            }

            if ($column['type'] === 'relation') {
                $tableName = Collection::findOrFail($column['relation']['table'])->table_name;
                $rulesItem[] = 'exists:' . $tableName . ',' . $column['relation']['column'];
            }

            if ($column['unique'] && $request->get('skipDuplicatesErrors') === false) {
                $rulesItem[] = 'unique:' . $collection->table_name . ',' . $column['name'];
            }

            $rules[$columnKey] = $rulesItem;
        });

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            if($returnData){

                $indexesFailed = [];

                foreach($validator->errors()->messages() as $key => $value){
                    $indexesFailed[] = explode('.', $key)[1];
                }

                return [
                    collect($request->get('rows'))->except($indexesFailed),
                    collect($request->get('rows'))->only($indexesFailed),
                ];
            }
            return response()->json([
                'errors' => $validator->errors()->toArray(),
            ]);
        }

        if($returnData){
            return [
                $request->get('rows'),
                [],
            ];
        }

        return response()->json([
            'message' => 'All rows are valid',
        ]);
    }

    function store(Collection $collection, Request $request)
    {

        [$rows, $failedValidate] = $this->validateRows($collection, $request, true);

        $userId = auth()->id();

        $rows = collect($rows)->map(fn($row) => array_merge($row, [
            'created_at' => now(),
            'updated_at' => now(),
            'user_created_id' => $userId,
            'user_last_modified_id' => $userId,
        ]));

        if(!empty($request->get('merge'))){
            /** @var Builder $query */
            $query = $collection->model()->query();

            if(count($request->get('merge')) > 1){
                collect($request->get('merge'))->mapWithKeys(fn($item) =>
                    [$item => $rows->pluck($item)->flatten()->filter()->unique()->toArray()]
                )->each(fn($item, $key) => $query->orWhereIn($key, $item));
            } else {
                $query->whereIn($request->get('merge')[0], $rows->pluck($request->get('merge')[0])->toArray());
            }

            // get Existing rows
            $existingRows = $query->get();

            $rows = $rows->map(function($row) use ($existingRows, $request, &$updates, &$inserts){
                $a = collect($row)->filter()->only($request->get('merge'))->toArray();
                $keys = array_keys($a);

                $existingRow = !empty($keys) ? $existingRows->where(function ($record) use ($a) {
                    $isUpdated = false;
                    foreach ($a as $key => $value) {
                        if ($record->{$key} === $value) {
                            $isUpdated = true;
                            break;
                        }
                    }
                    return $isUpdated;
                }) : 'notExistsKeys';

                if($existingRow === 'notExistsKeys'){
                    $row['failed'] = 'not exists values to compare and merge';
                }

                elseif($existingRow && $existingRow->count() > 1){
                    $row['failed'] = 'more than one row found';
                }

                elseif($existingRow && $existingRow->count() === 1){
                    $row['id'] = $existingRow->first()->id;
                }

                return $row;
            });

            $updates = $rows->filter(fn($row) => isset($row['id']) && !isset($row['failed']))->map(function ($row) use ($existingRows) {
                $existingRow = $existingRows->find($row['id']);
                $originalRow = Arr::except($row, ['failed', 'created_at', 'updated_at', 'user_created_id', 'user_last_modified_id']);
                $existingRow->fill($originalRow);
                return [
                    'original' => $existingRow->getOriginal(),
                    'updated' => $existingRow->getAttributes(),
                    'isDirty' => $existingRow->isDirty(),
                    'changes' => $existingRow->getChanges(),
                    'row' => $originalRow,
                    'model' => $existingRow,
                    'toUpdate' => Arr::except($row, ['failed']),
                ];
            });

            $noUpdate = $updates->where('isDirty', false);
            $updates = $updates->where('isDirty', true);

            $inserts = $rows->filter(fn($row) => !isset($row['id']) && !isset($row['failed']));
            $failed = $rows->filter(fn($row) => isset($row['failed']));

            $toUpdateArray = $updates->pluck('toUpdate');
            $updatesQuery = false;
            $toUpdateArray->count() && $updatesQuery = $collection->model()->upsert($toUpdateArray->toArray(), ['id'],
                array_keys(Arr::except($toUpdateArray->first(), ['created_at', 'user_created_id', 'id']))
            );

            $insertsQuery = false;
            $inserts->count() && $insertsQuery = $collection->model()->insert($inserts->toArray());

            return([
                'updated' => $updatesQuery,
                'inserted' => $insertsQuery,
                'update' => $updates,
                'insert' => $inserts,
                'failed' => $failed->merge($failedValidate),
                'unChanged' => $noUpdate,
            ]);
        }
        else {
            $inserts = $collection->model()->insert($rows->toArray());
        }


        return response()->json([
            'message' => 'Rows created successfully',
            'ids' => $inserts,
        ]);
    }
}
