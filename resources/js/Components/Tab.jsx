import {Link} from "@inertiajs/inertia-react";
import Icon from "@/Components/Icon";

function Tab({show = true, label, href, active, icon, onClick})
{
    if (!show) return null;

    const Component = active ? 'span' : Link;

    return (
        <li className="z-10">
            <Component
                className={`block transition py-3 px-4 border-b-2 text-sm ${active ? 'border-primary-500 text-primary-600' : 'text-gray-800/80 hover:text-gray-800'}`}
                href={href}
                onClick={onClick}
            >
                <span className="flex space-x-2 rtl:space-x-reverse">
                    {icon &&
                        <Icon name={icon} className={`w-5 h-5`}/>
                    }
                    <span>{label}</span>
                </span>
            </Component>
        </li>
    )
}

export default Tab
