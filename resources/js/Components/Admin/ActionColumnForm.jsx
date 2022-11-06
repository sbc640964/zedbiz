import FieldRow from "@/Components/Form/FieldRow";
import Switcher from "@/Components/Form/Switcher";
import Button from "@/Components/Button";
import {useState} from "react";
import ActionModalInputs from "@/Components/Admin/ActionModalInputs";

function ActionColumnForm({setData, action, label, ...props}) {

    const [open, setOpen] = useState(false);

    return (
        <FieldRow label={label} widths={['w-1/3', 'w-2/3']}>
            <div className="flex space-x-2 rtl:space-x-reverse justify-between items-center">
                <Switcher
                    value={action.enabled ?? false}
                    handleChange={(e) => setData('enabled', e.target.value)}
                />

                <div>
                    <Button
                        className="text-sm"
                        action={() => setOpen(!open)}
                        iconType="outline"
                        negative
                        size="sm"
                        icon="pencil"
                    />
                </div>
            </div>

            <ActionModalInputs
                action={action}
                setData={setData}
                open={open}
                setOpen={setOpen}
                {...props}
            />
        </FieldRow>
    )
}

export default ActionColumnForm
