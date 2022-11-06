import EmptyModal from "@/Components/Dialogs/EmptyModal";
import {useForm} from "@inertiajs/inertia-react";
import Label from "@/Components/Form/Label";
import Input from "@/Components/Form/Input";
import Button from "@/Components/Button";
import InputError from "@/Components/Form/InputError";
import {useEffect} from "react";
import Textarea from "@/Components/Form/Textarea";
import ImageInput from "@/Components/Form/ImageInput";

function App({app, open, setOpen, onClose}) {

    const appData = app ?? {
        name: '',
        description: '',
        domain: '',
        brand: null,
    };

    const {data, setData, post, processing, errors, isDirty, setDefaults, reset} = useForm(`create-app`,  appData);

    useEffect(() => {
        setData(appData);
    } , [app?.id, open]);

    useEffect(() => {
        setDefaults();
    }, [data?.id]);

    function handleSubmit(e) {
        e.preventDefault();
        post(route('admin.apps'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                reset()
                setOpen(false);
            }
        });
    }

    function closeModal() {
        //TODO: update to alert if form is dirty
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
                    <h2 className="text-lg font-bold text-gray-600">{app?.id ? 'Edit' : 'Create new'} app</h2>
                </div>
                <form className="py-4 px-6 flex flex-col gap-y-4" autoComplete={'false'} onSubmit={handleSubmit}>
                    <div>
                        <Label value="Name" className="">
                            <Input
                                id="name"
                                type="text"
                                className="mt-1 block w-full text-sm py-2"
                                value={data.name}
                                handleChange={e => setData(values => ({...values, name: e.target.value}))}
                                autoComplete={'false'}
                            />
                        </Label>
                        <InputError message={errors.name}/>
                    </div>

                    <div>
                        <Label value="Description" className="mt-1">
                            <Textarea
                                id="description"
                                className="block w-full text-sm py-2"
                                value={data.description}
                                handleChange={e => setData(values => ({...values, description: e.target.value}))}
                                autoComplete={'false'}
                            />
                        </Label>
                        <InputError message={errors.description}/>
                    </div>

                    <div>
                        <Label value="Domain" className="mt-1">
                            <div className="flex items-end">
                                <div className="flex-grow">
                                    <Input
                                        id="domain"
                                        type="text"
                                        className="mt-1 block w-full text-sm py-2"
                                        value={data.domain}
                                        handleChange={e => setData(values => ({...values, domain: e.target.value}))}
                                        autoComplete={'false'}
                                    />
                                </div>
                                <span className="text-gray-500 px-2">.app.com</span>
                            </div>
                        </Label>
                    </div>

                    <div>
                        <Label value="Brand" className="mt-1">
                            <ImageInput
                                id="brand"
                                type="text"
                                className="mt-1 block w-full text-sm py-2"
                                value={data.brand}
                                handleChange={e => setData(values => ({...values, brand: e.target.files[0]}))}
                                autoComplete={'false'}
                            />
                        </Label>
                        <InputError message={errors.brand}/>
                    </div>

                    <div className="flex justify-end mt-4">
                        <Button
                            processing={processing}
                            type="submit"
                        >
                            {app?.id ? 'Save' :'Create'}
                        </Button>
                    </div>
                </form>
            </div>
        </EmptyModal>
    )
}

export default App
