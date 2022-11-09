import ContainerPage from "@/Components/Table/ContainerPage";
import Authenticated from "@/Layouts/Authenticated";
import SearchInput from "@/Components/Form/SearchInput";
import RowHeader from "@/Components/Table/RowHeader";
import HeadColumn from "@/Components/Table/HeadColumn";
import Row from "@/Components/Table/Row";
import Column from "@/Components/Table/Column";
import Button from "@/Components/Button";
import Table from "@/Components/Table/Table";
import AppModal from "@/Pages/Admin/Modals/App";
import {Inertia} from "@inertiajs/inertia";
import {useState} from "react";
import Icon from "@/Components/Icon";

function Index(props) {

    const {apps} = props;

    const [openModal, setOpenModal] = useState(false);
    const [app, setApp] = useState(null);

    function destroyApp(app) {
        if (confirm('Are you sure you want to delete this user?')) {
            Inertia.delete(route('admin.apps.destroy', app.id), {
                preserveScroll: true,
            });
        }
    }

    function getAppLink(domain) {
        const scheme = import.meta.env?.VITE_APPS_PROTOCL ?? window.location.protocol;
        const port = import.meta.env?.VITE_APPS_PORT ?? window.location.port ?? null;
        const path = import.meta.env?.VITE_APPS_PATH ?? null;
        return `${scheme}//${domain.domain}${port ? `:${port}` : ''}${path ? `/${path}` : ''}`;
    }

    return (
        <>
            <ContainerPage
                label="Apps"
                actions={<Button action={() => setOpenModal(true)}>Create</Button>}
                fallback={apps.data.length < 1}
                fallbackTitle="No apps have been created yet"
                fallbackDescription="You can create one by clicking the button below"
            >
                <div className="flex justify-between p-2">
                    <div></div>
                    <div className="w-1/3">
                        <SearchInput className="w-full py-1"/>
                    </div>
                </div>
                <Table>
                    <RowHeader>
                        <HeadColumn width="72"></HeadColumn>
                        <HeadColumn>Name</HeadColumn>
                        <HeadColumn>Domain</HeadColumn>
                        <HeadColumn>Description</HeadColumn>
                        <HeadColumn width="100"></HeadColumn>
                    </RowHeader>
                    {apps.data.map(app => (
                        <Row key={app.id}>
                            <Column width="72">
                                <img
                                    alt='logo'
                                    className="max-w-full"
                                    src={'/storage/' + app.brand}
                                />
                            </Column>
                            <Column>{app.name}</Column>
                            <Column>
                                {app.domains.map((domain) => (
                                    <span className="group hover:text-primary-400 transition flex items-center space-x-0.5 rtl:space-x-reverse">
                                        <span>
                                            <Icon name="link" className="h-3 w-3"/>
                                        </span>
                                        <a
                                            target="_blank"
                                            href={getAppLink(domain)}
                                        >
                                            {domain.domain}
                                        </a>
                                    </span>
                                ))}
                            </Column>
                            <Column>
                                <div className="w-60 text-ellipsis whitespace-nowrap overflow-hidden">
                                    {app.description}
                                </div>
                            </Column>
                            <Column className="justify-end" width="100">
                                <Button
                                    className="mr-2"
                                    icon="pencil"
                                    size="sm"
                                    iconType={'outline'}
                                    negative
                                    action={() => Inertia.get(route('admin.apps.edit', app.id))}
                                />

                                <Button
                                    icon="trash"
                                    size="sm"
                                    iconType={'outline'}
                                    color={'danger'}
                                    negative
                                    action={() => destroyApp(app)}
                                />
                            </Column>
                        </Row>
                    ))}
                </Table>
            </ContainerPage>
            <AppModal
                user={app}
                open={openModal}
                setOpen={setOpenModal}
                onClose={() => setApp(null)}
            />
        </>
    )
}

Index.layout = page => <Authenticated children={page} title={'Apps'} />;

export default Index
