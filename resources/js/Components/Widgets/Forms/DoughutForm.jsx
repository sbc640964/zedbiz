import Label from "@/Components/Form/Label";
import Select from "@/Components/Form/Select";
import SqlEditor from "@/Components/Form/SqlEditor";
import Input from "@/Components/Form/Input";
import IconPicker from "@/Components/Form/IconPicker";
import Button from "@/Components/Button";
import ColorPicker from "@/Components/Form/ColorPicker";
import FormatNumberSettingsFields from "@/Components/Admin/FieldsGroups/FormatNumberSettingsFields";

function DoughnutForm ({show = true, step = 1, errors, data, setData, collections}) {

    if (!show) return null;

    switch (step) {
        case 1:
            return (
                <>
                    <Label value="Mode">
                        <Select
                            errors={errors.settings?.mode}
                            className="w-full"
                            value={data.settings?.mode}
                            handleChange={e => setData('settings.mode', e?.value ?? e)}
                            options={[
                                {value: 'sql_raw', label: 'SQL Raw'},
                                {value: 'Builder', label: 'Builder', isDisabled: true},
                            ]}
                        />
                    </Label>
                    {data.settings?.mode === 'sql_raw' && (
                        <>
                            <Label value={'Sql Raw'}>
                                <SqlEditor
                                    errors={errors.settings?.sql_raw}
                                    handleChange={e => setData('settings.sql', e)}
                                    value={data.settings?.sql}
                                    fontSize={14}
                                    height={'200px'}
                                    tables={collections}
                                />
                            </Label>

                            <div className="flex space-x-4 rtl:space-x-reverse">
                                <Label value="Labels selector" classLabelName="w-full">
                                    <Input
                                        errors={errors.settings?.labels_selector}
                                        className="w-full"
                                        value={data.settings?.labels_selector}
                                        handleChange={e => setData('settings.labels_selector', e.target.value)}
                                    />
                                </Label>
                                <Label value="Color">
                                    <ColorPicker
                                        errors={errors.settings?.color_data}
                                        className=""
                                        value={data.settings?.color_data}
                                        handleChange={e => setData('settings.color_data', e)}
                                    />
                                </Label>
                            </div>

                            <div className="flex space-x-4 rtl:space-x-reverse">
                                <Label value="Values selector" classLabelName="w-full">
                                    <Input
                                        errors={errors.settings?.values_selector}
                                        className="w-full"
                                        value={data.settings?.values_selector}
                                        handleChange={e => setData('settings.values_selector', e.target.value)}
                                    />
                                </Label>

                                <Label value="Label data" classLabelName="w-full">
                                    <Input
                                        errors={errors.settings?.label_data}
                                        className="w-full"
                                        value={data.settings?.label_data}
                                        handleChange={e => setData('settings.label_data', e.target.value)}
                                    />
                                </Label>
                            </div>
                        </>
                    )}
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

export default DoughnutForm
