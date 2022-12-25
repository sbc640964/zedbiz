import Authenticated from "@/Layouts/Authenticated";
import App from "@/Layouts/App";
import CollectionLayout from "@/Layouts/CollectionLayout";
import ContainerPage from "@/Components/Table/ContainerPage";
import Button from "@/Components/Button";
import {Inertia} from "@inertiajs/inertia";
import Table from "@/Components/Table/Table";
import RowHeader from "@/Components/Table/RowHeader";
import HeadColumn from "@/Components/Table/HeadColumn";
import Row from "@/Components/Table/Row";
import Column from "@/Components/Table/Column";

function Lists({ collection, app }) {

    const { lists } = collection;

    return (
       <ContainerPage
            label="Lists"
            actions={[
                <Button
                    action={() => Inertia.get(route('admin.apps.edit.collections.lists.create', {app: app.id, collection: collection.id}))}
                >
                    New List
                </Button>,
            ]}
            fallback={!(lists ?? []).length}
            fallbackTitle="No lists has been created yet."
            fallbackDescription="You can create a new list by clicking the 'New List' button."
       >
           <Table>
               <RowHeader>
                   <HeadColumn className="w-96">Name</HeadColumn>
                   <HeadColumn className="w-full">Description</HeadColumn>
                   <HeadColumn className="60">Type</HeadColumn>
                   <HeadColumn className="w-60">Query Mode</HeadColumn>
                     <HeadColumn className="w-60"></HeadColumn>
               </RowHeader>

               {lists.map(list => (
                   <Row>
                       <Column className="w-96">{list.name}</Column>
                       <Column className="w-full">{list.description}</Column>
                       <Column className="60">{list.type}</Column>
                       <Column className="w-60">{list.query_mode}</Column>
                          <Column className="w-60 justify-end">
                                <Button
                                    icon="square-2-stack"
                                    iconType="heroicon"
                                    negative
                                    size={"sm"}
                                    tooltip="Duplicate"
                                    action={() => Inertia.post(route('admin.apps.edit.collections.lists.duplicate', {app: app.id, collection: collection.id, list: list.id}))}
                                />
                                <Button
                                    icon="pencil"
                                    iconType="outline"
                                    negative
                                    size="sm"
                                    action={() => Inertia.get(route('admin.apps.edit.collections.lists.edit', {app: app.id, list: list.id, collection: collection.id}))}
                                />
                            </Column>
                   </Row>
               ))}
           </Table>
       </ContainerPage>
    )
}

Lists.layout = page => <Authenticated title={`${page.props.collection.name} - Lists`}>
    <App>
        <CollectionLayout>
            {page}
        </CollectionLayout>
    </App>
</Authenticated>;

export default Lists
