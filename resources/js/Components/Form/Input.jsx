import React, { useEffect, useRef } from 'react';

export default function Input({
    type = 'text',
    name,
    value,
    className,
    autoComplete,
    required,
    isFocused,
    handleChange,
    placeholder,
    color = 'primary',
    ...props
}) {
    const input = useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    const colorClasses = {
        primary: 'focus:border-primary-300 focus:ring-primary-200',
        secondary: 'focus:border-gray-300 focus:ring-gray-200',
        danger: 'focus:border-red-300 focus:ring-red-200',
        success: 'focus:border-green-300 focus:ring-green-200',
        warning: 'focus:border-yellow-300 focus:ring-yellow-200',
    }[color] ?? 'focus:border-primary-300 focus:ring-primary-200';

    const sizeClasses = {
        xs: 'text-xs focus:ring-[1.5px]',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
    }[props?.size] ?? 'text-base';

    return (
        <div className="flex flex-col items-start">
            <input
                type={type}
                name={name}
                value={value}
                className={
                    `placeholder:text-gray-300 border-gray-300 focus:ring-opacity-50 rounded-md shadow-sm ${colorClasses} ${sizeClasses} ` +
                    className
                }
                ref={input}
                autoComplete={autoComplete}
                required={required}
                onChange={(e) => handleChange(e)}
                placeholder={placeholder}
                {...props}
            />
        </div>
    );
}
