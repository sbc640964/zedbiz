import EmptyModal from "@/Components/Dialogs/EmptyModal";
import {useForm} from "@inertiajs/inertia-react";
import ComposerField from "@/Pages/Shared/ComposerField";
import Button from "@/Components/Button";
import {get, isEqual, set} from "lodash";
import {collect} from "collect.js";
import {appUrlName} from "@/helpers";
import {v4 as uuid} from "uuid";
import {useState} from "react";
import moment from "moment/moment";

function FormCollectionModal({open, setOpen, onClose, record, app, list, form, collection, extraSettings = [], relationships = {}}) {

    const [defaults] = useState(getDefaultValues());

    const {post, put, setData, data, reset, errors, isDirty} = useForm( getInitialValues() );

    function getInitialValues() {
        return _.cloneDeep(record?.id
            ? {...record}
            : getDefaultValues());
    }

    function getDefaultValue(type, defaultValue) {
        switch (type) {
            case 'date':
            case 'datetime':
            case 'time':
                switch (defaultValue) {
                    case '{{NOW}}':
                        return moment().format(type === 'date' ? 'YYYY-MM-DD' : (type === 'time' ? 'HH:mm' : 'YYYY-MM-DD HH:mm'));
                    default:
                        return defaultValue;

                }
        }
        return defaultValue;
    }

    function getDefaultValues(_collection = null) {
        const collection = _collection ?? form;
        return {...collect(collection.columns).mapWithKeys((column) => {
            return [column.name, getDefaultValue(column.type, extraSettings?.[column.id]?.defaultValue ??  column?.default ?? '')];
        }).prepend({},'__extra_sections__').all(), ...(typeof record === 'object' ? record : {})};
    }

    function getData(key) {
        return get(data, key, '');
    }

    function onSuccess() {
        reset();
        typeof onClose === 'function' && onClose();
        setOpen(false);
    }

    function handleSubmit(e) {

        e.preventDefault();

        const isAdmin = route().current('admin.*');

        if(typeof record === 'object' && record?.id) {
            put(appUrlName('collections.records.update', {app: app?.id, form:form.id, record:data.id}), {
                preserveState: true,
                preserveScroll: true,
                onSuccess
            });

        } else {
            post(appUrlName('collections.records.store', {app: app?.id, form:form.id}), {
                preserveState: true,
                preserveScroll: true,
                onSuccess
            });
        }
    }

    function addExtraSection(section, index, collectionExtra) {
        const extraSections = getData('__extra_sections__');

        const newItem = {...getDefaultValues(collectionExtra), id: uuid(),};

        if(section.collection === section.column.name){
            newItem[section.column.name] = data?.id ?? '{{PRIMARY_RECORD_ID}}';
        }
        const newExtraSections = {...extraSections, [index]: [
                ...(extraSections[index] ?? []),
                newItem
            ]};

        setData('__extra_sections__', newExtraSections);
    }

    function removeExtraSection(index, indexSection) {
        const extraSections = getData('__extra_sections__');
        const newExtraSections = {...extraSections, [index]: extraSections[index].filter((item, i) => i !== indexSection)};
        setData('__extra_sections__', newExtraSections);
    }

    return (
        <EmptyModal
            open={open}
            setOpen={setOpen}
            //onClose={() => typeof onClose === 'function' && onClose()}
        >
            <div className="w-full">
                <div className="py-3 px-4 border-b">
                    <h2 className="text-lg font-bold text-gray-600">Create {collection?.settings?.singular_label ?? 'Item'}</h2>
                </div>

                <div className="py-4 px-6 flex flex-col gap-y-4">
                    <div>
                        <form onSubmit={handleSubmit}>
                            {form.columns.filter(v => !extraSettings?.[v.id]?.hidden).map((column, index) => (
                                <div key={index} className="mb-4">
                                    <ComposerField
                                        autoFocus={index === 0}
                                        fieldSettings={column}
                                        value={getData(column.name)}
                                        handleChange={(e) => setData(column.name, e?.target?.value ?? e.value ?? e)}
                                        errors={errors[column.name]}
                                        form={form}
                                        app={app}
                                        record={record}
                                    />
                                </div>
                            ))}

                            {(relationships?.config ?? []).map((section, index) => {
                                const collectionExtra = collect(relationships?.objects ?? []).first((v) => v.id === section.collection);

                                if(!collectionExtra) {
                                    return null;
                                }

                                return (
                                    <div key={index} className="pt-4">
                                        <h3 className="text-lg font-bold text-gray-600">{collectionExtra.settings?.plural_label ?? collectionExtra.name}</h3>
                                        {data?.__extra_sections__?.[index]?.map((item, indexRepeater) => (
                                            <div key={item.id} className="mb-4 p-4 border rounded-lg relative">
                                                <span className="absolute top-0 right-0">
                                                    <Button
                                                        as="span"
                                                        icon="trash"
                                                        color="danger"
                                                        negative
                                                        iconType="outline"
                                                        size="sm"
                                                        action={() => removeExtraSection(index, indexRepeater)}
                                                    />
                                                </span>
                                                {collectionExtra.columns.filter(v => !extraSettings?.[v.id]?.hidden).map((column, indexField) => {
                                                    if(section.column.collection === section.collection && section.column.name === column.name) {
                                                        return null;
                                                    }
                                                    return (
                                                        <div key={indexField} className="mb-4 last:mb-0">
                                                            <ComposerField
                                                                fieldSettings={column}
                                                                value={getData(`__extra_sections__.${index}.${indexRepeater}.${column.name}`)}
                                                                handleChange={(e) => {
                                                                    setData('__extra_sections__', set(getData('__extra_sections__'), `${index}.${indexRepeater}.${column.name}`, e?.target?.value ?? e.value ?? e))
                                                                }}
                                                                errors={errors[column.name]}
                                                                form={collectionExtra}
                                                                app={app}
                                                                record={record}
                                                            />
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        ))}
                                        <Button as="span" size="sm" action={() => addExtraSection(section, index, collectionExtra)}>Add {collectionExtra.settings?.singular_label ?? 'Item'}</Button>
                                    </div>
                                )
                            })}

                            <div className="flex justify-end">
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isEqual(defaults, data)}
                                >
                                    {data.id ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </EmptyModal>
    )
}

export default FormCollectionModal
