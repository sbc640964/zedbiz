import {useForm} from "@inertiajs/inertia-react";
import Authenticated from "@/Layouts/Authenticated";
import App from "@/Layouts/App";
import Button from "@/Components/Button";
import SectionCard from "@/Components/Card/SectionCard";
import ContainerPage from "@/Components/Table/ContainerPage";
import FieldRow from "@/Components/Form/FieldRow";
import Input from "@/Components/Form/Input";
import {v4 as uuid} from 'uuid';
import Textarea from "@/Components/Form/Textarea";
import {set} from "lodash";
import MenuItem from "@/Components/Admin/MenuItem";
import NavLink from "@/Components/NavLink";
import {useState} from "react";
import {Inertia} from "@inertiajs/inertia";

function NewMenu({app, menu, contentOptions}) {

    function newItem (items = null) {
        return {
            id: uuid(),
            label: 'Item ' + (items ? items.length + 1 : 1),
            description: '',
            type: 'link',
            icon: 'computer-desktop',
            children: [],
            badge: {},
            slug: '',
        }
    }

    const [activeItem, setActiveItem] = useState(null);

    const {data, setData:sd, post, put, processing, errors, reset} = useForm(menu ?? {
        is_active: true,
        label: '',
        description: '',
        items: [newItem()],
        settings: {
        },
    });

    function handleSubmit() {
        data?.id
            ? put(route('admin.apps.edit.menu.update', {app: app.id, menu: data.id}))
            : post(route('admin.apps.edit.menu.store', app.id));
    }

    function deleteMenu() {
        if (confirm('Are you sure you want to delete this menu?')) {
            Inertia.delete(route('admin.apps.edit.menu.destroy', {app: app.id, menu: data.id}));
        }
    }

    function setData(key, value) {
        return sd(prev => ({...set(prev, key, value)}));
    }

    return (
        <ContainerPage
            label={menu?.name ?? 'New Menu'}
            className="bg-transparent shadow-none !rounded-none overflow-visible border-0"
            actions={[
                <Button
                    color="success"
                    action={() => handleSubmit()}
                >
                    {menu?.id ? 'Update menu' : 'Create menu'}
                </Button>,
                menu?.id ?
                    <Button
                        color="danger"
                        action={deleteMenu}
                    >
                        Delete menu
                    </Button>
                    : null
            ]}
        >
            <SectionCard label="General">
                <FieldRow label="Label">
                    <Input
                        type="text"
                        className="w-full py-1.5"
                        value={data.label}
                        handleChange={e => setData('label', e.target.value)}
                    />
                </FieldRow>
                <FieldRow label="Description" error={errors.description}>
                    <Textarea
                        className="w-full py-1.5"
                        rows={2}
                        value={data.description}
                        handleChange={e => setData('description', e.target.value)}
                    />
                </FieldRow>
            </SectionCard>

            <div className="flex mt-10 rounded-lg overflow-hidden border border-gray-300">
                <div className="bg-white w-80 p-4">
                    <div className="flex flex-col space-y-1">
                        {data.items.map((item, index) => (
                            <NavLink
                                icon={item.icon}
                                key={item.id}
                                as={'a'}
                                className="cursor-pointer"
                                onClick={() => setActiveItem(item.id)}
                                active={activeItem === item.id}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                    <div className="border-t pt-4 mt-4">
                        <Button
                            action={() => setData( 'items', [...data.items, newItem(data.items)] )}
                        >
                            Add item
                        </Button>
                    </div>
                </div>
                <div className="flex-1 p-4">
                    {activeItem ? (
                        <MenuItem
                            app={app}
                            item={data.items.find(item => item.id === activeItem)}
                            setData={(key, value) => setData('items.' + data.items.findIndex(item => item.id === activeItem) + '.' + key, value)}
                            contentOptions={contentOptions}
                            remove={() => {
                                setData('items', data.items.filter(item => item.id !== activeItem))
                                setActiveItem(null)
                            }}
                        />
                    ) : (
                        <div className="text-center text-gray-400">
                            Select an item to edit
                        </div>
                    )}
                </div>
            </div>
        </ContainerPage>
    )
}

NewMenu.layout = page => <Authenticated title={'Menus'}>
    <App children={page}/>
</Authenticated>;

export default NewMenu
