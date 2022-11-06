import Icon from "@/Components/Icon";
import FieldRow from "@/Components/Form/FieldRow";
import Button from "@/Components/Button";
import {useState} from "react";
import {Transition} from "@headlessui/react";
import Input from "@/Components/Form/Input";
import SectionCard from "@/Components/Card/SectionCard";
import Select from "@/Components/Form/Select";
import Switcher from "@/Components/Form/Switcher";
import ActionColumnForm from "@/Components/Admin/ActionColumnForm";
import IconPicker from "@/Components/Form/IconPicker";
import TailwindColorPicker from "@/Components/Form/ColorPicker";

function ColumnFormInputs({handle, item: column, index, columns, setData, errors, remove, ...props}) {

    const [openModal, setOpenModal] = useState(false);

    return (
        <FieldRow
            withLabel={false}
        >
            <div>
                <div className="flex space-x-4 items-center rtl:space-x-reverse">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <div {...handle}><Icon name="bars-4"
                                               className="cursor-move w-4 h-4 text-gray-400 hover:text-gray-500 transition"/>
                        </div>
                        <div>
                            <input
                                className="focus:outline-none focus:border-b p-0 text-sm"
                                value={column.label}
                                onChange={(e) => setData('label', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex-1 flex">
                        <div className="bg-primary-400 text-white px-2 text-sm rounded-full">
                            {column.type}
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                        <Button
                            className="text-sm"
                            action={() => setOpenModal(v => !v)}
                            icon="cog-8-tooth"
                            negative
                            iconType="outline"
                        />
                        <Button
                            className="text-sm"
                            action={() => remove()}
                            icon="trash"
                            outline
                            color="danger"
                            iconType="outline"
                            doubleClick
                            negative
                            tooltip="Press double click to remove"
                        />
                    </div>
                </div>
            </div>

            <Transition
                show={openModal}
                enter="transition-all duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                className="overflow-hidden"
            >
                <div>
                    <div className="border rounded-lg mt-4 flex flex-wrap p-2">
                        <div className="w-1/2 p-3 flex flex-col space-y-6">
                            <SectionCard label="Settings">
                                <FieldRow label="Label" widths={['w-1/3', 'w-2/3']}>
                                    <Input
                                        className="text-sm w-full"
                                        value={column.label}
                                        handleChange={(e) => setData('label', e.target.value)}
                                    />
                                </FieldRow>
                                <FieldRow label="Type" widths={['w-1/3', 'w-2/3']}>
                                    <Select
                                        className="text-sm w-full"
                                        value={column.type}
                                        handleChange={(e) => setData('type', e?.value ?? e)}
                                        options={[
                                            {value: 'text', label: 'Text'},
                                            {value: 'number', label: 'Number'},
                                            {value: 'currency', label: 'Currency'},
                                            {value: 'datetime', label: 'Datetime'},
                                            {value: 'boolean', label: 'Boolean'},
                                            {value: 'badge', label: 'Badge'},
                                            {value: 'image', label: 'Image'},
                                        ]}
                                    />
                                </FieldRow>

                                <FieldRow label="Width" widths={['w-1/3', 'w-2/3']} description="By pixels">
                                    <Input
                                        className="text-sm w-full"
                                        type={'number'}
                                        value={column.width}
                                        placeholder="Start"
                                        handleChange={(e) => setData('width', e.target.value)}
                                    />
                                </FieldRow>

                                <FieldRow label="Align" widths={['w-1/3', 'w-2/3']}>
                                    <Select
                                        className="text-sm w-full"
                                        value={column.align}
                                        handleChange={(e) => setData('align', e?.value ?? e)}
                                        options={[
                                            {value: 'start', label: 'Start'},
                                            {value: 'center', label: 'Center'},
                                            {value: 'end', label: 'End'},
                                        ]}
                                    />
                                </FieldRow>

                                <FieldRow label="Show" widths={['w-1/3', 'w-2/3']}>
                                    <Switcher
                                        className=""
                                        value={column.show}
                                        handleChange={(e) => setData('show', e.target.value)}
                                    />
                                </FieldRow>

                                <FieldRow label="Sortable" widths={['w-1/3', 'w-2/3']}>
                                    <Switcher
                                        className=""
                                        value={column.sortable}
                                        handleChange={(e) => setData('sortable', e.target.value)}
                                    />
                                </FieldRow>

                                <FieldRow label="Searchable" widths={['w-1/3', 'w-2/3']}>
                                    <Switcher
                                        className=""
                                        value={column.searchable}
                                        handleChange={(e) => setData('searchable', e.target.value)}
                                    />
                                </FieldRow>
                            </SectionCard>

                            <SectionCard label="Actions">
                                <ActionColumnForm
                                    label="Click"
                                    action={column.actions?.click ?? {}}
                                    setData={(key, value) => setData('actions.click.' + key, value)}
                                    collection={props.collection}
                                    collections={props.collections}
                                    exclude={['icon', 'label', 'grouped']}
                                />

                                <ActionColumnForm
                                    label="Hover"
                                    action={column.actions?.hover ?? {}}
                                    setData={(key, value) => setData('actions.hover.' + key, value)}
                                    collection={props.collection}
                                    collections={props.collections}
                                    exclude={['icon', 'label', 'grouped']}
                                />
                            </SectionCard>
                        </div>

                        <div className="w-1/2 p-3 flex flex-col space-y-6">
                            <SectionCard label="Format">
                                <FieldRow label="Currency" show={column.type === 'currency'} widths={['w-1/3', 'w-2/3']}>
                                    <Select
                                        className="text-sm w-full"
                                        value={column.currency}
                                        handleChange={(e) => setData('currency', e?.value ?? e)}
                                        options={[
                                            {value: 'USD', label: 'USD'},
                                            {value: 'EUR', label: 'EUR'},
                                            {value: 'GBP', label: 'GBP'},
                                            {value: 'IRR', label: 'IRR'},
                                            {value: 'ILS', label: 'ILS'},
                                        ]}
                                    />
                                </FieldRow>

                                <FieldRow label="Convert to" show={column.type === 'currency'} widths={['w-1/3', 'w-2/3']}>
                                    <Select
                                        className="text-sm w-full"
                                        value={column.convert_to}
                                        handleChange={(e) => setData('convert_to', e?.value ?? e)}
                                        placeholder="No convert"
                                        options={[
                                            {value: 'USD', label: 'USD'},
                                            {value: 'EUR', label: 'EUR'},
                                            {value: 'GBP', label: 'GBP'},
                                            {value: 'IRR', label: 'IRR'},
                                            {value: 'ILS', label: 'ILS'},
                                        ].filter(c => c.value !== column?.currency)}
                                        isClearable
                                    />
                                </FieldRow>

                                <FieldRow label="Convert by date" show={column.type === 'currency'}
                                          widths={['w-1/3', 'w-2/3']}>
                                    <Input
                                        className="text-sm w-full"
                                        value={column.convert_by_date}
                                        handleChange={(e) => setData('convert_by_date', e.target.value)}
                                        placeholder="Today"
                                    />
                                </FieldRow>

                                <FieldRow label="For human" show={column.type === 'datetime'} widths={['w-1/3', 'w-2/3']}>
                                    <div className="flex space-x-2 rtl:space-x-reverse items-center">
                                        <Switcher
                                            value={column.for_human ?? false}
                                            handleChange={(e) => setData('for_human', e.target.value)}
                                        />
                                        {column.for_human &&
                                            <Select
                                                className="text-sm w-full"
                                                value={column.for_human_hook}
                                                handleChange={(e) => setData('for_human_hook', e?.value ?? e)}
                                                placeholder="Now"
                                                options={[
                                                    //TODO: add selects list to options
                                                ]}
                                            />
                                        }
                                    </div>
                                </FieldRow>

                                <FieldRow label={`Date format ${column.for_human ? 'tooltip' : ''}`}
                                          show={column.type === 'datetime'} widths={['w-1/3', 'w-2/3']}>
                                    <Select
                                        className="text-sm w-full"
                                        value={column.date_format}
                                        handleChange={(e) => setData('date_format', e?.value ?? e)}
                                        isCreatable
                                        options={[
                                            {value: 'YYYY-MM-DD', label: 'YYYY-MM-DD'},
                                            {value: 'YYYY/MM/DD', label: 'YYYY/MM/DD'},
                                            {value: 'DD-MM-YYYY', label: 'DD-MM-YYYY'},
                                            {value: 'DD/MM/YYYY', label: 'DD/MM/YYYY'},
                                            {value: 'MM-DD-YYYY', label: 'MM-DD-YYYY'},
                                            {value: 'MM/DD/YYYY', label: 'MM/DD/YYYY'},
                                        ]}
                                    />
                                </FieldRow>

                                <FieldRow label="Prefix" widths={['w-1/3', 'w-2/3']}>
                                    <Input
                                        className="text-sm w-full"
                                        value={column.prefix}
                                        handleChange={(e) => setData('prefix', e.target.value)}
                                    />
                                </FieldRow>

                                <FieldRow label="Suffix" widths={['w-1/3', 'w-2/3']}>
                                    <Input
                                        className="text-sm w-full"
                                        value={column.suffix}
                                        handleChange={(e) => setData('suffix', e.target.value)}
                                    />
                                </FieldRow>
                            </SectionCard>
                            <SectionCard label="Icon Action">
                                <FieldRow label="Enable" widths={['w-1/3', 'w-2/3']}>
                                    <Switcher
                                        value={column.iconActions?.enabled ?? false}
                                        handleChange={(e) => setData('iconActions.enabled', e.target.value)}
                                    />
                                </FieldRow>
                                {column.iconActions?.enabled &&
                                    <>
                                        <FieldRow label="Justify between" widths={['w-1/3', 'w-2/3']}>
                                            <Switcher
                                                value={column.iconActions?.justify_between ?? false}
                                                handleChange={(e) => setData('iconActions.justify_between', e.target.value)}
                                            />
                                        </FieldRow>
                                        <FieldRow label="Icon" widths={['w-1/3', 'w-2/3']}>
                                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                                <IconPicker
                                                    handleChange={(e) => setData('iconActions.icon', e)}
                                                    value={column.iconActions?.icon ?? 'plus-circle'}
                                                />
                                                <TailwindColorPicker
                                                    handleChange={(e) => setData('iconActions.color', e)}
                                                    value={column.iconActions?.color ?? 'secondary'}
                                                    icon={column.iconActions?.icon ?? 'plus-circle'}
                                                />
                                            </div>
                                        </FieldRow>
                                        <ActionColumnForm
                                            label="Click"
                                            action={column.iconActions?.click ?? {}}
                                            setData={(key, value) => setData('iconActions.click.' + key, value)}
                                            collection={props.collection}
                                            collections={props.collections}
                                            exclude={['icon', 'label', 'grouped']}
                                        />
                                        <ActionColumnForm
                                            label="Hover"
                                            action={column.iconActions?.hover ?? {}}
                                            setData={(key, value) => setData('iconActions.hover.' + key, value)}
                                            collection={props.collection}
                                            collections={props.collections}
                                            exclude={['icon', 'label', 'grouped']}
                                        />
                                    </>
                                }
                            </SectionCard>
                        </div>
                    </div>
                </div>
            </Transition>
        </FieldRow>
    )
}

export default ColumnFormInputs
