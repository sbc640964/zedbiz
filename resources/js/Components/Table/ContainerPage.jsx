import Fallback from "@/Components/Fallback";
import {Transition} from "@headlessui/react";
import {useEffect, useState} from "react";

function ContainerPage({label, actions = [], className, fallback, children, inner, ...props}) {

    const [transition, setTransition] = useState(false);

    useEffect(() => {
        setTransition(true);
        return () => setTransition(false);
    }, []);

    function getActionFallback() {

        const {fallbackAction} = props;

        if(Array.isArray(fallbackAction) || typeof fallbackAction === 'object') {
            return fallbackAction;
        }

        return actions[fallbackAction ?? 0];
    }

    if(props.hiddenContinerWrapper) {
        return (
            <div className={className}>
                {children}
            </div>
        );
    }

    return (
        <Transition
            key={label}
            show={transition}
            enter="transition transform ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className={`${inner ? '' : 'py-12'}`}>
                <div className={inner ? "w-full" : "max-w-7xl mx-auto sm:px-6 lg:px-8"}>
                    {props?.hiddenHeader ? null
                        : <div className="flex items-center justify-between mb-4">
                            <h1 className="text-3xl font-bold leading-none">{label}</h1>
                            <div className="flex space-x-2 rtl:space-x-reverse">
                                {actions ?? null}
                            </div>
                        </div>
                    }

                    <div className={`bg-white border border-gray-300 overflow-hidden shadow-sm sm:rounded-lg ${className}`}>
                        {fallback && !props?.hiddenFallback
                            ? <Fallback
                                image={props?.fallbackImage ?? null }
                                title={props?.fallbackTitle ?? `No item have been created yet`}
                                description={props?.fallbackDescription ?? `You can create one by clicking the button below`}
                                action={getActionFallback()}
                            />
                            : children
                        }
                    </div>
                </div>
            </div>
        </Transition>
    )
}

export default ContainerPage
