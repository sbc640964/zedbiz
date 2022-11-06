import Tab from "@/Components/Tab";
import Tabs from "@/Components/Tabs";
import {usePage} from "@inertiajs/inertia-react";

function CollectionLayout({ children }) {

    const { collection, app } = usePage().props;

    const routeTab = (slug) => route('admin.apps.edit.collections' + (slug ? `.${slug}` : ''), {
        app: app.id,
        collection: collection.id
    });

    return (
        <div>
            <Tabs className="mt-2 mb-4">
                <Tab
                    label="Settings"
                    href={routeTab('edit')}
                    active={route().current('admin.apps.edit.collections.edit')}
                />
                <Tab
                    label="Columns"
                    href={routeTab('columns')}
                    active={route().current('admin.apps.edit.collections.columns')}
                />
                <Tab
                    label="Forms"
                    href={routeTab('forms')}
                    active={route().current('admin.apps.edit.collections.forms')}
                />
                <Tab
                    show={collection.has_table}
                    label="Lists"
                    href={routeTab('lists')}
                    active={route().current('admin.apps.edit.collections.lists')}
                />
                <Tab
                    show={collection.has_table}
                    label="Dashboards"
                    href={routeTab('dashboards')}
                    active={route().current('admin.apps.edit.collections.dashboards')}
                />
                <Tab
                    label="Permissions"
                    href={routeTab('permissions')}
                    active={route().current('admin.apps.edit.collections.permissions')}
                />
                <Tab
                    label="Workflows"
                    href={routeTab('workflows')}
                    active={route().current('admin.apps.edit.collections.workflows')}
                />
            </Tabs>
            <div>
                {children}
            </div>
        </div>
    )
}

export default CollectionLayout
