import classNames from "classnames";
import {useCallback, useEffect, useRef, useState} from "react";
import Tooltip from "@/Components/Dialogs/Tooltip";
import Icon from "@/Components/Icon";

function Column({ children, className, width, isJustifyBetween, tooltip, show = true, ...props }) {

    if(!show) {
        return null;
    }

    const refEndRenderColumn = useRef(null);

    const { multiRows } = props;

    const classes = classNames([
        {'whitespace-nowrap': !multiRows},
    ]);

    return (
        <div
            className={`flex items-center text-sm py-3 max-w-full px-4 relative ${className}`}
            style={{flex: `${width ? 0 : 1} 0 ${width ? width : 0}px`, minWidth: `${width ?? 100}px`}}
        >
            <div
                className={`${classes} text-ellipsis overflow-hidden ${isJustifyBetween ? 'w-full' : ''}`}
            >
                {tooltip ? (
                    <>
                        <Tooltip
                            content={children}
                            delay={500}
                        >
                            {children}
                        </Tooltip>
                    </>
                ) : children}
            </div>
            <span ref={refEndRenderColumn}></span>
        </div>
    )
}

export default Column
