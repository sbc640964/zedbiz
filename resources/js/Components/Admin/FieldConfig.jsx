import Button from "@/Components/Button";
import Label from "@/Components/Form/Label";
import {useState} from "react";
import Input from "@/Components/Form/Input";
import Switcher from "@/Components/Form/Switcher";

function FieldConfig({field, action, setData, errors, collections, collection}) {

    const [open, setOpen] = useState(false);
    const [openDb, setOpenDb] = useState(false);

    function openExtend(type)
    {
        if(type === 'db') {
            setOpenDb(o => !o);
            setOpen(false);
        } else {
            setOpen(o => !o);
            setOpenDb(false);
        }

    }

    return (
        <div className="border-t first:mt-0 first:border-t-0 first:pt-0 pb-1">
            <div
                className="text-sm mt-2 pt-1 flex items-center space-x-2 rtl:space-x-reverse justify-between"
            >
                <div className="mb-1 text-gray-700 font-semibold">{field.label} <span
                    className="text-xs bg-gray-300 px-1 rounded-full text-gray-500 font-light">{field.type}</span>
                </div>
                <div>
                    {field.type === 'relation' && (
                        <Button
                            tooltip="Set query options"
                            icon="circle-stack"
                            negative
                            iconType="outline"
                            className="transition-colors duration-200"
                            color={action?.config?.[field.id]?.query?.enabled ? 'primary' : 'secondary'}
                            action={() => openExtend('db')}
                        />
                    )}
                    <Button
                        tooltip={action?.config?.[field.id]?.hidden ? 'Hidden' : 'Visible'}
                        icon={action?.config?.[field.id]?.hidden ? 'eye-slash' : 'eye'}
                        negative
                        disabled={field?.required && (!field?.default && !action?.config?.[field.id]?.defaultValue)}
                        iconType="outline"
                        className="transition-colors duration-200"
                        color={action?.config?.[field.id]?.hidden ? 'secondary' : 'primary'}
                        action={() => setData(`config.${field.id}.hidden`, !action?.config?.[field.id]?.hidden)}
                    />
                    <Button
                        tooltip={(action?.config?.[field.id]?.required ?? field.required) ? 'Required' : 'Optional'}
                        icon={(action?.config?.[field.id]?.required ?? field.required) ? 'check' : 'x-mark'}
                        negative
                        disabled={field?.required}
                        iconType="outline"
                        className="transition-colors duration-200"
                        color={(action?.config?.[field.id]?.required ?? field.required) ? 'primary' : 'secondary'}
                        action={() => setData(`config.${field.id}.required`, !!!(action?.config?.[field.id]?.required ?? field.required))}
                    />
                    <Button
                        tooltip="Fill with default value"
                        icon="cog-6-tooth"
                        negative
                        iconType="outline"
                        className="transition-colors duration-200"
                        color={action?.config?.[field.id]?.default ? 'primary' : 'secondary'}
                        action={() => openExtend('default')}
                    />
                </div>
            </div>
            {open &&
                <div className="mt-2 flex flex-col space-y-2 border rounded-lg p-2">
                    <Label
                       value="Default value"
                       className="text-xs"
                    >
                        <Input
                            type="text"
                            className="text-xs py-1 px-1.5 w-full"
                            value={action?.config?.[field.id]?.defaultValue ?? ''}
                            handleChange={e => setData(`config.${field.id}.defaultValue`, e.target.value)}
                        />
                    </Label>

                    <span className="">
                        <span className="text-xs font-medium text-gray-700">Read only</span>
                        <Switcher
                            size="sm"
                            className="ml-2 rtl:mr-2 rtl:ml-0 inline"
                            value={action?.config?.[field.id]?.readOnly ?? false}
                            handleChange={e => setData(`config.${field.id}.readOnly`, e.target.value)}
                            disabled={!action?.config?.[field.id]?.defaultValue}
                        />
                    </span>
                </div>
            }
            {openDb &&
                <div className="mt-2 flex flex-col space-y-2 border rounded-lg p-2">
                     <span className="">
                        <span className="text-xs font-medium text-gray-700">Enabled</span>
                        <Switcher
                            size="sm"
                            className="ml-2 rtl:mr-2 rtl:ml-0 inline"
                            value={action?.config?.[field.id]?.query?.enabled ?? false}
                            handleChange={e => setData(`config.${field.id}.query.enabled`, e.target.value)}
                        />
                    </span>
                    <Label
                        value="Query options"
                        className="text-xs"
                    >
                        <Input
                            type="text"
                            className="text-xs py-1 px-1.5 w-full"
                            value={action?.config?.[field.id]?.query?.statement ?? ''}
                            handleChange={e => setData(`config.${field.id}.query.statement`, e.target.value)}
                        />
                    </Label>
                </div>
            }
        </div>
    )
}

export default FieldConfig
