import Authenticated from "@/Layouts/Authenticated";
import App from "@/Layouts/App";
import ContainerPage from "@/Components/Table/ContainerPage";
import Button from "@/Components/Button";
import {Inertia} from "@inertiajs/inertia";
import Table from "@/Components/Table/Table";
import RowHeader from "@/Components/Table/RowHeader";
import HeadColumn from "@/Components/Table/HeadColumn";
import Row from "@/Components/Table/Row";
import Column from "@/Components/Table/Column";

function Menus({menus, app}) {


    return (
        <ContainerPage
            label="Menus"
            fallback={!menus.data.length}
            fallbackTitle="No menus have been created yet"
            fallbackDescription="You can create one by clicking the button below"
            actions={[
                <Button action={() => Inertia.get(route('admin.apps.edit.menu.create', app.id))}>Create new</Button>
            ]}
        >
            <Table>
                <RowHeader>
                    <HeadColumn>Label</HeadColumn>
                    <HeadColumn>Nav Items</HeadColumn>
                    <HeadColumn width="60"></HeadColumn>
                </RowHeader>
                {menus.data.map(menu => (
                    <Row key={menu.id}>
                        <Column>{menu.label}</Column>
                        <Column>{menu.items.length}</Column>
                        <Column width="60">
                            <Button
                                icon="pencil"
                                size="sm"
                                iconType="outline"
                                negative
                                action={() => Inertia.get(route('admin.apps.edit.menu.edit', {app: app.id, menu: menu.id}))}
                            />
                        </Column>
                    </Row>
                ))}
            </Table>
        </ContainerPage>

    )
}
Menus.layout = page => <Authenticated title={'Menus'}>
    <App children={page}/>
</Authenticated>;

export default Menus
