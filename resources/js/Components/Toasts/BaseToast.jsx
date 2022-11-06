import toast from "react-hot-toast";
import {Transition} from "@headlessui/react";
import {useEffect, useState} from "react";
import Icon from "@/Components/Icon";
import CheckAnimate from "@/Components/Icons/CheckAnimate";

function BaseToast({t, title, message, type, onClose }) {

    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(true);
    }, []);

    function close() {
        setOpen(false);
        toast.dismiss(t.id);
    }

    return (
        <Transition
            show={open}
            as="div"
            enter="transition ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:translate-x-4"
            enterTo="opacity-100 translate-y-0 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0 sm:translate-x-0"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:translate-x-4"
            className="bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5"
        >
            <div className="flex-1 p-4 px-6">
                <div className={`flex ${message ? 'items-start' : 'items-center'}`}>
                    <div className="flex-shrink-0 pt-0.5">
                        <CheckAnimate className="w-6 h-6"/>
                    </div>
                    <div className="ml-3 flex-1">
                        <p className="font-light text-gray-700">
                            {title}
                        </p>
                        {message && (
                            <p className="mt-1 text-sm text-gray-500">
                                {message}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            {/*<div className="flex border-l border-gray-200">*/}
            {/*    <button*/}
            {/*        onClick={close}*/}
            {/*        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"*/}
            {/*    >*/}
            {/*        Close*/}
            {/*    </button>*/}
            {/*</div>*/}
        </Transition>
    )
}

export default BaseToast
