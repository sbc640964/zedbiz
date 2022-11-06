import Authenticated from "@/Layouts/Authenticated";
import App from "@/Layouts/App";
import ContainerPage from "@/Components/Table/ContainerPage";
import Button from "@/Components/Button";
import {useState} from "react";
import RowHeader from "@/Components/Table/RowHeader";
import HeadColumn from "@/Components/Table/HeadColumn";
import Row from "@/Components/Table/Row";
import Column from "@/Components/Table/Column";
import {Inertia} from "@inertiajs/inertia";
import Table from "@/Components/Table/Table";
import CreateCollectionModal from "@/Pages/Admin/Modals/CreateCollection";

function Collections(props) {

    const {collections, app} = props;
    const [openModal, setOpenModal] = useState(false);

    function migrateTables() {
        Inertia.post(route('admin.apps.edit.collections.migrate', app.id), {
            preserveScroll: true,
        });
    }

    return (
        <>
            <ContainerPage
                label="Collections"
                actions={[
                    <Button action={() => setOpenModal(true)}>Create</Button>,
                    <Button color="danger" negative className="hover:bg-red-100" action={() => migrateTables()}>Migrate tables</Button>
                ]}
                fallback={!collections.data.length}
                fallbackTitle="No collections have been created yet"
                fallbackDescription="You can create one by clicking the button below"
            >
                <Table>
                    <RowHeader className="border-t-0">
                        <HeadColumn className="w-full">Name</HeadColumn>
                        <HeadColumn className="w-full">Description</HeadColumn>
                        <HeadColumn className="w-80"></HeadColumn>
                    </RowHeader>
                    {collections.data.map(collection => (
                        <Row key={collection.id}>
                            <Column className="w-full">{collection.name}</Column>
                            <Column className="w-full">
                                <div className="w-60 text-ellipsis whitespace-nowrap overflow-hidden">
                                    {collection.description}
                                </div>
                            </Column>
                            <Column className="w-80 flex justify-end">
                                <Button
                                    className="mr-2"
                                    icon="pencil"
                                    size="sm"
                                    iconType={'outline'}
                                    negative
                                    action={() => Inertia.get(route('admin.apps.edit.collections.edit', {
                                        app: app.id,
                                        collection: collection.id
                                    }))}
                                />

                                {/*<Button*/}
                                {/*    icon="trash"*/}
                                {/*    size="sm"*/}
                                {/*    iconType={'outline'}*/}
                                {/*    color={'danger'}*/}
                                {/*    negative*/}
                                {/*    action={() => destroyApp(collection)}*/}
                                {/*/>*/}
                            </Column>
                        </Row>
                    ))}
                </Table>
            </ContainerPage>
            <CreateCollectionModal
                app={app}
                open={openModal}
                setOpen={setOpenModal}
            />
        </>
    )
}

Collections.layout = page => <Authenticated title={'Edit App'}>
    <App children={page}/>
</Authenticated>;

export default Collections
