import {Link} from "@inertiajs/inertia-react";
import Icon from "@/Components/Icon";

function Paginator({links, ajax}) {

    const linksWithoutFirstAndLast = links.filter((link, index) => index !== 0 && index !== links.length - 1);

    return (
        <div className="py-3 border rounded-md dark:border-gray-600">
            <ol className="flex items-center text-sm text-gray-500 divide-x rtl:divide-x-reverse divide-gray-300">
                {links[0].url &&
                    <PaginatorLink
                        link={links[0]}
                        label={<Icon type="solid" name="chevron-left" className="text-primary-600 w-4 h-4"/>}
                        ajax={ajax}
                    />
                }
                {linksWithoutFirstAndLast.map((link, index) => {
                    return (
                        <PaginatorLink link={link} key={link.url ?? index} ajax={ajax}/>
                    )
                })}
                {links[links.length - 1].url &&
                    <PaginatorLink
                        link={links[links.length - 1]}
                        label={<Icon type="solid" name="chevron-right" className="text-primary-600 w-4 h-4"/>}
                        ajax={ajax}
                    />
                }
            </ol>
        </div>
    )
}

export default Paginator

function PaginatorLink({link, label, ajax}) {

    const Component = link.url && !ajax ? Link : 'span';

    const classes = link.active
        ? 'text-primary-600 focus:underline bg-primary-500/10 ring-2 ring-primary-500'
        : (link.url ? 'cursor-pointer hover:bg-gray-500/5 focus:bg-primary-500/10 focus:ring-2 focus:ring-primary-500 focus:text-primary-600' : 'opacity-50');

    const propsLink = Component === Link && link.url ? {
        href: link.url,
        preserveScroll: true,
        preserveState: true,
    } : (link.url ? {
        onClick: () => ajax(link.url)
    }: {});

    return (
        <li className="">
            <Component
                className={`text-sm relative flex items-center justify-center font-medium min-w-[2rem] px-1.5 h-8 -my-3 rounded-md focus:outline-none transition ${classes}`}
                {...propsLink}
            >
                <span>
                   {label ?? link.label}
                </span>
            </Component>
        </li>
    )
}
