import {useForm} from "@inertiajs/inertia-react";
import {useEffect} from "react";
import EmptyModal from "@/Components/Dialogs/EmptyModal";
import Label from "@/Components/Form/Label";
import Input from "@/Components/Form/Input";
import InputError from "@/Components/Form/InputError";
import Button from "@/Components/Button";
import Textarea from "@/Components/Form/Textarea";
import Select from "@/Components/Form/Select";

function Column({column, open, setOpen, onClose, collection, app}) {

    const columnData = column ?? {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        role: '',
    };

    const {data, setData, post, processing, errors, isDirty, setDefaults, clearErrors} = useForm(`column-table`,  columnData);

    useEffect(() => {
        setData(columnData);
    } , [column?.id]);

    useEffect(() => {
        setDefaults();
    }, [data?.id]);

    function onInputChange(name, value) {
        setData(name, value);
        clearErrors(name);
    }

    function handleSubmit(e) {
        e.preventDefault();
        post(route('admin.apps.edit.collections.columns.store', {
            app: app.id,
            collection: collection.id,
        }), {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
            }
        });
    }

    function closeModal() {
        clearErrors();
        setData(columnData);
        typeof onClose === "function" && onClose(false);
    }

    function updateName() {
        if (!data?.name && data.label) {
            const nameValue = data.label.toLowerCase().replace(/[^a-zA-Z0-9]*/g, '_');
            /^[A-Za-z0-9_]*$/.test(data.label) && onInputChange('name', nameValue);
        }
    }

    return (
        <EmptyModal
            open={open}
            setOpen={setOpen}
            maxWidth={'5xl'}
            onClose={closeModal}
        >
            <div className="w-full">
                <div className="py-3 px-4 border-b">
                    <h2 className="text-lg font-bold text-gray-600">{column?.id ? 'Edit' : 'Create new'} column</h2>
                </div>
                <form className="py-4 px-6 flex flex-col gap-y-4" autoComplete={'off'} onSubmit={handleSubmit}>
                    <div className="grid grid-cols-6 gap-4">
                        <div className="col-span-2">
                            <Label value="Label" className="">
                                <Input
                                    id="label"
                                    type="text"
                                    name="label"
                                    handleChange={e => onInputChange('label', e.target.value)}
                                    value={data.label}
                                    className="mt-1 block w-full text-sm py-2"
                                    autoComplete="list"
                                    onBlur={updateName}
                                />
                            </Label>
                            <InputError message={errors?.label} />
                        </div>

                        <div className="col-span-2">
                            <Label value="Name" className="">
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    handleChange={e => onInputChange('name', e.target.value)}
                                    value={data.name}
                                    className="mt-1 block w-full text-sm py-2"
                                    autoComplete="list"
                                />
                            </Label>
                            <InputError message={errors.name} />
                        </div>

                        <div className="col-span-2">
                            <Label value="Type" className="">
                                <Select
                                    id="type"
                                    type="text"
                                    name="type"
                                    handleChange={e => onInputChange('type', e)}
                                    options={[
                                        {value: 'text', label: 'Text'},
                                        {value: 'textarea', label: 'Textarea'},
                                        {value: 'number', label: 'Number'},
                                        {value: 'date', label: 'Date'},
                                        {value: 'date_time', label: 'Date Time'},
                                        {value: 'time', label: 'Time'},
                                        {value: 'select', label: 'Select'},
                                        {value: 'checkbox', label: 'Checkbox'},
                                        {value: 'acceptance', label: 'Acceptance'},
                                        {value: 'radio', label: 'Radio'},
                                        {value: 'file', label: 'File'},
                                        {value: 'image', label: 'Image'},
                                        {value: 'currency', label: 'Currency'},
                                        {value: 'percentage', label: 'Percentage'},
                                        {value: 'url', label: 'URL'},
                                        {value: 'email', label: 'Email'},
                                        {value: 'password', label: 'Password'},
                                        {value: 'phone', label: 'Phone'},
                                        {value: 'color', label: 'Color'},
                                        {value: 'range', label: 'Range'},
                                        {value: 'address', label: 'Address'},
                                        {value: 'relationship', label: 'Relationship'},
                                        {value: 'as', label: 'AS'},
                                    ]}
                                    value={data.type}
                                    className="mt-1 block w-full text-sm"
                                    autoComplete="list"
                                />
                            </Label>
                            <InputError message={errors.type} />
                        </div>

                        <div className="col-span-2">
                            <Label value="Description" className="">
                                <Textarea
                                    id="description"
                                    type="text"
                                    name="description"
                                    handleChange={e => setData('description', e.target.value)}
                                    value={data.description}
                                    className="mt-1 block w-full text-sm py-2"
                                    autoComplete="list"
                                />
                            </Label>
                        </div>

                        {['number', 'text', 'textarea'].includes(data.type?.value) &&
                            <>
                                <div className="col-span-2">
                                    <Label value="Max length" className="">
                                        <Input
                                            id="max"
                                            type="text"
                                            name="max"
                                            handleChange={e => onInputChange('max', e.target.value)}
                                            value={data.max}
                                            className="mt-1 block w-full text-sm py-2"
                                            autoComplete="list"
                                        />
                                    </Label>
                                    <InputError message={errors.max} />
                                </div>

                                <div className="col-span-2">
                                    <Label value="Min length" className="">
                                        <Input
                                            id="min"
                                            type="text"
                                            name="min"
                                            handleChange={e => onInputChange('min', e.target.value)}
                                            value={data.min}
                                            className="mt-1 block w-full text-sm py-2"
                                            autoComplete="list"
                                        />
                                    </Label>
                                    <InputError message={errors.min} />
                                </div>
                            </>
                        }
                    </div>

                    <div className="flex justify-end mt-4">
                        <Button
                            processing={processing}
                            type="submit"
                        >
                            {column?.id ? 'Save' :'Create'}
                        </Button>
                    </div>
                </form>
            </div>
            {isDirty && 'You have unsaved changes'}
        </EmptyModal>
    )
}

export default Column
