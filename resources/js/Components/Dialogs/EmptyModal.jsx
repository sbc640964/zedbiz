import {Portal} from "react-portal";
import {Transition} from "@headlessui/react";
import {useEffect, useRef, useState} from "react";

function EmptyModal({ closeable = true, children, onClose, maxWidth, onOpen, open, setOpen, closeOnOverlayClick = true, title }) {

    const [isShowing, setIsShowing] = useState(false);
    const [heightBox, setHeightBox] = useState(0);

    const refWrapper = useRef(null);

    const close = () => {
        setIsShowing(false);
    }

    useEffect(() => {
        setHeightBox(refWrapper.current?.scrollHeight ?? 0);
    }, [refWrapper.current?.scrollHeight]);

    useEffect(() => {
        if (isShowing && open) {
            typeof onOpen === 'function' && onOpen();
        } else {
            const timer = setTimeout(() => {
                setOpen(false);
                typeof onClose === 'function' && onClose();
            }, 250);

            return () => clearTimeout(timer);
        }
    }, [isShowing]);

    useEffect(() => {
        if (open) {
            setIsShowing(true);
        } else {
            close();
        }
    }, [open]);


    function updateHeight(e) {
        setHeightBox(refWrapper.current?.scrollHeight ?? 0);
    }

    const maxWidthModal = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
        '3xl': 'sm:max-w-3xl',
        '4xl': 'sm:max-w-4xl',
        '5xl': 'sm:max-w-5xl',
        '6xl': 'sm:max-w-6xl',
        '7xl': 'sm:max-w-7xl',
        'full' : 'sm:max-w-full'
    } [maxWidth] ?? 'sm:max-w-2xl';

    if(!open) return null;

    const CloseButton = ({noAbsolute = false}) => <button
        type="button"
        className={`focus:outline-none ${noAbsolute ? '' : 'z-10 absolute top-0 right-0 mt-4 mr-4'}`}
        onClick={close}
    >
        <svg className="h-6 w-6 text-gray-400 hover:text-gray-500" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    </button>

    return (
        <Portal>
            <div
                ref={refWrapper}
                className={`min-h-screen w-full fixed inset-0 z-50 overflow-auto`}
                onScroll={updateHeight}
            >
                <Transition
                    show={isShowing}
                    enter="duration-300 ease-out"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="duration-200 ease-in"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    className="transition-all bg-black/20 absolute inset-0 w-full h-full"
                    onClick={closeOnOverlayClick ? close : null}
                    style={{height: heightBox + 'px'}}
                />

                <Transition
                    as="div"
                    className={`absolute transform ${maxWidthModal} top-10 left-1/2 -translate-x-1/2 sm:w-full`}
                    show={isShowing}
                    enter="transform duration-300 ease-out"
                    leave="transform duration-200 ease-in"
                    leaveFrom="translate-y-0 opacity-100 sm:scale-100"
                    leaveTo="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
                    enterFrom="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
                    enterTo="translate-y-0 opacity-100 sm:scale-100"
                >
                    <div className="rounded-lg overflow-hidden shadow-xl z-50">
                        <div tabIndex={0} className={`relative transition-all bg-white shadow-xl sm:w-full ${maxWidthModal} focus:outline-0`}>
                            {title && (
                                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                                    {closeable && <CloseButton noAbsolute/>}
                                </div>
                            )}

                            {closeable && !title && <CloseButton/>}

                            {typeof children === 'function' ? children({close}) : children}
                        </div>
                    </div>

                    <div className="h-16" onClick={closeOnOverlayClick ? close : null}/>
                </Transition>
            </div>
        </Portal>
    )
}

export default EmptyModal
