import {cloneDeep, get as getData, random} from "lodash";
import Authenticated from "@/Layouts/Authenticated";
import App from "@/Layouts/App";
import CollectionLayout from "@/Layouts/CollectionLayout";
import ContainerPage from "@/Components/Table/ContainerPage";
import Button from "@/Components/Button";
import Input from "@/Components/Form/Input";
import FieldRow from "@/Components/Form/FieldRow";
import {useForm} from "@inertiajs/inertia-react";
import Select from "@/Components/Form/Select";
import SectionCard from "@/Components/Card/SectionCard";
import Switcher from "@/Components/Form/Switcher";
import collect from "collect.js";
import Textarea from "@/Components/Form/Textarea";
import {currencies, inputTypes} from "@/helpers";
import Icon from "@/Components/Icon";
import {v4 as uuid} from "uuid";
import {useState} from "react";

function Column({columnId, collection, collections, app}) {

    const [columnName] = useState('column' + random(0, 1000));

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        isDirty
    } = useForm(columnId ? collection.columns.find(column => column.id === columnId) : {
        name: '',
        label: '',
        type: '',
        required: false,
        unique: false,
        scale: '',
        default: '',
        index: false,
        options: [
            {id: uuid(), value: ''}
        ],
        min: '',
        max: '',
        step: '',
        placeholder: '',
        help: '',
        showInList: true,
        showInDetail: true,
        showInForm: true,
    });

    function submit(e) {

        e?.preventDefault();

        columnId
            ? put(route('admin.apps.edit.collections.columns.update', {
                app: app.id,
                collection: collection.id,
                column: data.id
            }, {
                preserveScroll: true
            }))
            : post(route('admin.apps.edit.collections.columns.store', {
                app: app.id,
                collection: collection.id
            }));
    }

    function getError(field) {
        return getData(errors, field, null);
    }

    function isType(...type) {
        const types = collect({
            numeric: ['number', 'currency', 'percent'],
            string: ['text', 'textarea', 'wysiwyg'],
            boolean: ['switcher'],
            date: ['date', 'datetime'],
            time: ['time'],
            file: ['file', 'image'],
            hasOptions: ['select', 'radio', 'checkbox'],
        });

        return types.filter((value, key) => type.includes(key)).flatten().contains(data.type);
    }

    function getRelationColumns() {
        if(!data.relationTable) return [];
        return collect(collections)
            .where('id', data.relationTable)
            .pluck('columns')
            .flatten(1)
            .map(column => ({
                label: column.label,
                value: column.name
            }))
            .prepend({label: 'ID', value: 'id'});
    }

    function getCollections() {
        return collect(collections)
            .map(coll => ({
                label: coll.singular_label ?? coll.name,
                value: coll.id
            }))
            .prepend({value: 'user', label: 'User'})
            .all()
    }

    return (
        <ContainerPage
            label={columnId ? 'Edit Column' : 'New Column'}
            className="bg-transparent shadow-none !rounded-none overflow-visible border-0"
            actions={[
                <Button
                    color="success"
                    action={() => submit()}
                >
                    {columnId ? 'Update Column' : 'Create Column'}
                </Button>,
            ]}
        >
            <SectionCard label="General">
                <FieldRow label="Label" required description="The label of column" errors={getError('label')}>
                    <Input
                        className="w-full py-1.5 text-sm"
                        value={data.label}
                        handleChange={e => setData('label', e.target.value)}
                    />
                </FieldRow>
                <FieldRow label="Name" required description="The column name - is important to Raw SQL statements" errors={getError('name')}>
                    <Input
                        className="w-full py-1.5 text-sm"
                        value={data.name}
                        handleChange={e => setData('name', e.target.value)}
                        placeholder={columnName}
                    />
                </FieldRow>

                <FieldRow label="Type" required description="The column type" errors={getError('type')}>
                    <Select
                        className="w-full text-sm"
                        value={data.type}
                        handleChange={e => setData('type', e?.value ?? e)}
                        options={inputTypes}
                    />
                </FieldRow>
            </SectionCard>

            <SectionCard label="Relationship settings" show={data.type === 'relation'} className="mt-10">
                <FieldRow label="Table" required description="The relation table"
                          errors={getError('relationTable')}>
                    <Select
                        className="w-full text-sm"
                        value={data.relationTable}
                        handleChange={e => setData('relationTable', e.value ?? e)}
                        options={getCollections()}
                    />
                </FieldRow>
                <FieldRow label="Column" description="The relation column" errors={getError('relationTableColumn')}>
                    <Select
                        className="w-full text-sm"
                        value={data.relationTableColumn}
                        handleChange={e => setData('relationTableColumn', e.value ?? e)}
                        options={getRelationColumns()}
                        placeholder="ID"
                        isClearable
                    />
                </FieldRow>

                <FieldRow label="Selector label & search" description="The relation column to show in selector" errors={getError('relationSelectorLabel')}>
                    <Select
                        className="w-full text-sm"
                        value={data.relationSelectorLabel}
                        handleChange={e => setData('relationSelectorLabel', e.value ?? e)}
                        options={getRelationColumns()}
                        placeholder="ID"
                        isClearable
                    />
                </FieldRow>
            </SectionCard>

            <SectionCard label="Options" className="mt-10" show={isType('hasOptions')}>
                {/* TODO: add feature to add extra symbol to select item */}
                <FieldRow show={false} label="Symbol options type" description="The symbol options type"
                          errors={getError('options')}>
                    <Select
                        className="w-full text-sm"
                        value={data.symbolOptionsType}
                        handleChange={e => setData('symbolOptionsType', e?.value ?? e)}
                        options={[
                            {value: 'image', label: 'Image'},
                            {value: 'color', label: 'Color'},
                            {value: 'text', label: 'Text'},
                            {value: 'icon', label: 'Icon'},
                        ]}
                        isClearable
                        placeholder="Without extra symbol"
                    />
                </FieldRow>
                <FieldRow label="Options" description="The options of column" className="items-start">
                    <div className="w-full flex flex-col space-y-2">
                        {(data.options ?? []).map((option) => (
                            <div key={option.id} className="flex">
                                <div className="flex items-center w-full">
                                    <div className="flex-grow">
                                        <Input
                                            className="w-full py-1.5 text-sm"
                                            value={option.value}
                                            handleChange={e => setData('options', data.options.map((o) => o.id === option.id ? {
                                                ...o,
                                                value: e.target.value
                                            } : o))}
                                        />
                                    </div>
                                    {data.options.length > 1 &&
                                        <Button
                                            className="ml-2"
                                            color="danger"
                                            size="sm"
                                            negative
                                            icon="trash"
                                            iconType="outline"
                                            doubleClick
                                            tooltip="Press double click to delete"
                                            action={() => setData('options', data.options.filter((o) => o.id !== option.id))}
                                        />
                                    }
                                </div>
                            </div>
                        ))}
                        <div>
                            <Button
                                className="mt-2 w-auto"
                                action={() => setData('options', collect(data?.options ?? []).push({
                                    id: uuid(),
                                    value: ''
                                }).all())}
                            >
                                Add option
                            </Button>
                        </div>
                    </div>
                </FieldRow>
            </SectionCard>

            <SectionCard label="Settings" className="mt-10">
                <FieldRow label="Required" description="Is column required">
                    <Switcher
                        value={data.required}
                        handleChange={e => setData('required', e.target.value)}
                    />
                </FieldRow>
                <FieldRow label="Unique" description="Is column unique">
                    <Switcher
                        value={data.unique}
                        handleChange={e => setData('unique', e.target.value)}
                    />
                </FieldRow>
                <FieldRow label="Placeholder" description="The placeholder of column">
                    <Input
                        className="w-full py-1.5 text-sm"
                        value={data.placeholder}
                        handleChange={e => setData('placeholder', e.target.value)}
                    />
                </FieldRow>
                <FieldRow label="Help" description="The help text to field">
                    <Textarea
                        className="w-full py-1.5 text-sm"
                        value={data.help}
                        handleChange={e => setData('help', e.target.value)}
                        rows={2}
                    />
                </FieldRow>
                <FieldRow label="Default" description="The default value of column">
                    {/* TODO: set default input ype by data.type */}
                    <Input
                        className="w-full py-1.5 text-sm"
                        value={data.default}
                        handleChange={e => setData('default', e.target.value)}
                    />
                </FieldRow>
                <FieldRow show={isType('string', 'numeric')} label={`Min ${isType('string') ? 'length' : ''}`}
                          description="Minimum characters">
                    <Input
                        type={'number'}
                        className="w-full py-1.5 text-sm"
                        value={data.min}
                        handleChange={e => setData('min', e.target.value)}
                        placeholder={0}
                    />
                </FieldRow>
                <FieldRow show={isType('string', 'numeric')} label={`Max ${isType('string') ? 'length' : ''}`}
                          description="Maximum characters allowed">
                    <Input
                        type={'number'}
                        className="w-full py-1.5 text-sm"
                        value={data.max}
                        handleChange={e => setData('max', e.target.value)}
                        placeholder="Unlimited"
                    />
                </FieldRow>
                <FieldRow show={isType('numeric')} label="Step" description="The step of number">
                    <Input
                        type={'number'}
                        className="w-full py-1.5 text-sm"
                        value={data.step}
                        handleChange={e => setData('step', e.target.value)}
                        placeholder={1}
                    />
                </FieldRow>
                <FieldRow show={isType('numeric')} label="Scale"
                          description="The scale of number - amount of zero after float">
                    <Input
                        type={'number'}
                        className="w-full py-1.5 text-sm"
                        value={data.scale}
                        handleChange={e => setData('scale', e.target.value)}
                        placeholder={0}
                    />
                </FieldRow>
                <FieldRow show={isType('relation')} label="Relation" description="The relation of column">
                    <Select
                        className="w-full text-sm"
                        value={data.relation}
                        handleChange={e => setData('relation', e.value)}
                        options={[
                            {value: 'hasOne', label: 'Has One'},
                            {value: 'hasMany', label: 'Has Many'},
                            {value: 'belongsTo', label: 'Belongs To'},
                            {value: 'belongsToMany', label: 'Belongs To Many'},
                        ]}
                    />
                </FieldRow>
            </SectionCard>

            <SectionCard label="Formatting" className="mt-10">
                <FieldRow label="Format" show={isType('date', 'time')} description="The date format of column">
                    <Input
                        className="w-full py-1.5 text-sm"
                        value={data.dateFormat}
                        handleChange={e => setData('dateFormat', e.target.value)}
                    />
                </FieldRow>
                <FieldRow label="Currency" show={data.type === 'currency'} description="The currency type">
                    <Select
                        className="w-full text-sm"
                        value={data.currency}
                        handleChange={e => setData('currency', e.value)}
                        options={currencies}
                    />
                </FieldRow>
                <FieldRow label="Prefix" description="The prefix of column">
                    <Input
                        className="w-full py-1.5 text-sm"
                        value={data.prefix}
                        handleChange={e => setData('prefix', e.target.value)}
                    />
                </FieldRow>
                <FieldRow label="Suffix" description="The suffix of column">
                    <Input
                        className="w-full py-1.5 text-sm"
                        value={data.suffix}
                        handleChange={e => setData('suffix', e.target.value)}
                    />
                </FieldRow>
            </SectionCard>

            <SectionCard label="Display" className="mt-10">
                <FieldRow label="Show in list" description="Show column in list">
                    <Switcher
                        value={data.showInList}
                        handleChange={e => setData('showInList', e.target.value)}
                    />
                </FieldRow>
                <FieldRow label="Show in detail" description="Show column in detail">
                    <Switcher
                        value={data.showInDetail}
                        handleChange={e => setData('showInDetail', e.target.value)}
                    />
                </FieldRow>
                <FieldRow label="Show in from" description={`Hide ${data?.label ?? ''} field in default form`}>
                    <Switcher
                        value={data.showInForm}
                        handleChange={e => setData('showInForm', e.target.value)}
                    />
                </FieldRow>
            </SectionCard>

        </ContainerPage>
    )
}

Column.layout = page => <Authenticated title={page.props.collection.name + ' - New Column'}>
    <App>
        <CollectionLayout>
            {page}
        </CollectionLayout>
    </App>
</Authenticated>;

export default Column
