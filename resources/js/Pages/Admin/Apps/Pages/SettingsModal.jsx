import EmptyModal from "@/Components/Dialogs/EmptyModal";
import DebugJson from "@/Components/DebugJson";
import FieldRow from "@/Components/Form/FieldRow";
import {useForm, usePage} from "@inertiajs/inertia-react";
import Input from "@/Components/Form/Input";
import Textarea from "@/Components/Form/Textarea";
import Select from "@/Components/Form/Select";
import Button from "@/Components/Button";

function SettingsModal({ open, setOpen, page, ...props }) {

    const {app} = usePage().props;

    const { data, errors, setData, post, processing} = useForm({
        name: page.name,
        description: page.description,
        settings: page.settings ?? {},
    });

    return (
        <EmptyModal
            open={open}
            setOpen={setOpen}
            onClose={() => setOpen(false)}
            title={'Edit: ' + page.name}
            maxWidth={"xl"}
        >
            <div>
                <FieldRow
                    label="Name"
                    widths={['w-1/3', 'w-2/3']}
                >
                    <Input
                        name="name"
                        type="text"
                        value={data.name}
                        handleChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                        className="w-full"
                    />
                </FieldRow>

                <FieldRow
                    label="Description"
                    widths={['w-1/3', 'w-2/3']}
                >
                    <Textarea
                        name="description"
                        type="text"
                        value={data.description}
                        handleChange={(e) => setData('description', e.target.value)}
                        error={errors.description}
                        className="w-full"
                    />
                </FieldRow>
                <FieldRow
                    label={"Default Range date"}
                    widths={['w-1/3', 'w-2/3']}
                >
                    <Select
                        name="settings.default_range_date"
                        type="text"
                        value={data.settings.default_range_date ?? 'this_month'}
                        handleChange={(e) => setData(data => ({...data, settings: {...data.settings, default_range_date: e?.value ?? e}}))}
                        error={errors.settings?.default_range_date}
                        className="w-full"
                        options={[
                            {value: 'today', label: 'Today'},
                            {value: 'yesterday', label: 'Yesterday'},
                            {value: 'this_week', label: 'This week'},
                            {value: 'last_week', label: 'Last week'},
                            {value: 'last_7_days', label: 'Last 7 days'},
                            {value: 'last_30_days', label: 'Last 30 days'},
                            {value: 'this_month', label: 'This month'},
                            {value: 'last_month', label: 'Last month'},
                            {value: 'last_3_months', label: 'Last 3 months'},
                            {value: 'last_6_months', label: 'Last 6 months'},
                            {value: 'this_year', label: 'This year'},
                            {value: 'last_year', label: 'Last year'},
                        ]}
                    />
                </FieldRow>
            </div>

            <div className="mt-4 p-4 flex justify-end border-t">
                <Button
                    className="mr-2"
                    onClick={() => setOpen(false)}
                    color="secondary"
                    negative
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    processing={processing}
                    disabled={processing}
                    onClick={() => post(route('admin.apps.edit.pages.update', [app.id, page.id]), {
                        preserveScroll: true,
                        onSuccess: () => setOpen(false),
                    })}
                >
                    Save
                </Button>
            </div>
        </EmptyModal>
    )
}

export default SettingsModal
