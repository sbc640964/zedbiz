import Authenticated from "@/Layouts/Authenticated";
import Button from "@/Components/Button";
import moment from "moment/moment";
import SearchInput from "@/Components/Form/SearchInput";
import {useState} from "react";
import UserModal from "@/Pages/Admin/Modals/User";
import {Inertia} from "@inertiajs/inertia";
import Table from "@/Components/Table/Table";
import RowHeader from "@/Components/Table/RowHeader";
import HeadColumn from "@/Components/Table/HeadColumn";
import Row from "@/Components/Table/Row";
import Column from "@/Components/Table/Column";
import PaginationSection from "@/Components/Table/PaginationSection";
import ContainerPage from "@/Components/Table/ContainerPage";

function Index(props) {
    const {users} = props;

    const [openModal, setOpenModal] = useState(false);
    const [user, setUser] = useState(null);

    const fetchUser = (user) => {
        setUser(user);
        setOpenModal(true);
    }

    function TrashUser(user) {
        if (confirm('Are you sure you want to delete this user?')) {
            Inertia.delete(route('admin.users.destroy', user.id), {
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
    )
}

Index.layout = page => <Authenticated children={page} title={'Users'} />;

export default Index
