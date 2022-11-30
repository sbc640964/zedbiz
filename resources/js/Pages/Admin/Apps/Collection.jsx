import Authenticated from "@/Layouts/Authenticated";
import App from "@/Layouts/App";
import ContainerPage from "@/Components/Table/ContainerPage";
import CollectionLayout from "@/Layouts/CollectionLayout";
import {useEffect, useState} from "react";
import SectionCard from "@/Components/Card/SectionCard";
import Input from "@/Components/Form/Input";
import RealFieldRow from "@/Pages/Admin/Apps/RealFieldRow";
import Textarea from "@/Components/Form/Textarea";
import {get, last, upperFirst} from "lodash";
import Switcher from "@/Components/Form/Switcher";
import IconPicker from "@/Components/Form/IconPicker";
import Select from "@/Components/Form/Select";
import MenuCollection from "@/Components/Admin/MenuCollection";
import Import from "@/Pages/Admin/Modals/Import";
import DropdownCollectionActions from "@/Components/DropdownCollectionActions";
import Button from "@/Components/Button";
import {Inertia} from "@inertiajs/inertia";
import Alert from "@/Components/Alert";
import {InertiaLink} from "@inertiajs/inertia-react";
import {collect} from "collect.js";

function Collection(props) {

    const {collection, app, errors, collections} = props;
    const [errorsBag, setErrorsBag] = useState(errors ?? {});
    const [openImportModal, setOpenImportModal] = useState(false);

    useEffect(() => {
        setErrorsBag(errors ?? {});
    }, [errors]);


    // function clearError(e) {
    //     setErrorsBag(collect(errorsBag).filter((error, key) => key !== e.target.name).all());
    // }

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

    function migrate() {
        Inertia.post(route('admin.apps.edit.collections.migrate', {
            app: app.id,
            collection: collection.id
        }));
    }

    function getSectionsFormOptions() {
        const options = [];

        collect(collections).each(c => {
            if(c.id !== collection.id) {
                const columnsRelations = collect(c.columns).filter(c => c.type === 'relation' && c.relationTable === collection.id);
                if(columnsRelations.count() > 0) {
                    columnsRelations.each(cr => {
                        options.push({
                            label: `${c.name} (${cr.unique ? 'Unique' : 'Multiple'})`,
                            subtext: `Column foreign key: ${cr.name}`,
                            value: {
                                collection: c.id,
                                column: {
                                    collection: c.id,
                                    id: cr.id,
                                    name: cr.name
                                }
                            },
                        });
                    });
                }
            }
        });

        const columnsRelations = collect(collection.columns).filter(c => c.type === 'relation');

        if(columnsRelations.count() > 0) {
            columnsRelations.each(cr => {
                const collectionRelation = collect(collections).first(c => c.id === cr.relationTable);
                options.push({
                    label: `${collectionRelation.name} (Unique)`,
                    subtext: `Column foreign key: ${cr.name}`,
                    value: {
                        collection: collectionRelation.id,
                        column: {
                            id: cr.id,
                            name: cr.name,
                            collection: collection.id
                        }
                    }
                });
            });
        }

        return options;
    }

    return (
        <>
            <ContainerPage
                label={collection.name}
                className="bg-transparent shadow-none !rounded-none overflow-visible border-0"
                actions={[
                    collection.has_table ? <DropdownCollectionActions setOpenImportModal={setOpenImportModal}/> : null,
                    collection.columns?.length > 0 && collection?.have_update_table ? <Button color="danger" negative className="hover:bg-red-100" action={() => migrate()}>Migrate</Button> : null
                ]}
            >
                <Alert type="warning" className="mb-4" show={collection.columns?.length <= 0}>
                    You have not added any columns to the collection yet, <InertiaLink href={route('admin.apps.edit.collections.columns.create', {app: app.id, collection: collection.id})} className="text-blue-500 hover:underline">Add column</InertiaLink>
                </Alert>

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
                                    placeholder="Default list"
                                />
                            </RealFieldRow>
                            <RealFieldRow {...fieldRowProps("settings.menu.new_form")}
                                          show={collection.settings?.menu?.is_simple}>
                                <Select
                                    isAsync
                                    placeholder="Default form"
                                />
                            </RealFieldRow>
                            <RealFieldRow {...fieldRowProps("settings.menu.new_form_sections")}
                                            show={collection.settings?.menu?.is_simple}>
                                <Select
                                    isMulti
                                    placeholder="Choose sections"
                                    options={getSectionsFormOptions()}
                                />
                            </RealFieldRow>

                            <RealFieldRow {...fieldRowProps("settings.menu.form_mode")}
                                          show={collection.settings?.menu?.is_simple}>
                                <Select options={[
                                    {value: 'redirect', label: 'Redirect'},
                                    {value: 'modal', label: 'Modal'},
                                ]} placeholder="Modal"/>
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
