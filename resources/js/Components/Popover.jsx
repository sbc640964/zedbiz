import {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";
import {Portal} from "react-portal";
import {Transition} from "@headlessui/react";
import {createPortal} from "react-dom";

const PopoverContext = createContext(null);

function usePopoverContext(component) {
    let context = useContext(PopoverContext);
    if(context === null) {
        let error = new Error(`<${component} /> is missing a parent <Popover /> component.`);
        if (Error.captureStackTrace) Error.captureStackTrace(error, usePopoverContext);
        throw error;
    }
    return context;
}

function Popover(props) {

    const {
        children,
        placement = 'bottom right',
        offset = 0,
        closeOnOutsideClick = true
    } = props;

    const [open, setOpen] = useState(false);
    const refTrigger = useRef(null);
    const refPopover = useRef(null);

    const data = {
        open,
        setOpen,
        refTrigger,
        refPopover
    };

    /**
     * Update the position of the popover on user scroll or resize.
     */
    function watchPlacement() {
        if (open) {
            updatePlacement();
        }
    }

    const updatePlacement = useCallback(() => {
        const trigger = refTrigger.current;
        const popover = refPopover.current;

        if (!trigger || !popover) return;

        const triggerRect = trigger.getBoundingClientRect();
        const popoverRect = popover.getBoundingClientRect();

        const triggerTop = triggerRect.top;
        const triggerLeft = triggerRect.left;
        const triggerWidth = triggerRect.width;
        const triggerHeight = triggerRect.height;

        const popoverWidth = popoverRect.width;
        const popoverHeight = popoverRect.height;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const placements = placement.split(' ');
        const placementPrimary = placements[0];
        const placementSecondary = placements[1];

        let top = 0;
        let left = 0;

        if (placementPrimary === 'top') {
            top = triggerTop - popoverHeight - offset;
            if (placementSecondary === 'left') {
                left = triggerLeft;
            } else if (placementSecondary === 'right') {
                left = triggerLeft - popoverWidth + triggerWidth;
            } else {
                left = triggerLeft - popoverWidth / 2 + triggerWidth / 2;
            }
        }

        if (placementPrimary === 'bottom') {
            top = triggerTop + triggerHeight + offset;
            if (placementSecondary === 'left') {
                left = triggerLeft;
            } else if (placementSecondary === 'right') {
                left = triggerLeft - popoverWidth + triggerWidth;
            } else {
                left = triggerLeft - popoverWidth / 2 + triggerWidth / 2;
            }
        }

        if (placementPrimary === 'left') {
            left = triggerLeft - popoverWidth - offset;
            if (placementSecondary === 'top') {
                top = triggerTop;
            } else if (placementSecondary === 'bottom') {
                top = triggerTop - popoverHeight + triggerHeight;
            } else {
                top = triggerTop - popoverHeight / 2 + triggerHeight / 2;
            }
        }

        if (placementPrimary === 'right') {
            left = triggerLeft + triggerWidth + offset;
            if (placementSecondary === 'top') {
                top = triggerTop;
            } else if (placementSecondary === 'bottom') {
                top = triggerTop - popoverHeight + triggerHeight;
            } else {
                top = triggerTop - popoverHeight / 2 + triggerHeight / 2;
            }
        }

        // Make sure the popover is not off the screen.
        if (left < 0) {
            left = 0;
        }

        if (left + popoverWidth > windowWidth) {
            left = windowWidth - popoverWidth;
        }

        if (top < 0) {
            top = 0;
        }

        if (top + popoverHeight > windowHeight) {
            top = windowHeight - popoverHeight;
        }

        popover.style.top = `${top}px`;
        popover.style.left = `${left}px`;
    }, [open]);

    useEffect(() => {
        window.addEventListener('resize', watchPlacement);
        document.addEventListener('scroll', watchPlacement);
        window.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('resize', watchPlacement);
            document.removeEventListener('scroll', watchPlacement);
            window.removeEventListener('mousedown', handleClickOutside);
        }
    }, []);

    useEffect(() => {
        if (open) {
            watchPlacement();
        }
    }, [open]);

    function handleClickOutside(event) {
        if (closeOnOutsideClick && !refPopover.current.contains(event.target) && !refTrigger.current.contains(event.target)
        ) {
            setOpen(false);
        }
    }

    return (
        <PopoverContext.Provider value={data}>
            {children}
        </PopoverContext.Provider>
    )
}

function Trigger({children}) {

    const {open, setOpen, refTrigger} = usePopoverContext('Popover.Trigger');

    return (
        <span onClick={() => setOpen(!open)} ref={refTrigger}>
            {children}
        </span>
    )
}

function Content({children}) {

    const {open, setOpen, refPopover} = usePopoverContext('Popover.Content');
    return <>
        {
            createPortal(
                <div
                    ref={refPopover}
                    className="fixed z-50"
                >
                    <Transition
                        show={open}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        {children}
                    </Transition>
                </div>, document.body)
        }
    </>


}

Popover.Trigger = Trigger;
Popover.Content = Content;

export default Popover
