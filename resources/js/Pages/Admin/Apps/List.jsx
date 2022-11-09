import Authenticated from "@/Layouts/Authenticated";
import App from "@/Layouts/App";
import CollectionLayout from "@/Layouts/CollectionLayout";
import ContainerPage from "@/Components/Table/ContainerPage";
import Table from "@/Components/Table/Table";
import HeadColumn from "@/Components/Table/HeadColumn";
import Row from "@/Components/Table/Row";
import RowHeader from "@/Components/Table/RowHeader";
import {useEffect, useState, useTransition} from "react";
import Button from "@/Components/Button";
import ListModal from "@/Pages/Admin/Modals/ListModal";
import Column from "@/Components/Table/Column";
import FormCollectionModal from "@/Pages/Shared/Modals/FormCollectionModal";
import SearchInput from "@/Components/Form/SearchInput";
import PaginationSection from "@/Components/Table/PaginationSection";
import {Inertia} from "@inertiajs/inertia";
import Confirm from "@/Components/Dialogs/Confirm";
import Dropdown from "@/Components/Dropdown";
import ActionRow from "@/Components/Admin/ActionRow";
import ColumnWithSettings from "@/Components/Table/ColumnWithSettings";
import {collect} from "collect.js";
import useBulkActions from "@/Uses/useBulkActions";
import ListWidget from "@/Components/Widgets/ListWidget";
import {appUrlName} from "@/helpers";
import Import from "@/Pages/Admin/Modals/Import";
import DropdownCollectionActions from "@/Components/DropdownCollectionActions";

function List({ collection, app, list, collections, records:originalRecords, widgets:widgetsValues, isAdminScreen, ...props }) {

    const [records, setRecords] = useState(originalRecords);
    const [openModal, setOpenModal] = useState(false);
    const [openCollectionModal, setOpenCollectionModal] = useState(false);
    const [confirm, setConfirm] = useState(null);
    const [notFoundShow, setNotFoundShow] = useState(false);
    const [openImportModal, setOpenImportModal] = useState(false);
    const [_, startTransition] = useTransition({
        timeoutMs: 500,
    });
    const [search, setSearch] = useState('');

    const {CheckAll, CheckRow, Status} = useBulkActions(records);

    useEffect(() => {
        if(!notFoundShow && records.data.length > 0) {
            setNotFoundShow(true);
        }
    }, [records?.data]);

    useEffect(() => {
        setRecords(originalRecords);
    }, [originalRecords]);

    useEffect(() => {
        if (props?.queryParameters?.search) {
            setSearch(props.queryParameters.search);
        }
    }, []);

    function getColumns()
    {
        switch (list.query_mode){
            case 'sql_raw' :
                return list.settings.columns;
            default :
                return list.settings.query_selects;
        }
    }

    function newItem()
    {
        if(list.settings?.add_new_method === 'page') {
            return Inertia.get(appUrlName('collections.records.create', {form: list.id}, app));
        }
        setOpenCollectionModal(true);
    }

    function getAction(action, record, optionsInertia = {}) {
        if(action?.type && action?.type?.startsWith('c_') && action?.confirmation?.enabled) {
            return setConfirm({
                ...action.confirmation,
                onConfirm: () => getAction({...action, confirmation: {enabled: false}}, record, optionsInertia),
            })
        }

        Inertia.get(appUrlName('collections.action', {
            ...(isAdminScreen ? {app: app.id} : {}), list: list.id, action: action.id
        }), {record: record.id}, {
            preserveScroll: true,
            preserveState: true,
            ...optionsInertia,
        });
    }

    function groupActions() {
        return list.settings.actions.filter(v => v.enabled && v?.grouped);
    }

    function searchRecords(e) {
        setSearch(e.target.value);
        startTransition(() => {
            if(props?.ajax) {
                return props.ajax({
                    search: e.target.value,
                    page: null,
                });
            }
            Inertia.get(location.origin + location.pathname, {
                ...collect(props?.queryParameters ?? []).except(['search', 'page']).all(),
                ...(e.target.value.length ? {search: e.target.value} : {}),
            },{
                preserveScroll: true,
                preserveState: true,
                replace: true,
            });
        });
    }

    function hasSearchable() {
        return list.settings.columns.filter(v => v?.searchable).length > 0;
    }

    function showHeaderActions() {
        return hasSearchable() // || (hasBulkActions() && selectedRecords().length > 0) || hasFilters()
    }

    function getWidthActionsColumn() {
        let base = list.settings.actions.filter(v => v.enabled && !v.grouped).length * 32;
        if(groupActions().length > 0) {
            base += 32;
        }
        base -= 8;
        return base + 32;
    }

    return (
        <ContainerPage
            label={list.name + ' List'}
            className="bg-transparent border-none shadow-none rounded-none"
            actions={[
                (list.settings?.enable_import || list.settings?.enable_export) &&
                    <DropdownCollectionActions enableExport={list.settings?.enable_export} enableImport={list.settings?.enable_import} setOpenImportModal={setOpenImportModal} />,
                list.settings?.enable_add_new ? <Button
                    action={newItem}
                >{list.settings?.add_new_label ?? ('Add ' + (collection.settings?.singular_label ?? 'new') )}</Button> : null,
                isAdminScreen ? <Button outline negative icon="cog-8-tooth" action={() => setOpenModal(true)}/> : null
            ]}
        >
            {list.settings?.widgets?.enabled && list.settings.widgets?.items?.length > 0  &&
                <div className="grid grid-cols-4 gap-4 mb-4 mt-8">
                    {(list.settings.widgets?.items).map((widget) => (
                        <ListWidget key={widget.id} {...widget} widgetsValues={widgetsValues}/>
                    ))}
                </div>
            }

            <ContainerPage
                inner
                hiddenHeader
                fallback={records.data.length === 0}
                fallbackTitle={`No ${collection.settings?.plural_label ?? 'records'} found`}
                fallbackDescription={list.settings.enable_add_new ? `You can create one by clicking the button below` : ''}
                fallbackAction={list.settings.enable_add_new ? <Button action={() => setOpenCollectionModal(true)}
                >Add record</Button> : null}
                hiddenFallback={notFoundShow}
            >
                <Table className="w-full">
                    {showHeaderActions() &&
                        <div className="flex justify-between p-2">
                            <div></div>
                            <div className="w-1/3">
                                {hasSearchable() &&
                                    <SearchInput className="w-full py-1" handleChange={searchRecords} value={search}/>
                                }
                            </div>
                        </div>
                    }
                    <div className="border-t first:border-t-0">
                        <RowHeader className="sticky">
                            {list.settings?.bulk_actions?.enabled &&
                                <HeadColumn width="48">
                                    <CheckAll/>
                                </HeadColumn>
                            }
                            {getColumns().map((column, index) => (
                                <ColumnWithSettings
                                    queryParameters={props?.queryParameters}
                                    key={index}
                                    column={column}
                                    list={list}
                                    app={app}
                                    collection={collection}
                                    ajax={props?.ajax}
                                    head
                                />
                            ))}
                            <HeadColumn show={list.settings.actions.length > 0} width={getWidthActionsColumn()}></HeadColumn>
                        </RowHeader>
                    </div>
                    <Status/>
                    <div>
                        {records.data.length === 0 && <div className="p-4 text-center text-gray-400 ">No {collection.settings?.plural_label?.toLowerCase?.() ?? 'records'} found</div>}
                        {records.data.map((record) => (
                            <Row key={record.id}>
                                {list.settings?.bulk_actions?.enabled &&
                                    <Column width="48">
                                        <CheckRow id={record.id}/>
                                    </Column>
                                }
                                {getColumns().map((column, index) => (
                                   <ColumnWithSettings
                                        key={index}
                                        column={column}
                                        record={record}
                                        list={list}
                                        app={app}
                                        collection={collection}
                                        actionProps={{getAction, record}}
                                        refreshList={props?.refreshList}
                                   />
                                ))}
                                <Column show={list.settings.actions.length > 0} width={getWidthActionsColumn()} className="justify-end">
                                    <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                                        {list.settings.actions.filter(v => v.enabled && !v?.grouped).map((action, index) => (
                                            <ActionRow
                                                key={index}
                                                action={action}
                                                record={record}
                                                getAction={getAction}
                                                refreshList={props?.refreshList}
                                            />
                                        ))}

                                        {groupActions().length > 0 && (
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <Button
                                                        outline
                                                        negative
                                                        iconType="outline"
                                                        size="sm"
                                                        icon="ellipsis-vertical"
                                                        color="gray"
                                                        // tooltip="More actions"
                                                    />
                                                </Dropdown.Trigger>
                                                <Dropdown.Content>
                                                    <div className="px-1">
                                                        {groupActions().map((action, index) => (
                                                            <Button
                                                                key={index}
                                                                className="w-full space-x-3"
                                                                outline
                                                                negative
                                                                iconType="outline"
                                                                size="sm"
                                                                icon={action.icon}
                                                                color="secondary"
                                                                startIcon
                                                                action={() => getAction(action, record)}
                                                                tooltip={action.tooltip}
                                                            >{action.label}</Button>
                                                        ))}
                                                    </div>
                                                </Dropdown.Content>
                                            </Dropdown>
                                        )}
                                    </div>
                                </Column>

                            </Row>
                        ))}
                    </div>
                </Table>
                <PaginationSection data={records} ajax={props?.ajax}/>
            </ContainerPage>

            <ListModal
                open={openModal}
                setOpen={setOpenModal}
                list={list}
                listProps={{list, collection, app, collections}}
            />

            <FormCollectionModal
                open={openCollectionModal}
                setOpen={setOpenCollectionModal}
                record={openCollectionModal}
                list={list}
                app={app}
                form={collection}
            />

            {confirm && <Confirm
                {...confirm}
                setOpen={setConfirm}
                open={confirm}
            />}

            <Import collection={collection} app={app} open={openImportModal} onClose={() => setOpenImportModal(false)}/>

        </ContainerPage>
    )
}

List.layout = page => <Authenticated title={`Edit list - ${page.props.list.name}`}>
    <App>
        <CollectionLayout>
            {page}
        </CollectionLayout>
    </App>
</Authenticated>;

export default List
