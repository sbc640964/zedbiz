import Button from "@/Components/Button";
import React, {useState} from "react";

function ActionRow({record, action, getAction, children, type, className, ...props}) {

    const [processing, setProcessing] = useState(false);

    const inertiaOptions = {
        onSuccess: () => ['c_delete', 'c_update'].includes(action.type) && typeof props?.refreshList === 'function' && props.refreshList(),
        onBefore: () => setProcessing(true),
        onFinish: () => setProcessing(false),
    }

    if(type === 'text'){
        return (
            <span
                className={`cursor-pointer opacity-70 hover:opacity-90 transition ${className}`}
                onClick={() => getAction(action, record, inertiaOptions)}
            >
                {children}
                {/*{processing &&*/}
                {/*    <span className="ml-2">*/}
                {/*        <LoaderSpinner className={`w-5 h-5`}/>*/}
                {/*    </span>*/}
                {/*}*/}
            </span>
        )
    }

    return (
        <Button
            className="ml-1"
            outline
            negative
            iconType="outline"
            size="sm"
            icon={action.icon}
            color={action.color}
            action={() => getAction(action, record, inertiaOptions)}
            processing={processing}
            tooltip={action.tooltip}
            loadingAtProcessing
        >
            {children}
        </Button>
    )
}

export default ActionRow
