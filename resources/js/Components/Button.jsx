import React from 'react';
import Icon from "@/Components/Icon";
import Tooltip from "@/Components/Dialogs/Tooltip";
import LoaderSpinner from "@/Components/LoaderSpinner";

/**
 * @param type {string}
 * @param disabled
 * @param className {string}
 * @param processing {boolean}
 * @param children {React.ReactNode}
 * @param action {function}
 * @param size {string}
 * @param color {string} - primary, secondary, danger, success, warning, info, light, dark
 * @param icon {string}
 * @param iconType {string}
 * @param negative {boolean}
 * @param props {object}
 * @returns {JSX.Element}
 * @constructor
 */
export default function Button({ type, disabled, className = '', processing, children, action, size, color, icon, iconType, negative, ...props }) {

    const iconButton = icon && (!children && props?.label === undefined);

    const colorClass = ({
        'primary': `bg-primary-500 hover:bg-primary-700 active:bg-primary-900 text-white`,
        'secondary': `bg-gray-500 hover:bg-gray-700 active:bg-gray-900 text-white`,
        'danger': `bg-red-500 hover:bg-red-700 active:bg-red-900 text-white`,
        'success': `bg-green-500 hover:bg-green-700 active:bg-green-900 text-white`,
        'warning': `bg-yellow-500 hover:bg-yellow-700 active:bg-yellow-900 text-white`,
    }[color] ?? `bg-primary-500 hover:bg-primary-700 active:bg-primary-900 text-white`);

    const negativeClass = ({
        'primary': 'text-primary-500 hover:bg-primary-50 active:bg-primary-100',
        'secondary': 'text-gray-500 hover:bg-gray-50 active:bg-gray-100',
        'danger': 'text-red-500 hover:bg-red-50 active:bg-red-100',
        'success': 'text-green-500 hover:bg-green-50 active:bg-green-100',
        'warning': 'text-yellow-500 hover:bg-yellow-50 active:bg-yellow-100',
    }[color] ?? 'text-primary-500 hover:bg-primary-50 active:bg-primary-100');

    const sizeClass = ({
        'xs': `${iconButton ? 'p-0.5' :'px-1.5 py-1'} text-xs`,
        'sm': `${iconButton ? 'p-1' : 'px-3 py-1'} text-xs`,
        'md': `${iconButton ? 'p-1' : 'px-4 py-2'} text-xs`,
        'lg': `${iconButton ? 'p-3' : 'px-6 py-3'} text-base`,
        'xl': `${iconButton ? 'p-4' : 'px-8 py-4'} text-base`,
    }[size] ?? `${iconButton ? 'p-1' : 'px-4 py-2'} text-xs`);

    const loaderSize = ({
        'xs': 'w-4 h-4',
        'sm': 'w-4 h-4',
        'md': 'w-5 h-5',
        'lg': 'w-6 h-6',
        'xl': 'w-8 h-8',
    }[size] ?? 'w-5 h-5');

    const loaderColor = ({
        'primary': 'fill-primary-500',
        'secondary': 'fill-gray-500',
        'danger': 'fill-red-500',
        'success': 'fill-green-500',
        'warning': 'fill-yellow-500',
    }[color] ?? 'fill-primary-500');

    const iconSizeClass = ({
        'xs': 'w-4 h-4',
        'sm': 'w-4 h-4',
        'md': 'w-5 h-5',
        'lg': 'w-6 h-6',
        'xl': 'w-8 h-8',
    }[size] ?? 'w-5 h-5');

    //bg-gray-900 border border-transparent active:bg-gray-900 uppercase
    //px-4 py-2 text-xs

    function handleClick(type, e) {
        if((props?.doubleClick && type === 'single') || (!props?.doubleClick && type === 'double')){
            return;
        }
        typeof action === 'function' && action(e);

        if(typeof action !== 'function' && typeof props?.onClick === 'function'){
            props.onClick(e);
        }

    }

    const Component = props?.as ?? ( 'button' );

    const ButtonComponent = () => <Component
            type={type}
            onDoubleClick={(e) => handleClick('double', e)}
            onClick={(e) => handleClick('single', e)}
            role={props?.role ?? 'button'}
            className={
                `cursor-pointer inline-flex space-x-1 items-center ${props?.noupper ? '' : 'uppercase'} rounded-md font-semibold tracking-widest transition ease-in-out duration-150 ${
                    processing && 'opacity-25'
                } ${
                    disabled && 'opacity-50'
                } ${negative ? negativeClass : colorClass } ${sizeClass} ` + className
            }
            disabled={processing || disabled}
        >
        {props?.loadingAtProcessing && processing
            ? <LoaderSpinner className={`${loaderColor} ${loaderSize} w-5 h-5`}/>
            : (
                <>
                    {icon && props?.startIcon && <Icon type={iconType} name={icon} className={iconSizeClass}/>}
                    {(children || props?.label) && <span>{children ?? props?.label ?? ''}</span>}
                    {icon && !props?.startIcon &&
                        <span><Icon type={iconType ?? 'mini'} name={icon} className={iconSizeClass}/></span>}
                </>
            )
        }
        </Component>

    return (
        props?.tooltip
            ? <Tooltip content={props.tooltip} className={`text-center ${props?.tooltipClassName}`} placement={props?.tooltipPlacement ?? 'top'}><span><ButtonComponent/></span></Tooltip>
            : <ButtonComponent />
    );
}
