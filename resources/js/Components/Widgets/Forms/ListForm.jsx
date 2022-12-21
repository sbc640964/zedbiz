import Label from "@/Components/Form/Label";
import Select from "@/Components/Form/Select";
import SqlEditor from "@/Components/Form/SqlEditor";
import Input from "@/Components/Form/Input";
import IconPicker from "@/Components/Form/IconPicker";
import Button from "@/Components/Button";
import ColorPicker from "@/Components/Form/ColorPicker";
import FormatNumberSettingsFields from "@/Components/Admin/FieldsGroups/FormatNumberSettingsFields";
import {useEffect} from "react";

function NumberForm({show = true, step = 1, errors, data, setData, collections}) {

    if (!show) return null;

    useEffect(() => {
        if(data.settings.collection){
            const listsIds = collections.find(c => c.id === data.settings.collection).lists.map(l => l.id);
            if(!listsIds.includes(data.settings.list)){
                setData('settings.list', null);
            }
        }
    }, [data.settings.collection]);

    switch (step) {
        case 1:
            return (
                <>
                    <Label value="Collection">
                        <Select
                            errors={errors.settings?.collection}
                            className="w-full"
                            value={data.settings?.collection}
                            handleChange={e => setData('settings.collection', e?.value ?? e)}
                            options={collections.map(collection => ({value: collection.id, label: collection.name}))}
                        />
                    </Label>

                    {data.settings?.collection &&
                        <Label value="List">
                            <Select
                                errors={errors.settings?.list}
                                className="w-full"
                                value={data.settings?.list}
                                handleChange={e => setData('settings.list', e?.value ?? e)}
                                placeholder="Default List"
                                options={collections.find(collection => collection.id === data.settings?.collection).lists.map(list => ({value: list.id, label: list.name}))}
                            />
                        </Label>
                    }
                </>
            );
        case 2:
            return (
                <>
                    <div className="flex space-x-2 rtl:space-x-reverse items-end">
                        <Label value={'Icon'} classLabelName="flex items-center border rounded-lg space-x-4 rtl:space-x-reverse justify-between pl-2 rtl:pl-0 rtl:pr-2 w-60">
                            <IconPicker
                                errors={errors.settings?.icon}
                                className={`${data.settings?.icon ? '' : 'w-8 h-8'}`}
                                value={data.settings?.icon}
                                handleChange={e => setData('settings.icon', e)}
                            />
                        </Label>
                        {data.settings?.icon && <Button
                            className="mb-0.5"
                            iconOnly
                            icon="x-mark"
                            negative
                            iconType="outline"
                            action={(e) => {
                                e.stopPropagation();
                                setData('settings.icon', null)
                            }}
                        />}
                    </div>

                    <Label value={'Icon Color'} show={!!data.settings?.icon} classLabelName="flex items-center border rounded-lg space-x-4 rtl:space-x-reverse justify-between pl-2 rtl:pl-0 rtl:pr-2 w-60">
                        <ColorPicker
                            errors={errors.settings?.icon_color}
                            value={data.settings?.icon_color}
                            handleChange={e => setData('settings.icon_color', e)}
                            icon={data.settings?.icon}
                        />
                    </Label>

                    <div className="flex space-x-2 rtl:space-x-reverse items-end">
                        <Label value={'Background color'} classLabelName="flex items-center border rounded-lg space-x-4 rtl:space-x-reverse justify-between pl-2 rtl:pl-0 rtl:pr-2 w-60">
                            <ColorPicker
                                errors={errors.settings?.bg_color}
                                className={"!p-1"}
                                tint={100}
                                value={data.settings?.bg_color}
                                handleChange={e => setData('settings.bg_color', e)}
                            />
                        </Label>
                        {data.settings?.bg_color && <Button
                            className="mb-0.5"
                            iconOnly
                            icon="x-mark"
                            negative
                            iconType="outline"
                            action={(e) => {
                                e.stopPropagation();
                                setData('settings.bg_color', null)
                            }}
                        />}
                    </div>

                    <div className="flex divide-x rtl:space-x-reverse border-t mt-2">
                        <div className="w-full px-2">
                            <div className="text-sm font-medium my-1">Primary Value</div>
                            <FormatNumberSettingsFields
                                data={data}
                                setData={setData}
                                errors={errors}
                                prefixPath={'settings.primary_value'}
                            />
                        </div>
                        <div className="w-full px-2">
                            <div className="text-sm font-medium my-1">Compare Value</div>
                            <FormatNumberSettingsFields
                                trendColor
                                data={data}
                                setData={setData}
                                errors={errors}
                                prefixPath={'settings.compare_value'}
                            />
                        </div>
                    </div>
                </>
            );
    }
}

export default NumberForm
