import Authenticated from "@/Layouts/Authenticated";
import App from "@/Layouts/App";
import ContainerPage from "@/Components/Table/ContainerPage";
import Button from "@/Components/Button";
import {useState} from "react";
import {CalendarIcon, ChartPieIcon, PlusIcon, RectangleGroupIcon, TableCellsIcon} from "@heroicons/react/24/outline";
import CreatePage from "@/Pages/Admin/Modals/CreatePage";
import Table from "@/Components/Table/Table";
import RowHeader from "@/Components/Table/RowHeader";
import HeadColumn from "@/Components/Table/HeadColumn";
import Row from "@/Components/Table/Row";
import Column from "@/Components/Table/Column";
import {Inertia} from "@inertiajs/inertia";

function Index({pages, app}) {
    const [openModal, setOpenModal] = useState(false);

    return (
        <>
            <ContainerPage
                label="Pages"
                actions={[
                    <Button action={() => setOpenModal(true)}>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <PlusIcon className="stroke-2 w-4 h-4"/>
                            <span>New Page</span>
                        </div>
                    </Button>,
                ]}
                fallback={!pages?.data?.length}
                fallbackTitle="No pages have been created yet"
                fallbackDescription="You can create one by clicking the button below"
                fallbackAction={0}
            >
                <Table>
                    <RowHeader className="border-t-0">
                        <HeadColumn width="100">Type</HeadColumn>
                        <HeadColumn className="w-full">Name</HeadColumn>
                        <HeadColumn className="w-full">Description</HeadColumn>
                        <HeadColumn className="w-80"></HeadColumn>
                    </RowHeader>
                    {pages.data.map(page => (
                        <Row key={page.id}>
                            <Column width="100">
                                <PageIcon type={page.type}/>
                            </Column>
                            <Column className="w-full">
                                {page.name}
                            </Column>
                            <Column className="w-full">
                                <div className="w-60 text-ellipsis whitespace-nowrap overflow-hidden">
                                    {page.description}
                                </div>
                            </Column>
                            <Column className="w-80 flex justify-end">
                                <Button
                                    className="mr-2"
                                    icon="pencil"
                                    size="sm"
                                    iconType={'outline'}
                                    negative
                                    action={() => Inertia.get(page.paths.show)}
                                />
                            </Column>
                        </Row>
                    ))}
                </Table>
            </ContainerPage>
            <CreatePage
                open={openModal}
                setOpen={setOpenModal}
                app={app}
            />
        </>

    )
}

export function PageIcon({type, className}) {
    const classes = className ?? 'h-5 w-5';
    switch (type) {
        case 'dashboard':return <span className="bg-primary-100/70 text-primary-700 rounded-lg p-1 block"><ChartPieIcon className={classes}/></span>;
        case 'calendar':return <span className="bg-sky-100/70 text-sky-700 rounded-lg p-1 block"><CalendarIcon className={classes}/></span>;
        case 'kanban':return <span className="bg-yellow-100/70 text-yellow-700 rounded-lg p-1 block"><RectangleGroupIcon className={classes}/></span>;
        case 'table': return <span className="bg-pink-100/70 text-pink-700 rounded-lg p-1 block"><TableCellsIcon className={classes}/></span>;
        default: return null
    }
}

Index.layout = page => <Authenticated title={'Collection pages'}>
    <App children={page}/>
</Authenticated>;

export default Index
