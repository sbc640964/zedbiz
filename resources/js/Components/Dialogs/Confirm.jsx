import EmptyModal from "@/Components/Dialogs/EmptyModal";
import Button from "@/Components/Button";

function Confirm({open, setOpen, title, message, onConfirm, onCancel, ...props}) {
    return (
        <EmptyModal
            open={open}
            setOpen={setOpen}
            maxWidth={'sm'}
            onClose={onCancel}
        >
            {({close}) => (
                <div>
                    <div className="py-3 px-4">
                        <h2 className="text-lg font-bold text-gray-600">{title}</h2>
                    </div>
                    <div className="py-4 px-6">
                        <p className="text-gray-600">{message}</p>
                    </div>
                    <div className="py-3 px-4 flex justify-end gap-x-2">
                        <Button
                            type="button"
                            action={close}
                            color="secondary"
                            negative
                        >
                            {props?.btn_cancel_text ?? 'Cancel'}
                        </Button>
                        <Button
                            type="button"
                            action={() => {
                                onConfirm();
                                close();
                            }}
                            color="danger"
                        >
                            {props?.btn_text ?? 'Confirm'}
                        </Button>
                    </div>
                </div>
            )}

        </EmptyModal>
    )
}

export default Confirm
