import {usePage} from "@inertiajs/inertia-react";

function App({children}) {
    const {app} = usePage().props;
    return (
        <div className="h-full">
            {children}
        </div>
    )
}

export default App
