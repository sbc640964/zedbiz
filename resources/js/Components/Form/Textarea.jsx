import React, { useEffect, useRef } from 'react';

function Textarea({
  name,
  value,
  className,
  required,
  isFocused,
  handleChange,
  placeholder,
  color = 'primary',
  rows = 3,
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

    return (
        <div className="flex flex-col items-start">
            <textarea
                name={name}
                value={value}
                className={
                    `placeholder:text-gray-300 placeholder:text-sm border-gray-300 focus:ring focus:ring-opacity-50 rounded-md shadow-sm ${colorClasses} ` +
                    className
                }
                ref={input}
                required={required}
                onChange={(e) => handleChange(e)}
                placeholder={placeholder}
                rows={rows}
                {...props}
            />
            {props.errors && <InputError message={props.errors}/>}
        </div>
    );
}


export default Textarea;
