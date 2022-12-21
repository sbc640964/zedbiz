import Button from "@/Components/Button";
import Confirm from "@/Components/Dialogs/Confirm";
import {useState} from "react";
import {Inertia} from "@inertiajs/inertia";

function SettingsWidgetButton({onClick, paths}) {

    const [confirm, setConfirm] = useState(false);

    function handleDelete() {
        Inertia.delete(paths.delete, {
            preserveScroll: true,
            onSuccess: () => {
                setConfirm(false);
            }
        });
    }

    return (
        <>
            <Button
                negative
                color="secondary"
                className="block"
                iconType="outline"
                onClick={() => paths.duplicate ? Inertia.post(paths.duplicate) : null}
                icon={'square-2-stack'}
                size="xs"
            />

            <Button
                negative
                color="secondary"
                className="block"
                iconType="outline"
                onClick={onClick}
                icon={'Cog6ToothIcon'}
                size="xs"
            />
            <Button
                negative
                icon="trash"
                iconType="outline"
                color="danger"
                size="xs"
                onClick={() => setConfirm(true)}
            />

            <Confirm
                setOpen={setConfirm}
                open={confirm}
                title="Delete Widget"
                message="Are you sure you want to delete this widget?"
                onConfirm={handleDelete}
            />
        </>

    )
}

export default SettingsWidgetButton
