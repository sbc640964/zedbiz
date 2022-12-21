import ContainerPage from "@/Components/Table/ContainerPage";
import Switcher from "@/Components/Form/Switcher";
import RealFieldRow from "@/Pages/Admin/Apps/RealFieldRow";
import {Inertia} from "@inertiajs/inertia";
import Input from "@/Components/Form/Input";
import Select from "@/Components/Form/Select";

function OverViewPageSettings({app, settings, errors}) {

    async function updateSettings(key, value, onBefore, onSuccess) {
        Inertia.post(route('admin.apps.edit.settings.store', app.id), {key, value,}, {
            preserveScroll: true,
            preserveState: true,
            onBefore,
            onSuccess,
        });
    }


    return (
        <ContainerPage
            label="Over View Page"
        >
            <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-2">
                    <RealFieldRow
                        label="Show Over View Page"
                        urlUpdate={updateSettings}
                        name="show_over_view_page"
                        value={settings.show_over_view_page}
                        error={errors.show_over_view_page}
                        children={<Switcher/>}
                    />
                    <RealFieldRow
                        show={settings.show_over_view_page}
                        label="Menu label"
                        urlUpdate={updateSettings}
                        name="over_view_page_menu_label"
                        value={settings.over_view_page_menu_label ?? ''}
                        error={errors.over_view_page_menu_label}
                        children={<Input type="text" className="w-full py-1.5" placeholder="Overview"/>}
                    />
                    <RealFieldRow
                        show={settings.show_over_view_page}
                        label="Over View Page"
                        urlUpdate={updateSettings}
                        name="over_view_page_id"
                        value={settings.over_view_page_id}
                        error={errors.over_view_page_id}
                    >
                        <Select
                            isAsync
                            defaultOptions
                            url={route('admin.apps.edit.pages.picker', app.id)}
                            className="w-full"
                            handleChange={value => updateSettings('over_view_page_id', value?.value ?? value)}
                            placeholder="Select a page"

                        />
                    </RealFieldRow>
                </div>
            </div>
        </ContainerPage>
    )
}

export default OverViewPageSettings
