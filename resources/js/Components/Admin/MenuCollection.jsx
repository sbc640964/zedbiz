import {useState} from "react";
import NavLink from "@/Components/NavLink";
import Button from "@/Components/Button";
import Input from "@/Components/Form/Input";
import Label from "@/Components/Form/Label";
import {useForm} from "@inertiajs/inertia-react";
import Select from "@/Components/Form/Select";

function MenuCollection({collection, app, fieldRowProps}) {

    const [addMode, setAddMode] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);

    const {data, setData, post, processing} = useForm({
        label: '',
        url: '',
        target: '_self',
    });

    function handleAddNewSubmit() {
        post(route('admin.apps.edit.collections.store_menu', {
            app: app.id,
            collection: collection.id,
        }), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setAddMode(false);
                setActiveMenu(null);
            }
        });
    }

    return (
        <div className="flex h-96">
            <div className="w-80 justify-between flex flex-col h-full shadow-2xl shadow-gray-300 z-10">
                <div className="p-4">
                    <NavLink
                        isOpen
                        icon={collection.settings?.menu?.icon}
                        as={'a'}
                        className="cursor-pointer"
                        links={collection.settings?.menu?.links}
                        // onClick={() => setActiveItem(item.id)}
                        // active={activeItem === item.id}
                    >
                        {collection.settings?.menu?.label}
                    </NavLink>
                </div>
                <div>
                    <Button
                        className="bottom-0 right-0 m-4"
                        icon="plus"
                        action={() => setAddMode(true)}
                    >
                        Add item
                    </Button>
                </div>
            </div>
            <div className="flex-1 bg-gray-100 h-full">
                {addMode && (
                    <div className="flex flex-col h-full">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold p-4">Add item</h2>
                            <div className="p-4 flex flex-col space-y-4">
                                <Label value="Label">
                                    <Input
                                        type="text"
                                        className="py-1.5 w-full"
                                        name="label"
                                        value={data.label}
                                        handleChange={e => setData('label', e.target.value)}
                                    />
                                </Label>
                                <Label value="Content">
                                    <Select
                                        isAsync
                                        url={route('admin.apps.edit.collections.picker_all', {
                                            app: app.id,
                                            collection: collection.id
                                        })}
                                        defaultOptions
                                        handleChange={e => setData('content', e?.value ?? e)}
                                    />
                                </Label>

                                <div className="pt-4">
                                    <Button
                                        action={() => handleAddNewSubmit()}
                                        loadingAtProcessing
                                        processing={processing}
                                    >
                                        Add
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MenuCollection
