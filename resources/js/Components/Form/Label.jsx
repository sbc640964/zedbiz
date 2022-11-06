import React from 'react';

export default function Label({ forInput, value, className, children, inline = false }) {
    return (
        <label htmlFor={forInput}>
            {value && <span className={`${inline ? 'mr-2 rtl:mr-0 rtl:ml-2' : 'block'} font-medium text-sm text-gray-700 ${className}`}>{value}</span>}
            {children}
        </label>
    );
}
