import React, {useState, useContext, Fragment, useRef, useEffect, useCallback} from 'react';
import { Link } from '@inertiajs/inertia-react';
import { Transition } from '@headlessui/react';
import {createPortal} from "react-dom";

const DropDownContext = React.createContext();

const Dropdown = ({ children }) => {
    const [open, setOpen] = useState(false);
    const wrapperElement = useRef(null);

    const toggleOpen = () => {
        setOpen((previousState) => !previousState);
    };

    return (
        <DropDownContext.Provider value={{ open, setOpen, toggleOpen, wrapperElement }}>
            <div className="relative" ref={wrapperElement}>{children}</div>
        </DropDownContext.Provider>
    );
};

const Trigger = ({ children }) => {
    const { open, setOpen, toggleOpen } = useContext(DropDownContext);

    return (
        <>
            <div onClick={toggleOpen}>{children}</div>

            {/*{open && createPortal(<div className="fixed inset-0 z-40" onClick={() => setOpen(false)}></div>, document.body)}*/}
        </>
    );
};

const Content = ({ align = 'right', width = '48', contentClasses = 'py-1 bg-white', children }) => {
    const { open, setOpen, wrapperElement } = useContext(DropDownContext);

    const dropdownElement = useRef(null);

    let alignmentClasses = 'origin-top';

    if (align === 'left') {
        alignmentClasses = 'origin-top-left left-0';
    } else if (align === 'right') {
        alignmentClasses = 'origin-top-right right-0';
    }

    let widthClasses = '';

    if (width === '48') {
        widthClasses = 'w-48';
    }

    function getPlacement() {

        if(!wrapperElement.current) {
            return {};
        }

        const boundingClientRect = wrapperElement.current.getBoundingClientRect();

        const { top, left, right, bottom, width, height } = boundingClientRect;

        return {
            top: top + height,
            left: left,
            right: right,
            bottom: bottom,
            width: width,
            height: height,
        }
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownElement.current && !dropdownElement.current.contains(event.target)) {
                setOpen(false);
            }
        }

        open
            ? document.addEventListener("mousedown", handleClickOutside)
            : document.removeEventListener("mousedown", handleClickOutside);

        open
            ? document.addEventListener("scroll", handleClickOutside)
            : document.removeEventListener("scroll", handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    return (
        createPortal(
            <>
                <Transition
                    as={Fragment}
                    show={open}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <div className="fixed z-50" style={getPlacement()}>
                        <div
                            className={`absolute z-50 mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses}`}
                            onClick={() => setOpen(false)}
                            ref={dropdownElement}
                        >
                            <div className={`rounded-md ring-1 ring-black ring-opacity-5 ` + contentClasses}>{children}</div>
                        </div>
                    </div>
                </Transition>
            </>
        , document.body)
    );
};

const DropdownLink = ({ href, method = 'post', as = 'a', children }) => {
    return (
        <Link
            href={href}
            method={method}
            as={as}

        >
            {children}
        </Link>
    );
};

const DropdownItem = ({ children, ...props }) => {
    if(props.hidden){
        return null;
    }

    return (
        <div {...props}>{children}</div>
    );
}

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;
Dropdown.Item = DropdownItem;

export default Dropdown;
