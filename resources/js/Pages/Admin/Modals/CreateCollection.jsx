import {useForm} from "@inertiajs/inertia-react";
import EmptyModal from "@/Components/Dialogs/EmptyModal";
import Label from "@/Components/Form/Label";
import Input from "@/Components/Form/Input";
import InputError from "@/Components/Form/InputError";
import Button from "@/Components/Button";
import Textarea from "@/Components/Form/Textarea";

function CreateCollection({app, setOpen, open, onClose}) {

    const {data, setData, post, processing, errors, isDirty} = useForm(`create-collection`,  {
        name: '',
        description: '',
        slug: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('admin.apps.edit.collections.store', app.id), {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
            }
        });
    }

    function closeModal() {
        typeof onClose === "function" && onClose(false);
    }

    return (
        <EmptyModal
            open={open}
            setOpen={setOpen}
            maxWidth={'md'}
            onClose={closeModal}
        >
            <div className="w-full">
                <div className="py-3 px-4 border-b">
                    <h2 className="text-lg font-bold text-gray-600">Create new collection</h2>
                </div>
                <form className="py-4 px-6 flex flex-col gap-y-4" autoComplete={'false'} onSubmit={handleSubmit}>
                    <div>
                        <Label value="Name" className="">
                            <Input
                                id="name"
                                type="text"
                                className="mt-1 block w-full text-sm py-2"
                                value={data.name}
                                handleChange={e => setData('name', e.target.value)}
                                autoComplete={'list'}
                            />
                        </Label>
                        <InputError message={errors.name}/>
                    </div>

                    <div>
                        <Label value="Slug" className="">
                            <Input
                                id="slug"
                                type="text"
                                className="mt-1 block w-full text-sm py-2"
                                value={data.slug}
                                handleChange={e => setData('slug', e.target.value)}
                            />
                        </Label>
                        <InputError message={errors.slug}/>
                    </div>

                    <div>
                        <Label value="Description" className="">
                            <Textarea
                                id="description"
                                type="text"
                                className="mt-1 block w-full text-sm py-2"
                                value={data.description}
                                handleChange={e => setData('description', e.target.value)}
                            />
                        </Label>
                        <InputError message={errors.description}/>
                    </div>

                    <div className="flex justify-end mt-4">
                        <Button
                            processing={processing}
                            type="submit"
                        >
                           Create
                        </Button>
                    </div>
                </form>
            </div>
        </EmptyModal>
    )
}

export default CreateCollection
