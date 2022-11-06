import Icon from "@/Components/Icon";
import FieldRow from "@/Components/Form/FieldRow";
import TailwindColorPicker from "@/Components/Form/ColorPicker";
import IconPicker from "@/Components/Form/IconPicker";
import Switcher from "@/Components/Form/Switcher";
import Select from "@/Components/Form/Select";
import {useEffect, useState} from "react";
import Button from "@/Components/Button";

function WidgetListFormInput({item:widget, setData, handle, data, remove, ...props}) {

    const [selectColumn, setSelectColumn] = useState(null);

    useEffect(() => {
        setSelectColumn(widget?.column ?
            data.settings?.columns?.find(column => column.id === widget?.column)
            : null
        );
    }, [widget?.column]);

    const getColumns = () => {
        return data.settings?.columns?.map(column => {
            return {
                value: column.id,
                label: column.label,
            }
        });
    }

    function getOptionsAggregation() {
        return [
            {value: 'count', label: 'Count'},
            {value: 'sum', label: 'Sum', types: ['number', 'currency', 'percent']},
            {value: 'avg', label: 'Average', types: ['number', 'currency', 'percent']},
            {value: 'min', label: 'Minimum', types: ['number', 'currency', 'percent', 'datetime']},
            {value: 'max', label: 'Maximum', types: ['number', 'currency', 'percent', 'datetime']},
        ].filter(option => {
            return option.types ? option.types.includes(selectColumn?.type) : true;
        });
    }

    return (
        <FieldRow label={<div className="flex space-x-4 rtl:space-x-reverse">
                <div {...handle}><Icon name="bars-4" className="cursor-move w-4 h-4 text-gray-400 hover:text-gray-500 transition"/></div>
                <div>
                    <input
                        type="text"
                        className="w-full py-1 text-sm p-0 border-0 focus:border-b focus:ring-0 focus:border-0"
                        value={widget?.label}
                        onChange={e => setData('label', e.target.value)}
                    />
                </div>
            </div>}
        >
            <div className="flex space-x-2 rtl:space-x-revers items-center">
                <Switcher
                    value={widget.enabled}
                    handleChange={e => setData('enabled', e.target.value)}
                />
                <IconPicker
                    size="sm"
                    value={widget?.icon}
                    handleChange={e => setData('icon', e)}
                />
                <TailwindColorPicker
                    value={widget?.color}
                    handleChange={e => setData('color', e)}
                    icon={widget?.icon}
                    size="sm"
                />
                <div className="flex-1 w-full flex space-x-4 rtl:space-x-reverse">
                    <Select
                        size="sm"
                        className="w-full"
                        value={widget?.column}
                        handleChange={e => setData('column', e?.value ?? e)}
                        options={getColumns()}
                    />

                    <Select
                        size="sm"
                        className="w-full"
                        value={widget?.aggregations}
                        handleChange={e => setData('aggregations', e)}
                        options={getOptionsAggregation()}
                        isMulti
                    />
                </div>
                <div className="flex justify-end">
                    {typeof remove === 'function' && (
                        <Button
                            icon="trash"
                            negative
                            iconType="outline"
                            size="sm"
                            color="danger"
                            action={remove}
                            doubleClick
                            tooltip="Delete Widget on double click"
                        />
                    )}
                </div>
            </div>
        </FieldRow>
    )

}

export default WidgetListFormInput;
