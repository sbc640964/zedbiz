import classNames from "classnames";
import {useEffect, useRef, useState} from "react";
import Tooltip from "@/Components/Dialogs/Tooltip";
import Icon from "@/Components/Icon";

function Column({ children, className, width, isJustifyBetween, tooltip, show = true, ...props }) {

    if(!show) {
        return null;
    }

    const { multiRows } = props;
    const [isTooltipContainer, setIsTooltipContainer] = useState(false);
    const refColumnOverflowHidden = useRef(null);

    useEffect(() => {
       setIsTooltipContainer(refColumnOverflowHidden.current?.offsetWidth < refColumnOverflowHidden.current?.scrollWidth);
    }, []);

    const classes = classNames([
        {'whitespace-nowrap': !multiRows},
    ]);

    return (
        <div
            className={`flex items-center text-sm py-3 max-w-full px-4 relative ${className}`}
            style={{flex: `${width ? 0 : 1} 0 ${width ? width : 0}px`, minWidth: `${width ?? 100}px`}}
        >
            <div ref={refColumnOverflowHidden} className={`${classes} text-ellipsis overflow-hidden ${isJustifyBetween ? 'w-full' : ''}`}>
                {isTooltipContainer ? (
                    <>
                        <Tooltip
                            className="!bg-white"
                            content={children}
                        >
                            <span className="inline mr-1 rtl:mr-0 rtl:ml-1 cursor-pointer"><Icon className="inline w-4 h-4 text-gray-500/50 stroke-1" name="ellipsis-horizontal-circle"/></span>
                        </Tooltip>
                        {children}
                    </>
                ) : children}
            </div>
        </div>
    )
}

export default Column
