import EmptyModal from "@/Components/Dialogs/EmptyModal";
import {useForm} from "@inertiajs/inertia-react";
import Input from "@/Components/Form/Input";
import Label from "@/Components/Form/Label";
import InputError from "@/Components/Form/InputError";
import Textarea from "@/Components/Form/Textarea";
import Select from "@/Components/Form/Select";
import Switcher from "@/Components/Form/Switcher";
import {CalendarDaysIcon, ChartPieIcon, RectangleGroupIcon, TableCellsIcon} from "@heroicons/react/24/outline";
import Button from "@/Components/Button";
import {v4 as uuid} from 'uuid';

function CreatePage({ app, collection, setOpen, open, onClose }) {

    const { data, setData, post, processing, errors, isDirty, reset } = useForm(`create-page-` + uuid(), {
        collection_id: collection?.id ?? null,
        name: '',
        description: '',
        type: 'dashboard',
        is_singular: false,
    });

    function closeModal() {
        reset();
        typeof onClose === "function" && onClose(false);
    }

    function handleSubmit(e, close) {
        e.preventDefault();
        post(route('admin.apps.edit.pages.store', app.id), {
            preserveScroll: true,
            onSuccess: () => {
                close();
            }
        });
    }

    return (
        <EmptyModal
            open={open}
            setOpen={setOpen}
            maxWidth={'md'}
            onClose={closeModal}
            title={'Create new page'}
        >
            {({close}) => (
                <form className="py-4 flex flex-col gap-y-4" autoComplete={'false'} onSubmit={handleSubmit}>
                    <div className="w-full">
                        <div className="flex flex-col gap-y-4 px-5">
                            <div>
                                <Label value="Type" className="">
                                    <Select
                                        value={data.type}
                                        handleChange={e => setData('type', e.value ?? e)}
                                        options={[
                                            {value: 'dashboard', label: 'Widgets page', icon: ChartPieIcon},
                                            {value: 'calendar', label: 'Calendar page', icon: CalendarDaysIcon, isDisabled: true},
                                            {value: 'kanban', label: 'Kanban page', icon: RectangleGroupIcon, isDisabled: true},
                                            {value: 'table', label: 'Table page', icon: TableCellsIcon, isDisabled: true},
                                        ]}
                                        // isDisabled
                                    />
                                </Label>
                            </div>
                            <div>
                                <Label value="Name" className="">
                                    <Input
                                        type="text"
                                        className="mt-1 block w-full text-sm py-2"
                                        value={data.name}
                                        handleChange={e => setData('name', e.target.value)}
                                        autoComplete={'off'}
                                    />
                                </Label>
                                <InputError message={errors.name}/>
                            </div>
                            <div>
                                <Label value="Description" className="">
                                    <Textarea
                                        className="mt-1 block w-full text-sm py-2"
                                        value={data.description}
                                        handleChange={e => setData('description', e.target.value)}
                                        autoComplete={'off'}
                                    />
                                </Label>
                            </div>
                            {(collection?.id ?? false) &&
                                <div>
                                    <Label value="Collection">
                                        <Select
                                            value={data.collection_id}
                                        />
                                    </Label>
                                </div>
                            }
                            {data.collection_id &&
                                <div>
                                    <Label value="Is singular">
                                        <Switcher
                                            value={data.is_singular}
                                            handleChange={e => setData('is_singular', e.target.value)}
                                        />
                                    </Label>
                                </div>
                            }
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-end px-5">
                            <Button
                                color="secondary"
                                negative
                                className="mr-2 border"
                                action={close}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-blue-600 hover:bg-blue-700"
                                action={e => handleSubmit(e, close)}
                                loading={processing}
                                disabled={!isDirty}
                            >
                                Create
                            </Button>
                        </div>
                    </div>
                </form>
            )}
        </EmptyModal>
    )
}

export default CreatePage
