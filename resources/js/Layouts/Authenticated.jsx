import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import {Toaster} from "react-hot-toast";
import {useEffect} from "react";
import {Head, usePage} from "@inertiajs/inertia-react";
import {addToast} from "@/helpers";
import AppPicker from "@/Components/AppPicker";
import Button from "@/Components/Button";
import {Inertia} from "@inertiajs/inertia";
import Tooltip from "@/Components/Dialogs/Tooltip";
import useModalWindow from "@/Uses/useModalWindow";

export default function Authenticated({children, title}) {

    const page = usePage();

    const {ModalsBar} = useModalWindow();

    const {toast, auth, app} = page.props;

    useEffect(() => {
        if(toast && !page.props.popstate) {
            addToast(toast.message, toast?.description, toast.type);
            page.props.popstate = true;
        }
    }, [toast]);

    const isApp = () => route().current('admin.apps.*') && app;

    return (
        <div>
            <Head>
                <title>
                    {title}
                </title>
            </Head>
            <div className="min-h-screen bg-gray-100 flex">
                <aside className="w-72 min-h-screen bg-white overflow-y-auto shadow-2xl shadow-gray-300 z-10 fixed">
                    <nav className="bg-white border-gray-200 pb-4 flex flex-col flex-grow overflow-y-auto">
                        <div
                            className="flex items-center flex-shrink-0 px-4 space-x-2 rtl:space-x-reverse h-16 border-b"
                        >
                            {isApp()
                                ? <>
                                    <Tooltip content="Return to primary app">
                                        <span>
                                            <Button
                                                icon="arrow-left"
                                                className="px-1"
                                                action={() => Inertia.get(route('admin.apps'))}
                                                color={'secondary'}
                                                negative
                                            />
                                        </span>
                                    </Tooltip>
                                    <AppPicker currentApp={app}/>
                                </>
                                : <>
                                    <ApplicationLogo className="block h-9 w-auto"/>
                                    <span className="font-bold text-xl text-cyan-700">Jet Zed Manager</span>
                                </>

                            }
                        </div>
                        <div className="mt-5 flex-grow flex flex-col">
                            <nav className="flex-1 px-4 bg-white space-y-1">
                                {isApp()
                                    ? <>
                                        <NavLink href={''} active={route().current('dashboard')}>
                                            App Overview
                                        </NavLink>

                                        <NavLink href={route('admin.apps.edit.collections', {app: app.id})} active={route().current('admin.apps.edit.collections', {app: app.id})} icon={'circle-stack'}>
                                            Collections
                                        </NavLink>

                                        {/*<NavLink href={route('admin.apps.edit.menu', app.id)} active={route().current('admin.apps.edit.menu', app.id)} icon={'bars-4'}>*/}
                                        {/*    Menu*/}
                                        {/*</NavLink>*/}

                                        <NavLink href={route('admin.users')} active={route().current('dashboard')} icon={'chart-pie'}>
                                            Dashboards
                                        </NavLink>

                                        <NavLink href={route('admin.users')} active={route().current('dashboard')} icon={'users'}>
                                            Users
                                        </NavLink>

                                        <NavLink href={''} active={''} icon={'credit-card'}>
                                            Billing
                                        </NavLink>
                                    </>
                                    : <>
                                        <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                            Dashboard
                                        </NavLink>

                                        <NavLink href={route('admin.apps')} active={route().current('admin.apps')} icon={'building-office-2'}>
                                            Apps
                                        </NavLink>

                                        <NavLink href={route('admin.users')} active={route().current('admin.users')}
                                                 icon={'users'}>
                                            Users
                                        </NavLink>

                                        <NavLink href={''} active={''} icon={'credit-card'}>
                                            Payments
                                        </NavLink>
                                    </>
                                }
                            </nav>
                        </div>
                    </nav>
                </aside>
                <div className="flex-1 ml-72 rtl:ml-0 rtl:mr-72">
                    <nav className="w-full border-b h-16 px-2 flex items-center justify-between">
                        <div></div>
                        <div className="ml-3 relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {auth.user.name}

                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </nav>
                    <div className="h-[calc(100vh-4rem)]">
                        {/*{header && (*/}
                        {/*    <header className="bg-white shadow">*/}
                        {/*        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>*/}
                        {/*    </header>*/}
                        {/*)}*/}
                        <main className="h-full">{children}</main>
                    </div>
                </div>
            </div>
            <Toaster
                position="bottom-right"
            />
            <ModalsBar key="modals"/>
        </div>
    );
}
