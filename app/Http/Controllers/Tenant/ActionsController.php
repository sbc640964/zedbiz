<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use App\Models\ListCollection;
use App\Models\Tenant\Tenant8\Expense;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ActionsController extends Controller
{
    private $rowList = null;
    private ListCollection|null $list = null;

    public function index()
    {

    }

    static function getActionObject(ListCollection $list, string $action)
    {
        $column = false;

        if(Str::startsWith($action, 'click') || Str::startsWith($action, 'hover')) {
            $column = Str::afterLast($action, '_');
            $action = Str::beforeLast($action, '_');
        }

        if($column) {
            $column = collect($list->settings['columns'] ?? [])->firstWhere('id', $column);

            $event = explode('_', $action);
            $type = $event[1] ?? null;
            $event = $event[0];

            $action = $column[$type ? 'iconActions' : 'actions'][$event];
        } else {
            $action = collect($list->settings['actions'])->firstWhere('id', $action);
        }

        if (!$action || !($action['enabled'] ?? true)) {
            abort(404);
        }

        return $action;
    }

    public function action(int|ListCollection $list, $action)
    {
        if(is_int($list)) {
            $this->list = $list = ListCollection::findOrFail($list);
        }

        $action = static::getActionObject($list, $action);

        return match ($action['type'] ?? 'form') {
            'list' => $this->list($list, $action),
            'singular' => null,
            'c_update' => null,
            'c_delete' => $list->collection->model()->findOrFail(request('record'))->delete(),
            default => $this->form($list, $action),
        };
    }

    public function fetch($list, $action)
    {
        $action = $this->action($list, $action);

        if($action === true) {
            return redirect()->back()->with('toast', [
                'type' => 'success',
                'message' => 'Action executed successfully'
            ]);
        }

        if(is_array($action)){
            return $action;
        }

        return redirect()->back();
    }

    public function form(ListCollection $list, $action)
    {
        [$collectionForm, $form] = $this->getForm($list, $action);

        $relationship = empty($action['relationshipForms']) ? null : $action['relationshipForms'];

        $collectionsRelationship = $relationship ? Collection::findMany(collect($action['relationshipForms'])->pluck('collection')->flatten()->toArray()) : null;

        $record = $this->getFieldsValues($form, $action, $list, $relationship ? [$relationship, $collectionsRelationship] : null);

        $action =  [
            'id' => Str::uuid(),
            'updateModals' => request('isModal'),
            'form' => $form->toArray(),
            'relationships' => [
                'config' => $relationship,
                'objects' => $collectionsRelationship,
            ],
            'action' => $action,
            'list' => $list->toArray(),
            'record' => $record,
            'parentRecordId' => request('record'),
            'collection' => isset($collectionForm)
                ? $collectionForm->toArray()
                : $list->collection->toArray(),
            'extraSettings' => collect($action['config'] ?? [])->mapWithKeys(function($item, $id) use ($list) {
                if($item['defaultValue'] ?? false) {
                    $item['defaultValue'] = $this->getTokens($item['defaultValue'], [
                        'ROW' => $this->getRowList(),
                    ]);
                }
                return [$id => $item];
            }) ?? [],
        ];

        Inertia::modal('Modals/FormCollectionModal', $action);

        return false;
    }

    public function getFieldsValues($form, $action, $list, $relationship = null){
        $return = [
            '__reference_record_id' => request('record'),
            '__reference_list_id' => $list->id,
            '__reference_action_id' => $action['id'],
        ];

        if($relationship) {
            $this->setRelations($form, $relationship);
        }

        if($action['fillForm'] ?? false) {
            $record = $this->getFormModel($action, $form, $relationship);
            $record->setHidden(['created_at', 'updated_at', 'deleted_at', 'created_by', 'updated_by', 'deleted_by']);
            $newCasts = collect($form->columns)->whereIn('type', ['date', 'datetime', 'timestamp'])->mapWithKeys(function($item) {
                return [$item['name'] => 'datetime:Y-m-d H:i:s'];
            })->toArray();
            $record->mergeCasts($newCasts);
            $return = array_merge($return, $record->toArray());
        } else {
            $return = array_merge($return, $this->getDefaultValues($form));
        }

        $relationsModel = collect($return)->filter(function($item, $key) {
            return Str::startsWith($key, '__relation');
        });

        return array_merge($return, ['__extra_sections__' => $relationsModel->mapWithKeys(function($item, $key) {
            return [Str::after($key, '__relation') => $item];
        })->toArray()]);
    }

    public function setRelations($collectionParent, $relationship)
    {
        $relationshipConfig = $relationship[0];
        $collectionsRelationship = $relationship[1];

        collect($relationshipConfig)->each(function ($item, $key) use ($collectionParent, $collectionsRelationship) {

            $collectionParent->model()::resolveRelationUsing('__relation' . $key, function ($model) use ($item, $collectionsRelationship) {
                $collection = $collectionsRelationship->firstWhere('id', $item['collection']);
                $method = $item['collection'] === $item['column']['collection'] ? 'hasMany' : 'belongsTo';

                if($method === 'hasMany' && ($collection->columns->firstWhere('name', $item['column']['name'])['unique'] ?? false) ){
                    $method = 'hasOne';
                }

                $foreignName = $item['column']['name'];
                $localName = $collection->columns->firstWhere('name', $item['column']['name'])['relationTableColumn'] ?? 'id';

                return $model->{$method}($collection->model()::class, $foreignName, $localName)
                    ->withCasts(collect($collection->columns)->whereIn('type', ['date', 'datetime', 'timestamp'])->mapWithKeys(function($item) {
                        return [$item['name'] => 'datetime:Y-m-d H:i:s'];
                    })->toArray());
            });

        });
    }

    private function getDefaultValues($form)
    {
        $return = [];
        foreach ($form->columns as $column) {
            if($column['default'] ?? false) {
                $return[$column['name']] = $this->getTokens($column['default'], [
                    'USER' => auth()->user(),
                    'APP' => tenant(),
                ]);
            }
        }
        return $return;
    }

    private function getTokens($defaultValue, $data = [])
    {
        $defaultValue = Str::of($defaultValue);
        $tokens = $defaultValue->matchAll('/\{\{([^\}]+)\}\}/');

        foreach ($tokens as $token) {
            $defaultValue = $defaultValue->replace('{{'.$token.'}}', $this->getTokenValue($token, $data));
        }

        return $defaultValue->value();
    }

    public function getTokenValue($token, $data = [])
    {
        $token = Str::of($token);

        $key =$token->before(':')->trim();

        if($key->startsWith('NOW')) {
            return now()->format('Y-m-d\TH:i:s');
        }

        return data_get($data, $key, '{{'.$token.'}}');
    }

    public static function getForm($list, $action)
    {
        $actionForm = $action['form'] ?? null;

        $typeValueForm = gettype($actionForm);

        $form = match ($typeValueForm){
            'integer' => Collection::findOrFail($actionForm),
            'string' => ( (int) Str::before($actionForm, '@') ) === $list->collection->id
                ? $list->collection
                : Collection::findOrFail(Str::before($actionForm, '@')),
            default => $list->collection,
        };

        if($form instanceof Collection && $typeValueForm === 'string') {
            $collectionForm = $form;
            $form = $form->columns->firstWhere('id', Str::after($actionForm, '@'));
        }

        if($form instanceof Collection && $typeValueForm === 'integer') {
            $collectionForm = $form;
        }

        return [$collectionForm ?? $list->collection, $form];
    }

    private function getFormModel($action, $form, $relationship = null)
    {
        $id = $action['record'] ?? request('record');

        if(!empty($action['fillFormKey'])){
            $id = $this->getTokens($action['fillFormKey'], [
                'USER' => auth()->user(),
                'APP' => tenant(),
                'ROW' => $this->getRowList(),
            ]);
        }

        return $form->model()::when($relationship, function ($query) use ($relationship) {
            $query->with(collect($relationship[0])->map(function ($item, $key) {
                return '__relation' . $key;
            })->values()->toArray());
        })->findOrFail($id);
    }

    private function getRowList()
    {
            return $this->rowList ?? $this->setRowList();
    }

    private function setRowList()
    {
        return $this->rowList = (new ListsController())->getList($this->list, recordId: request('record'));
    }

    private function list(ListCollection $list, mixed $action)
    {

        $listAction = ListCollection::findOrFail($action['list'] ?? 0);

        //collection, app, list, *collections, records, widgets:widgetsValues, *isAdminScreen

        //add query parameter to request
        $returnObject = false;

        if(request('isModal')){
            $returnObject = true;
        }

        $modalId = request()->has('isModal') ? request('isModal') : Str::uuid();
        request()->merge(['isModal' => $modalId]);

        $whereRaw = !empty($action['queryWhere']) ? $this->getTokens($action['queryWhere'], [
            'USER' => auth()->user(),
            'APP' => tenant(),
            'ROW' => $this->getRowList(),
        ]) : null;

        $listObject = [
            'id' => $modalId,
            'list' => $listAction->toArray(),
            'collection' => $listAction->collection->toArray(),
            'records' => (new ListsController)->getList($listAction, options: [
                'customParams' => ['isModal' => $modalId],
                'whereRaw' => $whereRaw,
            ]),
            'widgets' => (new ListsController)->getWidgets($listAction, [
                'whereRaw' => $whereRaw,
            ]),
            'isAdminScreen' => false,
            'app' => tenant(),
//            'parentRecordId' => request('record'),
//            'parentListId' => $list->id,
//            'parentActionId' => $action['id'],
//            'parentCollectionId' => $list->collection->id,
            'width' => $action['width'] ?? '6xl',
            'queryParameters' => request()->all(),
            'ajaxUrl' => request()->path(),
        ];

        if( $returnObject ) {
            return $listObject;
        }

        Inertia::modal('Modals/List', $listObject);

        return false;
    }
}
