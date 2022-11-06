import FieldRow from "@/Components/Form/FieldRow";
import Icon from "@/Components/Icon";
import Input from "@/Components/Form/Input";
import IconPicker from "@/Components/Form/IconPicker";
import SectionCard from "@/Components/Card/SectionCard";
import Select from "@/Components/Form/Select";
import Button from "@/Components/Button";

function MenuItem({remove, setData, item, app, contentOptions}) {
    return (
        <div>
            <SectionCard label={<div className="flex justify-between">
                <span>General</span>
                <Button
                    action={remove}
                    color={'danger'}
                    size={'sm'}
                    icon={'trash'}
                    iconType={'outline'}
                />
            </div>}>
                <FieldRow label="Label" widths={['w-1/4', 'w-3/4']}>
                    <Input
                        type="text"
                        className="w-full py-1.5"
                        value={item.label}
                        handleChange={e => setData('label', e.target.value)}
                    />
                </FieldRow>
                <FieldRow label="Slug" widths={['w-1/4', 'w-3/4']}>
                    <Input
                        type="text"
                        className="w-full py-1.5"
                        value={item.slug}
                        handleChange={e => setData('slug', e.target.value)}
                    />
                </FieldRow>
                <FieldRow label="Icon" widths={['w-1/4', 'w-3/4']}>
                    <IconPicker
                        value={item.icon}
                        handleChange={icon => setData('icon', icon)}
                    />
                </FieldRow>

                <FieldRow label="Content" widths={['w-1/4', 'w-3/4']}>
                    <Select
                        className="w-full"
                        value={item.content}
                        handleChange={e => setData('content', e?.value ?? e)}
                        options={contentOptions}
                        defaultOptions
                    />
                </FieldRow>
            </SectionCard>

        </div>
    )
}

export default MenuItem
