import {useState} from "react";
import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/20/solid";

function Tree({items, children, ...props}) {


    function handleClickEvent(item) {
        typeof props.onClick === 'function' && props.onClick(item);
    }

    return (
        <div>
            {items.map(item => (
                <Item item={item} onClick={handleClickEvent} key={item.id}>
                    {children}
                </Item>
            ))}
        </div>
    )
}

export default Tree;


function Item({item, children, ...props}) {

    const [open, setOpen] = useState(false);

    return (
        <div key={item.id} className="last:mb-0 mb-0.5">
            {item.children?.length > 0 ? (
                <div>
                    <div onClick={() => setOpen(!open)} className="bold flex items-center justify-between">
                        {typeof children === "function" ? children(item, true) :
                            <>
                                {item.label}
                                <span>
                                            {open ? <ChevronUpIcon className="h-3 w-3"/> : <ChevronDownIcon className="h-3 w-3"/>}
                                        </span>
                            </>
                        }

                    </div>
                    {open && (
                        <div className="ml-2 rtl:ml-0 rtl:mr-2">
                            <Tree items={item.children} {...props}>
                                {children}
                            </Tree>
                        </div>
                    )}
                </div>
            ) : (
                <button onClick={() => props.onClick(item)} className="w-full">
                    {typeof children === "function" ? children(item, false) : item.label}
                </button>
            )}
        </div>
    )
}
