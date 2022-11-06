import Authenticated from "@/Layouts/Authenticated";
import App from "@/Layouts/App";
import CollectionLayout from "@/Layouts/CollectionLayout";
import ContainerPage from "@/Components/Table/ContainerPage";
import Button from "@/Components/Button";
import Table from "@/Components/Table/Table";
import RowHeader from "@/Components/Table/RowHeader";
import HeadColumn from "@/Components/Table/HeadColumn";
import Row from "@/Components/Table/Row";
import Column from "@/Components/Table/Column";
import {Inertia} from "@inertiajs/inertia";
import {labelInputType} from "@/helpers";
import Boolean from "@/Components/Boolean";

function Columns({collection, app}) {

    const {columns} = collection;

    function deleteColumn(column) {
        Inertia.delete(route('admin.apps.edit.collections.columns.destroy', {
            app: app.id,
            collection: collection.id,
            column: column.id
        }))
    }

    return (
        <>
            <ContainerPage
                label="Columns"
                actions={[
                    <Button
                        action={() => Inertia.get(route('admin.apps.edit.collections.columns.create', {app: app.id, collection: collection.id}))}
                    >
                        New Column
                    </Button>,
                    !collection.table_name
                        ? <Button color="success">Migrate Table & Model</Button>
                        : null,
                ]}
                fallback={!(columns ?? []).length}
                fallbackTitle="No columns has been created yet."
                fallbackDescription="You can create a new column by clicking the 'New Column' button."
            >
                <Table>
                    <RowHeader>
                        <HeadColumn className="w-96">Label</HeadColumn>
                        <HeadColumn className="w-96">Type</HeadColumn>
                        <HeadColumn className="w-60 justify-center">Required</HeadColumn>
                        <HeadColumn className="w-60 justify-center">Unique</HeadColumn>
                        <HeadColumn className="w-full">Default</HeadColumn>
                        <HeadColumn className="w-4/12"></HeadColumn>
                    </RowHeader>
                    {(columns ?? []).map(column => (
                        <Row key={column.name}>
                            <Column className="w-96">
                                <div className="flex flex-col">
                                    <span className="">{column.label}</span>
                                    <span className="text-xs text-gray-400">{column.name}</span>
                                </div>
                            </Column>
                            <Column className="w-96">{labelInputType(column.type)}</Column>
                            <Column className="w-60 justify-center"><Boolean value={column.required}/></Column>
                            <Column className="w-60 justify-center"><Boolean value={column.unique}/></Column>
                            <Column className="w-full">{column.default}</Column>
                            <Column className="w-4/12 justify-end">
                                <Button
                                    icon="pencil"
                                    size="sm"
                                    iconType={'outline'}
                                    negative
                                    action={() => Inertia.get(route('admin.apps.edit.collections.columns.edit', {
                                        app: app.id,
                                        collection: collection.id,
                                        column: column.id
                                    }))}
                                />
                                <Button
                                    icon="trash"
                                    size="sm"
                                    iconType={'outline'}
                                    negative
                                    color="danger"
                                    action={() => deleteColumn(column)}
                                />
                            </Column>
                        </Row>
                    ))}
                </Table>
            </ContainerPage>
        </>
    )
}

Columns.layout = page => <Authenticated title={page.props.collection.name + ' - Columns'}>
    <App>
        <CollectionLayout>
            {page}
        </CollectionLayout>
    </App>
</Authenticated>;

export default Columns
