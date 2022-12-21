import React from 'react';

export default function Label({ forInput, value, className, children, inline = false, ...props }) {

    if(props.show === false) return null;

    return (
        <label htmlFor={forInput} className={props?.classLabelName ?? ''}>
            {value && <span className={`${inline ? 'mr-2 rtl:mr-0 rtl:ml-2 align-super' : 'block'} font-medium text-sm text-gray-700 ${className}`}>{value}</span>}
            {children}
        </label>
    );
}
