import Switcher from "@/Components/Form/Switcher";
import IconPicker from "@/Components/Form/IconPicker";
import TailwindColorPicker from "@/Components/Form/ColorPicker";
import Input from "@/Components/Form/Input";
import Select from "@/Components/Form/Select";
import Button from "@/Components/Button";
import FieldRow from "@/Components/Form/FieldRow";
import {useState} from "react";
import Icon from "@/Components/Icon";
import ActionModalInputs from "@/Components/Admin/ActionModalInputs";

function ActionFormInputs({handle, remove, label, show, setData, errors, disabled, collection, collections, item: action, ...props}) {
    if(!show){
        return null;
    }

    const [openSettings, setOpenSettings] = useState(false);

    return (
        <>
            <FieldRow label={<div className="flex space-x-4 rtl:space-x-reverse">
                <div {...handle}><Icon name="bars-4" className="cursor-move w-4 h-4 text-gray-400 hover:text-gray-500 transition"/></div>
                <div>{action.label}</div>
            </div>} description="">
                <div className="flex space-x-2 rtl:space-x-revers items-center">
                    <Switcher
                        value={action.enabled}
                        handleChange={e => setData('enabled', e.target.value)}
                    />
                    <IconPicker
                        size="sm"
                        value={action?.icon}
                        handleChange={e => setData('icon', e)}
                    />
                    <TailwindColorPicker
                        value={action?.color}
                        handleChange={e => setData('color', e)}
                        icon={action?.icon}
                        size="sm"
                    />
                    <div>
                        <Button
                            tooltip={action.grouped ? 'Ungroup' : 'Group'}
                            // className="p-[4px] border border-gray-300"
                            color=""
                            icon="ellipsis-vertical"
                            size=""
                            negative={!action.grouped}
                            iconType="outline"
                            action={() => setData('grouped', !action.grouped)}
                        />
                    </div>
                    <div className="flex-1">
                        <Input
                            className="w-full py-1 text-sm"
                            value={action?.label}
                            handleChange={e => setData('label', e.target.value)}
                            placeholder={action?.label}
                        />
                    </div>

                    <div className="flex-1">
                        {['list', 'form'].includes(action?.type) || (!action.type) && (
                            <Select
                                className="w-full py-[0.151rem] text-sm"
                                value={action?.[action.type ?? 'form']}
                                handleChange={e => setData(action.type ?? 'form', e?.value ?? e)}
                                placeholder={`Default ${action.type ?? 'form'}`}
                                options={collection?.[(action.type ?? 'form') + 's'] ?? []}
                                size="xs"
                            />
                        )}
                    </div>
                    <div>
                        <Button
                            icon="cog-8-tooth"
                            negative
                            iconType="outline"
                            size="sm"
                            action={() => setOpenSettings(!openSettings)}
                        />
                        {typeof remove === 'function' && (
                            <Button
                                icon="trash"
                                negative
                                iconType="outline"
                                size="sm"
                                color="danger"
                                action={remove}
                                doubleClick
                                tooltip="Delete action on double click"
                            />
                        )}

                    </div>

                </div>
            </FieldRow>
            <ActionModalInputs
                action={action}
                setData={setData}
                setOpen={setOpenSettings}
                open={openSettings}
                collection={collection}
                collections={collections}
            />
        </>
    )
}

export default ActionFormInputs
