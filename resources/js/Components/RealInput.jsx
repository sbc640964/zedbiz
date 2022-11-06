import {Children, cloneElement, useEffect, useRef, useState} from "react";

function RealInput({onBlur = true, value:originalValue, name, children, callback, handleChange:handleChange2, input, ...props}) {

    children && !input && !Children.only(children) && console.error('RealInput can only have one child');

    const [value, setValue] = useState(originalValue);

    function handleChange(event) {
        setValue(event.target.value);
        typeof handleChange2 === 'function' && handleChange2(event);
    }

    useEffect(() => {
        setValue(originalValue);
    }, [originalValue]);

    function updateValue(e = null) {
        if (value !== originalValue && typeof callback === "function") {
            callback(name, e ? e.target?.value : value);
        }
    }

    useEffect(() => {

        if(onBlur) return;

        if(typeof callback === 'function' && value !== originalValue){
            const timer = setTimeout(() => {
                updateValue();
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [value]);

    return cloneElement(input ?? children, Object.assign({
        ...props,
        name,
        value,
        handleChange,
        ...(onBlur ? {onBlur: updateValue} : {})
    }));
}

export default RealInput
