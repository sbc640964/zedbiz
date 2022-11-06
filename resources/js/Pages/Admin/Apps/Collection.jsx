import Authenticated from "@/Layouts/Authenticated";
import App from "@/Layouts/App";
import ContainerPage from "@/Components/Table/ContainerPage";
import CollectionLayout from "@/Layouts/CollectionLayout";
import {collect} from "collect.js";
import {useEffect, useState} from "react";
import SectionCard from "@/Components/Card/SectionCard";
import Input from "@/Components/Form/Input";
import RealFieldRow from "@/Pages/Admin/Apps/RealFieldRow";
import Textarea from "@/Components/Form/Textarea";
import {get, last, upperFirst} from "lodash";
import Switcher from "@/Components/Form/Switcher";
import IconPicker from "@/Components/Form/IconPicker";
import Select from "@/Components/Form/Select";
import FieldRow from "@/Components/Form/FieldRow";
import MenuItem from "@/Components/Admin/MenuItem";
import NavLink from "@/Components/NavLink";
import Button from "@/Components/Button";
import MenuCollection from "@/Components/Admin/MenuCollection";
import Dropdown from "@/Components/Dropdown";
import Icon from "@/Components/Icon";
import Import from "@/Pages/Admin/Modals/Import";
import DropdownCollectionActions from "@/Components/DropdownCollectionActions";

function Collection(props) {

    const {collection, app, errors} = props;
    const [errorsBag, setErrorsBag] = useState(errors ?? {});
    const [openImportModal, setOpenImportModal] = useState(false);

    useEffect(() => {
        setErrorsBag(errors ?? {});
    }, [errors]);


    function clearError(e) {
        setErrorsBag(collect(errorsBag).filter((error, key) => key !== e.target.name).all());
    }

    const urlUpdate = route('admin.apps.edit.collections.update', {
        app: app.id,
        collection: collection.id
    });


    const fieldRowProps = (name, boolean = false, defaultValue = null, label = null) =>({
        label: label ?? upperFirst(last(name.split('.'))).replace('_', ' '),
        name,
        error: get(errorsBag, name, null),
        urlUpdate,
        value: get(collection, name, boolean ? false : defaultValue ?? ''),
    });

    return (
        <>

            <ContainerPage
                label={collection.name}
                className="bg-transparent shadow-none !rounded-none overflow-visible border-0"
                actions={[
                    <DropdownCollectionActions setOpenImportModal={setOpenImportModal}/>
                ]}
            >
                <SectionCard label="General">
                    <RealFieldRow {...fieldRowProps("name")}>
                        <Input type="text" className="py-1.5 w-full"/>
                    </RealFieldRow>
                    <RealFieldRow {...fieldRowProps("slug")}>
                        <Input type="text" className="py-1.5 w-full"/>
                    </RealFieldRow>
                    <RealFieldRow {...fieldRowProps("description")}>
                        <Textarea className="w-full"/>
                    </RealFieldRow>
                    <RealFieldRow {...fieldRowProps("settings.singular_label")}>
                        <Input type="text" className="py-1.5 w-full"/>
                    </RealFieldRow>
                    <RealFieldRow {...fieldRowProps("settings.plural_label")}>
                        <Input type="text" className="py-1.5 w-full"/>
                    </RealFieldRow>
                </SectionCard>

                <SectionCard label="Menu" className="mt-10">
                    <RealFieldRow {...fieldRowProps("settings.menu.enable")}>
                        <Switcher/>
                    </RealFieldRow>
                    {collection.settings?.menu?.enable &&
                        <>
                            <RealFieldRow {...fieldRowProps("settings.menu.icon", null, 'bookmark')}>
                                <IconPicker/>
                            </RealFieldRow>
                            <RealFieldRow {...fieldRowProps("settings.menu.label")}>
                                <Input type="text" className="py-1.5 w-full"/>
                            </RealFieldRow>
                            <RealFieldRow {...fieldRowProps("settings.menu.is_simple", true)}>
                                <Switcher/>
                            </RealFieldRow>
                            <RealFieldRow {...fieldRowProps("settings.menu.list")} show={collection.settings?.menu?.is_simple}>
                                <Select
                                    isAsync
                                    defaultOptions
                                    url={route('admin.apps.edit.collections.picker_lists', {
                                        app: app.id,
                                        collection: collection.id
                                        })}
                                />
                            </RealFieldRow>
                            <RealFieldRow {...fieldRowProps("settings.menu.new_form")} show={collection.settings?.menu?.is_simple}>
                                <Select
                                    isAsync
                                />
                            </RealFieldRow>
                            <RealFieldRow {...fieldRowProps("settings.menu.form_mode")} show={collection.settings?.menu?.is_simple}>
                                <Select options={[
                                    {value: 'redirect', label: 'Redirect'},
                                    {value: 'modal', label: 'Modal'},
                                ]}/>
                            </RealFieldRow>
                            {!collection.settings.menu?.is_simple &&
                                <MenuCollection collection={collection} app={app}/>
                            }
                        </>
                    }
                </SectionCard>
            </ContainerPage>

            <Import collection={collection} app={app} open={openImportModal} onClose={() => setOpenImportModal(false)}/>
        </>
    )
}

Collection.layout = page => <Authenticated title={page.props.collection.name}>
    <App>
        <CollectionLayout>
            {page}
        </CollectionLayout>
    </App>
</Authenticated>;

export default Collection
