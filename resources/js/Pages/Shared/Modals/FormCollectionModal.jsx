import EmptyModal from "@/Components/Dialogs/EmptyModal";
import {useForm} from "@inertiajs/inertia-react";
import ComposerField from "@/Pages/Shared/ComposerField";
import Button from "@/Components/Button";
import {get} from "lodash";
import {collect} from "collect.js";
import {appUrlName} from "@/helpers";

function FormCollectionModal({open, setOpen, onClose, record, app, list, form, collection, extraSettings = []}) {

    const {post, put, setData, data, reset, errors, isDirty} = useForm(  ...getInitialValues() );

    function getInitialValues() {
        return record?.id
            ? [record]
            : [getDefaultValues()];
    }

    function getDefaultValues() {
        return {...collect(form.columns).mapWithKeys((column) => {
            return [column.name, extraSettings?.[column.id]?.defaultValue ??  column?.default ?? ''];
        }).all(), ...(typeof record === 'object' ? record : {})};
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

    return (
        <EmptyModal
            open={open}
            setOpen={setOpen}
            // onClose={() => typeof onClose === 'function' && onClose()}
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

                            <div className="flex justify-end">
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!isDirty}
                                >
                                    Save
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
