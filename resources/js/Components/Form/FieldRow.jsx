import InputError from "@/Components/Form/InputError";
import LoaderSpinner from "@/Components/LoaderSpinner";
import Icon from "@/Components/Icon";
import {useEffect, useState} from "react";

function FieldRow({label, withLabel = true, description, widths = [], className,show = true, children, required = false, errors, ...props}) {
    if (!show) return null;

    const [loadingCheck, setLoadingCheck] = useState(false);
    const [booted, setBooted] = useState(false);

    useEffect(() => {

        if(booted){
            !props?.loading && setLoadingCheck(true);

            const timer = setTimeout(() => {
                setLoadingCheck(false);
            }, 1000);

            return () => clearTimeout(timer);
        } else {
            setBooted(true);
        }

    }, [props?.loading]);

    return (
        <div className={`${props?.disabled ? 'opacity-50 select-none' : ''} flex py-4 pl-4 rtl:pl-0 rtl:pr-4 items-center border-b border-gray-300 last:border-b-0 ${className}`}>
            {withLabel &&
                <div className={`${widths?.[0] ?? 'w-1/2'}`}>
                    <div className="text-sm">
                        {label} {required && <span className="text-red-500">*</span>}
                    </div>
                    {description && <div className="text-xs w-2/3 text-gray-500">{description}</div>}
                </div>
            }
            <div className={`${!withLabel ? 'w-full' : (widths?.[1] ?? 'w-1/2')} flex`}>
                <div className="flex-grow">
                    {children}
                    {errors && <InputError message={errors} className="text-xs"/>}
                </div>
                <div className="w-12 flex justify-center items-center">
                    { props?.hasError
                        ? <Icon name="x-mark" className="w-5 h-5 text-red-500"/>
                        : (
                            props?.loading
                                ? <LoaderSpinner className="w-5 h-5 fill-primary-500"/>
                                : loadingCheck && <Icon name="check" className="w-5 h-5 text-green-500"/>
                        )

                    }
                </div>
            </div>
        </div>
    )
}

export default FieldRow
