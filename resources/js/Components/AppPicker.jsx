import Select from "@/Components/Form/Select";
import {useState} from "react";
import Tooltip from "@/Components/Dialogs/Tooltip";
import {Inertia} from "@inertiajs/inertia";

function Loader() {
    return (
        <div className="flex justify-center items-center">
            <span className="w-5 h-5 animate-spin rounded-full border-2 border-b-primary-500 border-primary-500/50"/>
        </div>
    )
}

function AppPicker({currentApp}) {

    const [modeSearch, setModeSearch] = useState(false);

    function handleChange(newApp) {
        const {value} = newApp;
        Inertia.get(route('admin.apps.edit', {app: value}));
    }

    return (
        <div className="flex-grow relative flex items-center space-x-2 rtl:space-x-reverse">
            <div>
                {currentApp
                    ? <img
                        alt='Application Logo'
                        src={'/storage/' + currentApp.brand}
                        className="w-12"
                    />
                    : <Loader/>
                }

            </div>
            <div className="w-full flex-grow">
                {modeSearch ?
                    <Select
                        name="app"
                        isAsync
                        url={route('admin.apps.picker')}
                        onChange={handleChange}
                        placeholder="Type to search..."
                        className="w-full bg-transparent ring-0 border-0 focus-within:ring-0 focus-within:ring-opacity-50 shadow-none text-sm"
                        autoFocus={true}
                        onBlur={() => setModeSearch(false)}
                        onKeyDown={(e) => e.key === 'Escape' && setModeSearch(false)}
                        openMenuOnFocus={false}
                        openMenuOnClick={false}
                        blurInputOnSelect={true}
                    />
                    : currentApp ? <span className="relative cursor-pointer group">
                        <Tooltip content="Move to other Application" className="[&>div>p]:text-center [&>div>p]:text-xs">
                            <span className="inline-flex flex-col justify-center pt-1" onClick={() => setModeSearch(true)}>
                                <span className="text-md font-bold leading-none group-hover:text-primary-600">{currentApp.name}</span>
                                <span className="text-xs text-gray-400 leading-none group-hover:text-primary-400">{currentApp.domains[0].domain}</span>
                            </span>
                        </Tooltip>
                    </span> : ''
                }
            </div>
        </div>
    )
}

export default AppPicker
