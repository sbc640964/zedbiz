import Authenticated from "@/Layouts/Authenticated";
import App from "@/Layouts/App";
import {useEffect, useState} from "react";
import {Transition} from "@headlessui/react";
import OverViewPageSettings from "@/Pages/Admin/Apps/Settings/OverViewPageSettings";

function Index(props) {

    const tabs = {
        general: {
            name: 'general',
            label: 'General',
            component: 'GeneralSettings',
        },
        over_view_page: {
            name: 'over_view_page',
            label: 'Over View Page',
            component: OverViewPageSettings,
        }
    }

    const [currentTab, setCurrentTab] = useState(tabs.general);
    const [render, setRender] = useState(false);

    useEffect(() => {
        setRender(true);
    }, []);

    return (
        <div className="flex h-full">
            <Transition
                as="aside"
                show={render}
                enter="transition ease-in-out duration-200"
                enterFrom="transform -translate-x-full"
                enterTo="transform translate-x-0"
                leave="transition ease-in-out duration-200"
                leaveFrom="transform translate-x-0"
                leaveTo="transform -translate-x-full"
                className="w-60 relative bg-white border-r border-gray-200 overflow-y-auto h-full scrollbar"
            >
                <ul>
                    {Object.keys(tabs).map(tab => (
                        <li
                            key={tab}
                            className={`cursor-pointer p-4 py-2 text-sm text-gray-700 ${currentTab.name === tab ? 'text-primary-600' : 'hover:bg-gray-50'}`}
                            onClick={() => setCurrentTab(tabs[tab])}
                        >
                            {tabs[tab].label}
                        </li>
                    ))}
                </ul>
            </Transition>
            <div className="flex-1">
                    {currentTab && <currentTab.component {...props}/>}
            </div>
        </div>
    )
}

Index.layout = page => <Authenticated title={'Settings'}>
    <App children={page}/>
</Authenticated>;

export default Index
