import React, {useState} from 'react';
import { Link } from '@inertiajs/inertia-react';
import Icon from "@/Components/Icon";
import {collect} from "collect.js";

export default function NavLink({ href, active, icon, iconType, children, as, ...props }) {

    const [openList, setOpenList] = useState(false);

    const Component = as ?? Link;

    const propsItem = collect(props)
        .except(['active', 'icon', 'iconType', 'children', 'as', 'className'])
        .when(Component === Link, items => items.merge({ href }))
        .all();

    const isOpen = props?.links?.length > 0 && (active || props?.isOpen || openList);

    return (
        <>
            <Component
                {...propsItem}
                className={`flex items-center justify-between gap-3 text-sm px-3 py-2 rounded-lg font-medium transition ${active ? 'bg-indigo-500 text-white' : 'bg-transparent hover:bg-gray-500/5 focus:bg-gray-500/5'} ${props?.className ?? ''}`}
            >
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <Icon
                        name={icon ?? 'home'}
                        type={iconType ?? 'outline'}
                        className="h-5 w-5 shrink-0"
                    />

                    <div>
                        <span>{children}</span>
                    </div>
                </div>

                {props?.links?.length > 0 &&
                    <Icon
                        name={isOpen ? 'chevron-up' : 'chevron-down'}
                        type="outline"
                        className="h-4 w-4"
                    />
                }
            </Component>
            {isOpen &&
                <div className="flex pl-2 rtl:pl-0 rtl:pr-2">
                    {props.links.map((link, index) => (
                        <div className="text-sm">
                            {link.label}
                        </div>
                    ))}
                </div>
            }
        </>

    );
}


function SubLink({link, active, as, ...props}) {

    const Component = as ?? Link;

    return (
        <>
            <div className="text-sm">
                {link.label}
            </div>
        </>
    );
}
