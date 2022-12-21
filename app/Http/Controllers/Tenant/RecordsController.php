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

        $columnSearch = $field['relationSelectorLabel'] ?? $collection->settings['primaryColumn'] ?? 'id';

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
                $statementRaw = Token::getTokens(
                    $statementRaw,
                    $referenceRecord ? [
                        'ROW' =>    (new ListsController())->getList($list, 0, $referenceRecord, options: ['noFormat' => true]),
                    ] : [],
                    ['onFallback' => ['ROW' => 'NULL']]
                );

                $records = $records->whereRaw($statementRaw);
            }
        }

        return $records->get();
    }

    public function store($form, Request $request)
    {

        [$collectionForm, $form, $list, $action] = $this->getModels($form, $request);

        if(!$form){
            abort(404, 'Form not found');
        }

        $attributes = $this->validateForm($form, $request);
        $attributes['user_created_id'] = auth()->id();

        \DB::transaction(function () use ($list, $action, $request, $attributes, $collectionForm) {

            $relationshipConfig = $collectionForm->settings['menu']['new_form_sections'] ?? null;

            if($action && ($action['relationshipForms'] ?? false)) {
                $relationshipConfig = $action['relationshipForms'];
            }elseif($list && ($list->settings['add_new_relationship_forms'] ?? false)) {
                $relationshipConfig = $list->settings['add_new_relationship_forms'];
            }

            $id = $collectionForm->model()->create($attributes);

            if(collect(\Arr::dot($request->get('__extra_sections__', [])))->count() > 0){
                $collectionForm->settings = array_merge($collectionForm->settings, [
                    'menu' => [
                        'new_form_sections' => $relationshipConfig,
                    ]
                ]);
                $this->saveExtraSections($collectionForm, $id, $request->get('__extra_sections__'));
            }
        });
    }

    public function getModels($form, Request $request)
    {
        $referenceAction = $request->get('__reference_action_id');
        $referenceRecord = $request->get('__reference_record_id');
        $referenceList = $request->get('__reference_list_id');

        $list = null;
        $action = null;

        if($referenceAction && $referenceList){
            $list = ListCollection::findOrFail($referenceList);
            $action = ActionsController::getActionObject($list, $referenceAction);
            [$collectionForm, $form] = ActionsController::getForm($list, $action);
        } else {
            $collectionForm = Collection::findOrFail($form);
            $form = $collectionForm;
        }

        return [
            $collectionForm,
            $form,
            $list,
            $action
        ];
    }

    public function saveExtraSections($form, $parentRecord, $sections)
    {
        $sectionsExtra = collect($form->settings['menu']['new_form_sections'] ?? []);

        if(!$sectionsExtra->count()){
            return;
        }

        $collections = Collection::whereIn('id', $sectionsExtra->pluck('collection')->flatten()->toArray())->get();

        foreach($sections as $section => $items){
            $sectionExtra = $sectionsExtra->get($section);

            $collection = $collections->first(fn($collection) => $collection->id === $sectionExtra['collection']);

            $deleteItems = collect(\request('__relation'.$section))
                ->pluck('id')
                ->filter()
                ->diff(collect($items)->pluck('id')->filter());

            if($deleteItems->count()){
                $collection->model()->whereIn('id', $deleteItems->toArray())->delete();
            }

            foreach ($items as $value) {
                if($collection->id === $sectionExtra['column']['collection']){
                    $value[$sectionExtra['column']['name']] = $parentRecord->id;
                }
                $attributes = $this->validateForm($collection, new Request($value), false);
                if(is_int($value['id'])){
                    $attributes['user_last_modified_id'] = auth()->id();
                    $collection->model()->find($value['id'])->update($attributes);
                } else {
                    $attributes['user_created_id'] = auth()->id();
                    $collection->model()->create($attributes);
                }
            }
        }
    }

    public function update($form, $record, Request $request)
    {
        [$collectionForm, $form, $list] = $this->getModels($form, $request);

        $attributes = $this->validateForm($form, $request);

        $attributes['user_last_modified_id'] = auth()->id();

        \DB::transaction(function () use ($request, $attributes, $form, $record) {
            $record = $form->records()->findOrFail($record);

            $record->update($attributes);

            if(collect(\Arr::dot($request->get('__extra_sections__', [])))->count() > 0){
                $this->saveExtraSections($form, $record, $request->get('__extra_sections__'));
            }
        });



        return back();
    }

    public function validateForm($form, $request, $extra = true)
    {
        $sectionsExtra = $form->settings['menu']['new_form_sections'] ?? [];

        $columns = collect($form->columns);

        $rules = $columns->mapWithKeys(fn($column) => [
            $column['name'] => $this->columnRules($column, $form)
        ])->toArray();

        if(!empty($sectionsExtra)){
            $collections = Collection::findMany(collect($sectionsExtra)
                ->pluck('collection')
                ->flatten()
                ->toArray());

            foreach($sectionsExtra as $index => $section){
                $collection = $collections->find($section['collection']);
                $rules['__extra_sections__.' . $index] = 'nullable|array';
                $rules = array_merge($rules, collect($collection->columns)->mapWithKeys(fn($column) => [
                    '__extra_sections__.'.$index . '.*.' . $column['name'] =>
                        $section['collection'] === $section['column']['collection'] && $section['column']['name'] === $column['name'] ? Rule::in(['{{PARENT_RECORD_ID}}', '', $request->get('id')]) : $this->columnRules($column, $collection)
                ])->toArray());
            }
        }

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
            $rules[] = Rule::in(collect($column['options'])->pluck('value')->toArray());
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

        if($type === 'checkbox' || ($type === 'select' && ($column['multiple'] ?? false) )) {
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
