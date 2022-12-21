import Authenticated from "@/Layouts/Authenticated";
import App from "@/Layouts/App";
import CollectionLayout from "@/Layouts/CollectionLayout";
import ContainerPage from "@/Components/Table/ContainerPage";
import Button from "@/Components/Button";
import NewPageModal from "@/Pages/Admin/Modals/NewPage";
import {useState} from "react";

function Index({ collection, app, pages }) {

    const [openNewPageModal, setOpenNewPageModal] = useState(false);

    return (
        <>
            <ContainerPage
                label="Pages"
                actions={[
                    <Button
                        action={() => setOpenNewPageModal(true)}
                    >
                        New Page
                    </Button>,
                ]}
                fallback={!(pages ?? []).length}
                fallbackTitle="No pages has been created yet."
                fallbackDescription="You can create a new page by clicking the 'New Page' button."
            >
            </ContainerPage>

            <NewPageModal
                open={openNewPageModal}
                setOpen={setOpenNewPageModal}
                collection={collection}
                app={app}
            />
        </>
    )
}

Index.layout = page => <Authenticated title={`${page.props.collection.name} - Pages`}>
    <App>
        <CollectionLayout>
            {page}
        </CollectionLayout>
    </App>
</Authenticated>;

export default Index
