import EmptyModal from "@/Components/Dialogs/EmptyModal";
import {useForm} from "@inertiajs/inertia-react";
import Label from "@/Components/Form/Label";
import Input from "@/Components/Form/Input";
import Button from "@/Components/Button";
import InputError from "@/Components/Form/InputError";
import {useEffect} from "react";

function User({user, open, setOpen, onClose}) {

    const userData = user ?? {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        role: '',
    };

    const {data, setData, post, processing, errors, isDirty, setDefaults} = useForm(`create-admin-user`,  userData);

    useEffect(() => {
        setData(userData);
    } , [user?.id]);

    useEffect(() => {
        setDefaults();
    }, [data?.id]);

    function handleSubmit(e) {
        e.preventDefault();
        const isAdmin = route().current('admin.*');
        const isApp = route().current('admin.apps.*');

        const url = isAdmin
            ? (isApp ? route('admin.apps.edit.users.store', route().params) : route('admin.users.store'))
            : route('users.store');

        post(url, {
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
                    <h2 className="text-lg font-bold text-gray-600">{user?.id ? 'Edit' : 'Create new'} user</h2>
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
                        <Label value="Email" className="mt-1">
                            <Input
                                id="email"
                                type="email"
                                className="block w-full text-sm py-2"
                                value={data.email}
                                handleChange={e => setData(values => ({...values, email: e.target.value}))}
                                autoComplete={'false'}
                            />
                        </Label>
                        <InputError message={errors.email}/>
                    </div>

                    <div>
                        <Label value="Password" className="">
                            <Input
                                id="password"
                                type="password"
                                className="mt-1 block w-full text-sm py-2"
                                value={data.password}
                                handleChange={e => setData(values => ({...values, password: e.target.value}))}
                                autoComplete={'new-password'}
                            />
                        </Label>
                        <InputError message={errors.password}/>
                    </div>

                    <div>
                        <Label value="Confirm password" className="">
                            <Input
                                id="password_confirmation"
                                type="password"
                                className="mt-1 block w-full text-sm py-2"
                                value={data.password_confirmation}
                                handleChange={e => setData(values => ({
                                    ...values,
                                    password_confirmation: e.target.value
                                }))}
                            />
                        </Label>
                        <InputError message={errors.password_confirmation}/>
                    </div>

                    <div>
                        <Label value="Phone" className="">
                            <Input
                                id="phone"
                                type="text"
                                className="mt-1 block w-full text-sm py-2"
                                value={data.phone}
                                handleChange={e => setData(values => ({...values, phone: e.target.value}))}
                            />
                        </Label>
                        <InputError message={errors.phone}/>
                    </div>

                    <div className="flex justify-end mt-4">
                        <Button
                            processing={processing}
                            type="submit"
                        >
                            {user?.id ? 'Save' :'Create'}
                        </Button>
                    </div>
                </form>
            </div>
            {isDirty && 'You have unsaved changes'}
        </EmptyModal>
    )
}

export default User
