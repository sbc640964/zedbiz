import {useState} from "react";
import {Inertia} from "@inertiajs/inertia";
import ContainerPage from "@/Components/Table/ContainerPage";
import Button from "@/Components/Button";
import SearchInput from "@/Components/Form/SearchInput";
import Table from "@/Components/Table/Table";
import RowHeader from "@/Components/Table/RowHeader";
import HeadColumn from "@/Components/Table/HeadColumn";
import Row from "@/Components/Table/Row";
import Column from "@/Components/Table/Column";
import moment from "moment";
import PaginationSection from "@/Components/Table/PaginationSection";
import UserModal from "@/Pages/Admin/Modals/User";

function UsersPage(props) {
    const {users} = props;

    const [openModal, setOpenModal] = useState(false);
    const [user, setUser] = useState(null);

    const fetchUser = (user) => {
        setUser(user);
        setOpenModal(true);
    }

    function TrashUser(user) {
        if (confirm('Are you sure you want to delete this user?')) {

            const isAdmin = route().current('admin.*');
            const isApp = route().current('admin.apps.*');

            const url = isAdmin
                ? (isApp ? route('admin.apps.edit.users.destroy', {...route().params, user: user.id}) : route('admin.users.destroy', user.id))
                : route('users.destroy', user.id);

            Inertia.delete(url, {
                preserveScroll: true,
            });
        }
    }

    return (
        <>
            <ContainerPage label={'Users'} actions={<Button action={() => setOpenModal(true)}>Create</Button>}>
                <div className="flex justify-between p-2">
                    <div></div>
                    <div className="w-1/3">
                        <SearchInput className="w-full py-1"/>
                    </div>
                </div>
                <Table>
                    <RowHeader>
                        <HeadColumn width="48">ID</HeadColumn>
                        <HeadColumn width="">Name</HeadColumn>
                        <HeadColumn width="">E-mail</HeadColumn>
                        <HeadColumn width="">Phone</HeadColumn>
                        <HeadColumn width="">Last activity</HeadColumn>
                        <HeadColumn width="100"></HeadColumn>
                    </RowHeader>
                    {users.data.map(user => (
                        <Row key={user.id}>
                            <Column width="48">{user.id}</Column>
                            <Column width="">{user.name}</Column>
                            <Column width="">{user.email}</Column>
                            <Column width="">{user.phone}</Column>
                            <Column width="">{moment(user.updated_at).fromNow()}</Column>
                            <Column width="100">
                                <Button
                                    className="mr-2"
                                    icon="pencil"
                                    size="sm"
                                    iconType={'outline'}
                                    negative
                                    action={() => fetchUser(user)}
                                />

                                <Button
                                    icon="trash"
                                    size="sm"
                                    iconType={'outline'}
                                    color={'danger'}
                                    negative
                                    action={() => TrashUser(user)}
                                />
                            </Column>
                        </Row>
                    ))}
                </Table>
                <PaginationSection data={users}/>
            </ContainerPage>
            <UserModal
                user={user}
                open={openModal}
                setOpen={setOpenModal}
                onClose={() => setUser(null)}
            />
        </>
    );
}

export default UsersPage
