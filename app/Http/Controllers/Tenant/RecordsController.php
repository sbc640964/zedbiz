<?php

namespace App\Http\Controllers\Tenant;

use App\Help;
use App\Http\Controllers\Controller;
use App\Models\Collection;
use App\Models\ListCollection;
use App\Services\Token;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class RecordsController extends Controller
{
    public function search($form, $field, Request $request)
    {
        //TODO: fix to form model
        $form = Collection::findOrFail($form);

        $field = collect($form->columns)->first(fn($column) => $column['id'] === $field && $column['type'] === 'relation');

        if(!$field) {
            abort(404, 'Field not found');
        }

        if(empty($field['relationTable'])) {
            abort(404, 'Relation table not found');
        }

        $collection = Collection::findOrFail($field['relationTable']);

        $columnSearch = $field['relationSelectorLabel'] ?? $collection->settings['primaryColumn'] ??'name';

        $referenceList = $request->get('__reference_list_id');
        $referenceRecord = $request->get('__reference_record_id');
        $referenceAction = $request->get('__reference_action_id');

        $records = $collection
            ->records()
            ->where($columnSearch, 'like', "%{$request->get('q')}%")
            ->when($request->get('currentValue'), fn($query, $value) => $query->orWhere('id', '===', $value))
            ->select($columnSearch . ' as label', 'id as value')
            ->limit(60);

        if($referenceList && $referenceAction) {
            $list = ListCollection::findOrFail($referenceList);

            $action = ActionsController::getActionObject($list, $referenceAction);

            if(data_get($action, 'config.' . $field['id'] . '.query.enabled', false)){
                $statementRaw = data_get($action, 'config.' . $field['id'] . '.query.statement', null);
                $statementRaw = Token::getTokens($statementRaw, $referenceRecord ? [
                    'ROW' =>    (new ListsController())->getList($list, 0, $referenceRecord),
                ] : []);

                $records = $records->whereRaw($statementRaw);
            }
        }


        return $records->get();
    }

    public function store($form, Request $request)
    {
        $referenceAction = $request->get('__reference_action_id');
        $referenceRecord = $request->get('__reference_record_id');
        $referenceList = $request->get('__reference_list_id');

        if($referenceAction && $referenceList){
            $list = ListCollection::findOrFail($referenceList);
            $action = ActionsController::getActionObject($list, $referenceAction);
            [$collectionForm, $form] = ActionsController::getForm($list, $action);
        } else {
            $collectionForm = Collection::findOrFail($form);
            $form = $collectionForm;
        }

        if(!$form){
            abort(404, 'Form not found');
        }

        $attributes = $this->validateForm($form, $request);
        $form->model()->create($attributes);
    }

    public function update($form, $record, Request $request)
    {
        $form = Collection::findOrFail($form);
        $record = $form->records()->findOrFail($record);

        $attributes = $this->validateForm($form, $request);
        $record->update($attributes);

        return back();
    }

    public function validateForm($form, $request)
    {
        $columns = collect($form->columns);

        $rules = $columns->mapWithKeys(fn($column) => [
            $column['name'] => $this->columnRules($column, $form)
        ])->toArray();

        return $request->validate($rules);
    }

    private function columnRules($column, $form)
    {
        $type = $column['type'];

        $rules = [];

        $rules[] = $column['required'] ? 'required' : 'nullable';

        if(in_array($type, ['text', 'textarea', 'wysiwyg', 'radio', 'select'])) {
            $rules[] = 'string';
        }

        if(in_array($type, ['number', 'percent', 'currency'])) {
            $rules[] = 'numeric';
        }

        if(in_array($type, ['date', 'datetime'])) {
            $rules[] = 'date';
        }

        if(in_array($type, ['email', 'url', 'password', 'file', 'image'])) {
            $rules[] = $column['type'];
        }

        if($type === 'select') {
            $rules[] = Rule::in($column['options']);
        }

        if($type === 'time') {
            $rules[] = 'date_format:H:i';
        }

        if($type === 'color') {
            $rules[] = 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/';
        }

        if($type === 'boolean') {
            $rules[] = 'boolean';
        }

        if($type === 'checkbox' || ($type === 'select' && $column['multiple'])) {
            $rules[] = 'array';
        }

        if($column['max'] ?? false) {
            $rules[] = 'max:' . $column['max'];
        }

        if($column['min'] ?? false) {
            $rules[] = 'min:' . $column['min'];
        }

        if($column['unique'] ?? false) {
            $rules[] = Rule::unique($form->table_name, $column['name'])
                ->ignore(request()->get('id') ?? 0);
        }

        if($column['regex'] ?? false) {
            $rules[] = 'regex:' . $column['regex'];
        }

        if ($column['type'] === 'file') {
            $rules[] = 'mime_types:' . ($column['allowedMimeTypes'] ?? 'pdf,doc,docx,xls,xlsx');
        }

        if ($column['type'] === 'image') {
            $rules[] = 'mime_types:' . ($column['allowedMimeTypes'] ?? 'jpg,jpeg,png,gif');
        }

        if($type === 'relation') {
            $collectionRel = Collection::find($column['relationTable']);
            if($collectionRel) {
                $rules[] = Rule::exists($collectionRel->table_name, $column['relationColumn'] ?? 'id');
            }
        }

        return $rules;
    }
}
