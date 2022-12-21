import {
    useFloating,
    useInteractions,
    useHover,
    autoUpdate,
    offset,
    useRole,
    useDismiss,
    flip,
    shift,
    autoPlacement
} from "@floating-ui/react-dom-interactions";
import {cloneElement, useState} from "react";
import {Transition} from "@headlessui/react";

function Tooltip({content, className = '', placement = 'top', children, ...props}) {

    const [open, setOpen] = useState(false);

    const {context, x, y, reference, floating, strategy} = useFloating({
        open: open,
        onOpenChange: setOpen,
        middleware: [offset(5), flip(), shift({ padding: 8 })],
        whileElementsMounted: autoUpdate,
        // strategy: 'fixed'
    });

    const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([
        useHover(context, {restMs: props.delay ?? 100}),
        useRole(context, { role: "tooltip" }),
        useDismiss(context)
    ]);

    //TODO enter animation is not working

    return (
        <>
            {cloneElement(children, getReferenceProps({ref: reference}))}
            <Transition
                ref={floating}
                style={{
                    position: strategy,
                    top: y ?? 0,
                    left: x ?? 0,
                }}
                {...getFloatingProps()}
                show={open}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-100"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
                className={`z-50`}
            >
                <div className={`rounded-md shadow-lg bg-gray-700 text-gray-100 ring-1 ring-black ring-opacity-5 ${className}`}>
                    <div className="py-1">
                        <p className="text-sm px-4">{content}</p>
                    </div>
                </div>
            </Transition>
        </>
    )
}

export default Tooltip
