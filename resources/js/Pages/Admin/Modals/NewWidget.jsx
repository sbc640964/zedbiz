import EmptyModal from "@/Components/Dialogs/EmptyModal";
import Label from "@/Components/Form/Label";
import Input from "@/Components/Form/Input";
import {useForm, usePage} from "@inertiajs/inertia-react";
import Textarea from "@/Components/Form/Textarea";
import Tabs from "@/Components/Tabs";
import {useEffect, useState} from "react";
import {cloneDeep, isEqual, set} from "lodash";
import Button from "@/Components/Button";
import NumberForm from "@/Components/Widgets/Forms/NumberForm";
import ChartForm from "@/Components/Widgets/Forms/ChartForm";
import Select from "@/Components/Form/Select";
import DoughutForm from "@/Components/Widgets/Forms/DoughutForm";
import ListForm from "@/Components/Widgets/Forms/ListForm";

function NewWidget({ open, setOpen, widget, pageId }) {

    const {collections, app} = usePage().props;
    const {data, setData:setDataForms, errors, post, setDefaults, processing, clearErrors} = useForm();
    const [currentTab, setCurrentTab] = useState(0);

    const tabs = [
        'General',
        'Data',
        'Style & Format',
    ];

    function setData(key, value) {
        if(key.indexOf('.') !== -1) {
            const primaryKey = key.split('.')[0];
            const newValue = data[primaryKey] || {};
            set(newValue, key.replace(primaryKey + '.', ''), value);
            setDataForms(primaryKey, newValue);
        }else{
            setDataForms(key, value);
        }
    }

    function submit() {

        if(!isDirty()) {
            return;
        }

        const options = {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
        }

        widget?.id
            ? post(route('admin.apps.edit.widgets.update', {app: app.id, widget: widget.id}), options)
            : post(route('admin.apps.edit.widgets.store', {app: app.id}), options);
    }

    const defaults = {
        name: '',
        description: '',
        settings: {
            mode: 'sql_raw',
        },
        type: typeof open === 'string' ? open.toLowerCase().replace(' ', '_') : '',
        page_id: pageId ?? null,
    }

    useEffect(() => {
        if(open){
            setDataForms(cloneDeep(widget?.id ? widget : defaults));
            setDefaults();
            setCurrentTab(0);
            clearErrors();
        }
    }, [open]);

    function isDirty() {
        if(!widget?.id) {
            return !isEqual(defaults, data);
        }
        return !isEqual(data, widget);
    }

    return (
        <EmptyModal
            open={!!open}
            setOpen={setOpen}
            title={`${widget?.id ? 'Update' : 'New'} Widget ${typeof open === 'string' ? open : widget.name}`}
            className="w-1/2"
        >
            {({close}) => (
                <>
                    <Tabs>
                        {tabs.map((tab, index) => (
                            <Tabs.Tab
                                onClick={() => setCurrentTab(index)}
                                active={currentTab === index}
                                key={index}
                                label={tab}
                                className="w-1/3"
                                alignCenter
                            >
                                {tab}
                            </Tabs.Tab>
                        ))}
                    </Tabs>
                    {currentTab === 0 && (
                        <div className="p-4 flex flex-col space-y-4">
                            <Label value={'Name'}>
                                <Input
                                    errors={errors.name}
                                    className="w-full"
                                    value={data.name}
                                    handleChange={e => setData('name', e.target.value)}
                                />
                            </Label>

                            <Label value={'Description'}>
                                <Textarea
                                    errors={errors.description}
                                    className="w-full"
                                    value={data.description}
                                    handleChange={e => setData('description', e.target.value)}
                                />
                            </Label>

                            <Label value="Width">
                                <Select
                                    errors={errors.settings?.width}
                                    className="w-full"
                                    value={data.settings?.width}
                                    handleChange={e => setData('settings.width', e?.value ?? e)}
                                    placeholder="Full Width"
                                    options={[
                                        {value: '1/1', label: 'Full Width'},
                                        {value: '1/2', label: 'Half Width (1/2)'},
                                        {value: '1/3', label: 'Third Width (1/3)'},
                                        {value: '1/4', label: 'Quarter Width (1/4)'},
                                        {value: '2/3', label: 'Two Thirds Width (2/3)'},
                                        {value: '3/4', label: 'Three Quarters Width (3/4)'},
                                    ]}
                                />
                            </Label>
                        </div>
                    )}
                    {currentTab === 1 && (
                        <div className="p-4 flex flex-col space-y-4">
                            <NumberForm show={data.type === 'number'} step={1} data={data} setData={setData} errors={errors} collections={collections}/>
                            <ChartForm show={data.type === 'chart'} data={data} setData={setData} errors={errors} collections={collections}/>
                            <DoughutForm show={data.type === 'doughnut'} step={1} data={data} setData={setData} errors={errors} collections={collections}/>
                            <ListForm show={data.type === 'list'} step={1} data={data} setData={setData} errors={errors} collections={collections}/>
                        </div>
                    )}
                    {currentTab === 2 && (
                        <div className="p-4 flex flex-col space-y-4">
                            <NumberForm show={data.type === 'number'} step={2} data={data} setData={setData} errors={errors} collections={collections}/>
                        </div>
                    )}

                    <div className="py-4 px-4 border-t flex justify-end space-x-2 rtl:space-x-reverse">
                        <Button
                            color="secondary"
                            negative
                            action={close}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            action={submit}
                            loading={processing}
                            disabled={processing || !isDirty()}
                        >
                            {widget?.id ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </>
            )}
        </EmptyModal>

    )
}

export default NewWidget;
