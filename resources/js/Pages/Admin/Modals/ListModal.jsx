import EmptyModal from "@/Components/Dialogs/EmptyModal";
import NewList from "@/Pages/Admin/Apps/NewList";

function ListModal({ open, setOpen, list, listProps }) {


    return (
        <EmptyModal
            open={open}
            setOpen={setOpen}
            maxWidth={'7xl'}
        >
            {({close}) => (
                open
                    ? <div className="w-full">
                        <div className="py-3 px-4 border-b">
                            <h2 className="text-lg font-bold text-gray-600">Settings List</h2>
                        </div>

                        <NewList {...listProps} title={list.name} onUpdate={close}/>
                    </div>
                    : null
            )}

        </EmptyModal>
    )
}

export default ListModal
