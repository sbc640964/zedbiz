import ContainerPage from "@/Components/Table/ContainerPage";
import Authenticated from "@/Layouts/Authenticated";
import App from "@/Layouts/App";
import CollectionLayout from "@/Layouts/CollectionLayout";
import Button from "@/Components/Button";
import SectionCard from "@/Components/Card/SectionCard";
import FieldRow from "@/Components/Form/FieldRow";
import Input from "@/Components/Form/Input";
import {useForm} from "@inertiajs/inertia-react";
import InputError from "@/Components/Form/InputError";
import Textarea from "@/Components/Form/Textarea";
import Select from "@/Components/Form/Select";
import {set, cloneDeep} from "lodash";
import Switcher from "@/Components/Form/Switcher";
import ColumnsListForm from "@/Components/Admin/ColumnsListForm";
import JoinsListForm from "@/Components/Admin/JoinsListForm";
import Label from "@/Components/Form/Label";
import {v4 as uuid} from "uuid";
import ListSortableSection from "@/Components/Admin/ListSortableSection";
import {Inertia} from "@inertiajs/inertia";
import SqlEditor from "@/Components/Form/SqlEditor";
import {Parser} from "lite-ui-sql-parser";
import {useEffect, useRef, useState} from "react";
import ActionFormInputs from "@/Components/Admin/ActionFormInputs";
import ColumnFormInputs from "@/Components/Admin/ColumnFormInputs";
import {collect} from "collect.js";
import WidgetListFormInput from "@/Components/Admin/WidgetListFormInput";
import {getSectionsFormOptions} from "@/helpers";
import Tree from "@/Components/Tree";


function NewList({collection, app, collections, list, onUpdate}) {

    const [sqlError, setSqlError] = useState(null);

    const queryTablesColumns = useRef(collections.map(c => ({
        id: c.table_name,
        label: c.name,
        children: collect(c.columns).map(col => ({
                id: `${c.table_name}.${col.name}`,
                label: col.label ?? col.name,
                type: col.type,
                table: c.table_name,
            }))
            .prepend({
                id: `${c.table_name}.id`,
                label: 'ID',
                type: 'integer',
                table: c.table_name,
            })
            .merge(
                collect({
                    created_at: 'Created at',
                    updated_at: 'Updated at'
                })
                .map((value, key) => ({
                    id: `${c.table_name}.${key}`,
                    label: value,
                    table: c.table_name,
                }))
                .values()
                .all()
            ).all()
    })));

    const {data, errors, setData: setDataForm, post, put, reset} = useForm( cloneDeep(list) ?? {
        name: '',
        slug: '',
        description: '',
        columns: [],
        type: 'table',
        query_mode: 'sql_raw',
        settings: {
            raw_query: `SELECT ${collection.table_name}.id FROM ${collection.table_name}`,
            query_group_by_id: true,
            query_selects: [
                {
                    'column': {label: 'ID', name:'id', table: collection.table_name, value: `${collection.table_name}.id` },
                    'alias': 'id',
                    'type': 'column',
                    'table': collection.table_name,
                },
            ],
            query_joins: [],
            enable_add_new: true,
            columns: [],
            actions: [
                {
                    enabled: true,
                    label: 'Edit',
                    icon: 'PencilIcon',
                    color: 'primary',
                    id: uuid(),
                },
                {
                    enabled: true,
                    label: 'Delete',
                    icon: 'TrashIcon',
                    color: 'danger',
                    type: 'c_delete',
                    id: uuid(),
                    confirmation: {
                        enabled: true,
                        title: 'Delete record',
                        message: 'Are you sure you want to delete this record?',
                        btn_text: 'Delete',
                        btn_cancel_text: 'Cancel',
                    }
                },
            ],
        }
    });

    const sqlEditorRef = useRef(null);

    function setData(key, value) {
        if (key.indexOf('.') > -1) {
            let keys = key.split('.');
            const firstKey = keys.shift();
            const baseWrapper = Number(keys[0]) ? [] : {};
            const object = set(data?.[firstKey] ?? baseWrapper, keys.join('.'), value);
            return setDataForm(firstKey, object);
        }
        setDataForm(key, value);
    }

    function onSuccess() {
        typeof onUpdate === 'function' && onUpdate();
    }

    function submit() {
        !list
            ? post(route('admin.apps.edit.collections.lists.store', {app: app.id, collection: collection.id}), {onSuccess})
            : put(route('admin.apps.edit.collections.lists.update', {app: app.id, collection: collection.id, list: list.id}), {onSuccess});
    }


    function queryColumns() {
        return [];
        if (!data.settings.query_selects) return [];
        return data.settings.query_selects.split(',').map(column => {
            column = column.trim();
            return {
                label: column.split(' as ')[1] ?? column,
                name: column,
            }
        });
    }

    function deleteList() {
        if (!confirm('Are you sure you want to delete this list?')) return;
        Inertia.delete(route('admin.apps.edit.collections.lists.delete', {app: app.id, collection: collection.id, list: list.id}))
    }

    useEffect(() => {
        let test = null;
        try{
            test = new Parser().parse(data.settings?.raw_query.trim());
        } catch (e) {
            return setSqlError(e);
        }
        if(test) setSqlError(null);
    }, [data.settings?.raw_query]);

    function getSqlParse(){
        let sql = {};

        if(!sqlError){
            try{
                return new Parser().parse(data.settings?.raw_query.trim());
            } catch (e) {

            }
        }

        return sql;
    }

    function getColumnType(table, column) {
        return collect(collections).first(c => c.table_name === table)?.columns?.find(c => c.name === column)?.type;
    }

    function createColumnByQuery() {
        const columns = getSqlParse()?.ast?.columns ?? [];

        collect(columns).map(column => {
            const name = column.as ?? column.expr.column;
            const label = name;
            const type = getColumnType(column.expr.table, column.expr.column) ?? 'text';
            const table = column.expr.table ?? column.expr.type;

            const columnExists = (data.settings?.columns ?? []).find(c => c.name === name);
            if (!columnExists) {
                const id = uuid();
                setData('settings.columns', [...(data.settings?.columns ?? []), {
                    id: id,
                    name,
                    label,
                    type,
                    table,
                    show: true,
                    actions: {
                        click: {id: `click_${id}`},
                        hover: {id: `hover_${id}`},
                    },
                    iconActions: {
                        click: {id: `click_icon_${id}`},
                        hover: {id: `hover_icon_${id}`},
                    }
                }]);
            }
        })
    }

    return (
        <ContainerPage
            label={list?.name ?? 'New List'}
            className="bg-transparent shadow-none !rounded-none overflow-visible border-0"
            actions={[
                <Button
                    color="success"
                    action={() => submit()}
                >
                    {list?.id ? 'Update list' : 'Create list'}
                </Button>,
                list?.id ?
                    <Button
                        color="danger"
                        action={deleteList}
                    >
                        Delete list
                    </Button>
                    : null
            ]}
        >
            <>
                <SectionCard
                    label="General"
                    icon={'cog-8-tooth'}
                >
                    <FieldRow label="Name" description="The name of list">
                        <Input
                            name="name"
                            className="w-full py-1.5 text-sm"
                            value={data.name}
                            handleChange={e => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name}/>
                    </FieldRow>

                    <FieldRow label="Description"
                              description="Describe a little the function of the list, it will make it easier for you when choosing the list in the required places">
                        <Textarea
                            name="description"
                            className="w-full py-1.5 text-sm"
                            value={data.description}
                            handleChange={e => setData('description', e.target.value)}
                        />
                        <InputError message={errors.description}/>
                    </FieldRow>

                    <FieldRow label="Type list"
                              description="The list layout type, currently there is only a table. There are surprises...">
                        <Select
                            name="type"
                            isDisabled
                            className="w-full text-sm"
                            value={data.type}
                            handleChange={e => setData('type', e?.value ?? e)}
                            placeholder="Table"
                            options={[
                                {value: 'table', label: 'Table'},
                                {value: 'list', label: 'List'},
                                {value: 'grid', label: 'Grid'},
                                {value: 'calendar', label: 'Calendar'},
                                {value: 'timeline', label: 'Timeline'},
                            ]}
                        />
                        <InputError message={errors.type}/>
                    </FieldRow>

                    <FieldRow label="Query mode"
                              description="The query mode, currently there is only a sql raw. There are surprises...">
                        <Select
                            name="query_mode"
                            isDisabled
                            className="w-full text-sm"
                            value={data.query_mode}
                            onChange={e => setData('query_mode', e?.value ?? e)}
                            placeholder="Query builder"
                            options={[
                                {value: 'sql_raw', label: 'SQL raw'},
                                {value: 'default', label: 'Query builder'},
                            ]}
                        />
                        <InputError message={errors.query_mode}/>
                    </FieldRow>
                    <FieldRow label="Bulk actions" description="Enable or disable the bulk actions and checked column in the list">
                        <Switcher
                            value={data.settings?.bulk_actions?.enabled ?? false}
                            handleChange={e => setData('settings.bulk_actions.enabled', e.target.value)}
                        />
                    </FieldRow>

                    <FieldRow label="Widgets section" description="Enable or disable the widgets section in the list">
                        <Switcher
                            value={data.settings?.widgets?.enabled ?? false}
                            handleChange={e => setData('settings.widgets.enabled', e.target.value)}
                        />
                    </FieldRow>
                </SectionCard>

                <SectionCard
                    label="Query"
                    className="mt-10"
                >
                    {data.query_mode === 'sql_raw' &&
                        <>
                            <div className="flex">
                                <div className="w-5/6 border-r rtl:border-r-0 rtl:border-l">
                                    <SqlEditor
                                        value={data.settings.raw_query}
                                        handleChange={e => setData('settings.raw_query', e)}
                                        ref={sqlEditorRef}
                                    />
                                    <InputError message={errors?.['settings.raw_query']}/>
                                </div>
                                <div className="w-1/6 p-4 max-h-[500px] overflow-y-auto scrollbar">
                                    <Tree
                                        items={queryTablesColumns.current}
                                        onClick={item => {
                                            if (item.id) {
                                                const cursorPosition = sqlEditorRef.current.editor.selection.getCursor();
                                                sqlEditorRef.current.editor.session.insert(cursorPosition, item.id);
                                                sqlEditorRef.current.editor.focus();
                                            }
                                        }}
                                    >
                                        {(item, isOpened) => (
                                            <div className="flex items-center hover:bg-gray-100 cursor-pointer w-full rounded-lg">
                                                <span className={`${isOpened ? 'bold py-0.5' : 'text-sm text-gray-600 py-1'} px-2`}>
                                                    {item.label}
                                                </span>
                                            </div>
                                        )}
                                    </Tree>
                                </div>
                            </div>
                            {sqlError &&
                                <div className="p-4">
                                    <div className="bg-red-50 p-4 rounded-lg border border-red-700 text-red-700">
                                        <div className="font-bold">{sqlError.name}</div>
                                        <p className="text-sm">{sqlError.message} on line {sqlError.location?.start?.line}</p>
                                    </div>
                                </div>
                            }
                        </>
                    }

                    {data.query_mode === 'default' &&
                        <div>
                            <FieldRow
                                label="Joins"
                                description="The list of joins for the query"
                                widths={['w-1/3', 'w-2/3']}
                            >
                                <JoinsListForm
                                    setData={setData}
                                    data={data}
                                    errors={errors}
                                    collection={collection}
                                    collections={collections}
                                />
                            </FieldRow>

                            <FieldRow
                                label="Selects"
                                description="Select columns to be displayed in the table."
                            >
                                <ColumnsListForm
                                    collection={collection}
                                    collections={collections}
                                    errors={errors}
                                    data={data}
                                    setData={setData}
                                />
                            </FieldRow>

                            <FieldRow label="Group By ID">
                                <Switcher
                                    value={data.settings.query_group_by_id}
                                    handleChange={e => setData('settings.query_group_by_id', e.target.value)}
                                />
                            </FieldRow>
                        </div>
                    }
                </SectionCard>

                <ListSortableSection
                    collection={collection}
                    collections={collections}
                    errors={errors}
                    data={data}
                    setData={(key, value) => setData('settings.columns.' + key, value)}
                    changeOrder={v => setData('settings.columns', v)}
                    label={'Columns'}
                    items={data.settings?.columns ?? []}
                    remove={index => setData('settings.columns', data.settings?.columns?.filter((_, i) => i !== index))}
                    ComponentItem={ColumnFormInputs}
                    show={data.query_mode === 'sql_raw'}
                    labelAdd={'Add column'}
                    addItem={() => setData('settings.columns', [...(data.settings?.columns ?? []), {
                        enabled: true,
                        label: 'Column ' + ((data.settings?.columns?.length ?? 0) + 1),
                        icon: 'code-bracket',
                        color: '',
                        type: 'form',
                        form: '',
                        id: uuid(),
                    }])}
                    actions={[
                        <Button
                            color="primary"
                            action={() => createColumnByQuery()}
                        >
                            Create columns by query
                        </Button>
                    ]}
                />

                <SectionCard label="Add new" className="mt-10">
                    <FieldRow label="Enable" description="">
                        <Label>
                            <Switcher
                                value={data.settings.enable_add_new}
                                handleChange={e => setData('settings.enable_add_new', e.target.value)}
                            />
                            <span className="ml-2 text-sm">{data.settings?.enable_add_new ? 'Enable' : 'Disable'}</span>
                        </Label>
                    </FieldRow>
                    <FieldRow label="label" description="" show={data.settings?.enable_add_new}>
                        <Input
                            name="add_new_label"
                            className="w-full py-1.5 text-sm"
                            value={data.settings?.add_new_label}
                            handleChange={e => setData('settings.add_new_label', e.target.value)}
                            placeholder={'Add ' + (collection.settings?.singular_label ?? 'item')}
                        />
                        <InputError message={errors.settings?.add_new_label}/>
                    </FieldRow>
                    <FieldRow label="Form" description="" show={data.settings?.enable_add_new}>
                        <Select
                            name="add_new_form"
                            className="w-full text-sm"
                            value={data.settings?.add_new_form}
                            handleChange={e => setData('settings.add_new_form', e?.value ?? e)}
                            placeholder="Default"
                            options={collection?.forms ?? []}
                        />
                        <InputError message={errors.settings?.add_new_form}/>
                    </FieldRow>
                    <FieldRow label="Relationship" description="" show={data.settings?.enable_add_new && !data.settings?.add_new_form}>
                        <Select
                            name="add_new_relationships_forms"
                            className="w-full text-sm"
                            value={data.settings?.add_new_relationship_forms}
                            handleChange={e => setData('settings.add_new_relationship_forms', e?.value ?? e)}
                            placeholder="Select relationship forms"
                            options={getSectionsFormOptions(collections, collection)}
                            isMulti
                            noOptionsMessage={() => "No relationship forms"}
                        />
                    </FieldRow>
                    <FieldRow label="View method" description="" show={data.settings?.enable_add_new}>
                        <Select
                            name="add_new_view_method"
                            className="w-full text-sm"
                            value={data.settings?.add_new_view_method}
                            handleChange={e => setData('settings.add_new_view_method', e?.value ?? e)}
                            placeholder="Modal"
                            options={[
                                {value: 'redirect', label: 'Redirect'},
                                {value: 'modal', label: 'Modal'},
                                // {value: 'drawer', label: 'Drawer'},
                            ]}
                        />
                    </FieldRow>
                    <FieldRow label="Import" description="">
                        <Label>
                            <Switcher
                                value={data.settings.enable_import}
                                handleChange={e => setData('settings.enable_import', e.target.value)}
                            />
                            <span className="ml-2 text-sm">{data.settings?.enable_import ? 'Enable' : 'Disable'}</span>
                        </Label>
                    </FieldRow>
                    <FieldRow label="Export" description="">
                        <Label>
                            <Switcher
                                value={data.settings.enable_export}
                                handleChange={e => setData('settings.enable_export', e.target.value)}
                            />
                            <span className="ml-2 text-sm">{data.settings?.enable_export ? 'Enable' : 'Disable'}</span>
                        </Label>
                    </FieldRow>

                </SectionCard>

                <ListSortableSection
                    collection={collection}
                    collections={collections}
                    errors={errors}
                    data={data}
                    setData={(key, value) => setData('settings.actions.' + key, value)}
                    changeOrder={v => setData('settings.actions', v)}
                    label={'Actions'}
                    items={data.settings.actions}
                    remove={index => setData('settings.actions', data.settings.actions.filter((_, i) => i !== index))}
                    ComponentItem={ActionFormInputs}
                    labelAdd={'Add custom action'}
                    addItem={() => setData('settings.actions', [...data.settings.actions, {
                        enabled: true,
                        label: 'Action ' + (data.settings.actions.length + 1),
                        icon: 'code-bracket',
                        color: '',
                        type: 'form',
                        form: '',
                        id: uuid(),
                    }])}
                />

                {['query_builder', 'default'].includes(data.query_mode) && queryColumns().map(column => (
                    <SectionCard
                        className="mt-10"
                        key={column.name}
                        label={'display column: ' + column.label}
                    >

                    </SectionCard>
                ))}

                <ListSortableSection
                    collection={collection}
                    collections={collections}
                    errors={errors}
                    data={data}
                    setData={(key, value) => setData('settings.widgets.items.' + key, value)}
                    changeOrder={v => setData('settings.widgets.items', v)}
                    label={'Widgets'}
                    items={data.settings?.widgets?.items ?? []}
                    remove={index => setData('settings.widgets.items', data.settings.widgets.items.filter((_, i) => i !== index))}
                    ComponentItem={WidgetListFormInput}
                    labelAdd={'Add widget'}
                    addItem={() => setData('settings.widgets.items', [...data.settings?.widgets?.items ?? [], {
                        enabled: true,
                        label: 'Widget ' + ((data.settings?.widgets?.items?.length ?? 0) + 1),
                        icon: 'banknotes',
                        column: null,
                        options: ['sum'],
                        precision: 2,
                        id: uuid(),
                    }])}
                />
            </>
        </ContainerPage>
    )
}

NewList.layout = page => <Authenticated title={`${page.props.collection.name} - New list`}>
    <App>
        <CollectionLayout>
            {page}
        </CollectionLayout>
    </App>
</Authenticated>;

export default NewList
