import EmptyModal from "@/Components/Dialogs/EmptyModal";
import FieldRow from "@/Components/Form/FieldRow";
import Switcher from "@/Components/Form/Switcher";
import IconPicker from "@/Components/Form/IconPicker";
import TailwindColorPicker from "@/Components/Form/ColorPicker";
import FieldConfig from "@/Components/Admin/FieldConfig";
import Select from "@/Components/Form/Select";
import SqlEditor from "@/Components/Form/SqlEditor";
import Label from "@/Components/Form/Label";
import Textarea from "@/Components/Form/Textarea";
import Button from "@/Components/Button";
import Input from "@/Components/Form/Input";

function ActionModalInputs({open, setOpen, action, setData, collection, collections, errors, exclude = []}) {

    function getFormFields() {
        if(action.form){
            if(Number.isInteger(action.form)){
                return collections.find(c => c.id === action.form)?.columns;
            }
            const [c, f] = action.form.split('@');
            return collections.find(c => c.id === c)?.forms.find(f => f.id === f)?.columns;
        }
        return collection?.columns;
    }

    function getForms() {
        return collections.map(c => {
            return {
                label: c.name,
                options: [{
                    label: `Default ${c.name} Form`,
                    value: c.id,
                }, ...(c?.forms ?? []).map(f => {
                    return {
                        label: f.label,
                        value: c.id + "@" + f.id,
                    }
                })]
            }
        });
    }

    function getListsOptions() {
        return collections.map(c => {
            return {
                label: c.name,
                options: c?.lists?.map(l => {
                    return {
                        label: l.name,
                        value: l.id,
                    }
                })
            }
        });
    }

    return (
        <EmptyModal
            open={open}
            setOpen={setOpen}
            className="w-96"
        >
            {({close}) => (
                <>

                    <div>
                        <div className="flex items-center justify-between px-4 py-3 border-b">
                            <h2 className="text-lg font-bold text-gray-600">Action Settings</h2>
                        </div>

                        <FieldRow label="Enabled" description="">
                            <Switcher
                                value={action.enabled}
                                handleChange={e => setData('enabled', e.target.value)}
                            />
                        </FieldRow>

                        {exclude.includes('grouped') ? null :
                            <FieldRow label="Grouped" description="The action will be filed in a dropdown menu">
                                <Switcher
                                    value={action.grouped}
                                    handleChange={e => setData('grouped', e.target.value)}
                                />
                            </FieldRow>
                        }

                        {exclude.includes('icon') ? null :
                            <FieldRow label="Icon" description="">
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
                                    className="ml-2 rtl:ml-0 rtl:mr-2"
                                />
                            </FieldRow>
                        }

                        <FieldRow label="Tooltip" description="">
                            <Input
                                className="w-full py-2 text-sm"
                                value={action?.tooltip}
                                handleChange={e => setData('tooltip', e.target.value)}
                                placeholder={action?.label}
                            />
                        </FieldRow>

                        {exclude.includes('label') ? null :
                            <FieldRow label="Label" description="">
                                <Input
                                    className="w-full py-2 text-sm"
                                    value={action?.label}
                                    handleChange={e => setData('label', e.target.value)}
                                    placeholder={action?.label}
                                />
                            </FieldRow>
                        }

                        <FieldRow label="Type action" description="">
                            <Select
                                className="w-full text-sm"
                                value={action?.type}
                                handleChange={e => setData('type', e?.value ?? e)}
                                placeholder="Form"
                                options={[
                                    {value: 'form', label: 'Form'},
                                    {value: 'list', label: 'List'},
                                    {value: 'singular', label: 'Singular'},
                                    {value: 'c_update', label: 'Custom update'},
                                    {value: 'c_redirect', label: 'Custom redirect'},
                                    {value: 'c_delete', label: 'Delete'},
                                ]}
                            />
                        </FieldRow>

                        <FieldRow label="Form" description="" show={!action.type || action.type === 'form'}>
                            <Select
                                className="w-full text-sm"
                                value={action?.form}
                                handleChange={e => setData('form', e?.value ?? e)}
                                placeholder="Default form"
                                options={getForms()}
                                noOptionsMessage={() => "No forms available"}
                            />
                        </FieldRow>

                        <FieldRow label="Fill form" description="" show={action.type === 'form'}>
                            <div className="flex-1 flex space-x-2 rtl:space-x-reverse items-center">
                                <Switcher
                                    value={action.fillForm}
                                    handleChange={e => setData('fillForm', e.target.value)}
                                />
                                {action.fillForm &&
                                    <div className="w-full flex-1">
                                        <Input
                                            className="flex-1 w-full text-sm"
                                            value={action?.fillFormKey}
                                            handleChange={e => setData('fillFormKey', e.target.value)}
                                            placeholder="{{ROW.id}}"
                                        />
                                    </div>
                                }
                            </div>
                        </FieldRow>

                        <FieldRow label="Config Filed`s" description=""
                                  show={!action.type || action.type === 'form'}>
                            {getFormFields()?.map(field => (
                                <FieldConfig
                                    key={field.id}
                                    field={field}
                                    action={action}
                                    setData={setData}
                                />
                            ))}
                        </FieldRow>


                        <FieldRow label="List" description="" show={action.type === 'list'}>
                            <Select
                                className="w-full text-sm"
                                value={action?.list}
                                handleChange={e => setData('list', e?.value ?? e)}
                                placeholder="Default list"
                                options={getListsOptions()}
                                noOptionsMessage={() => "No lists available"}
                            />
                        </FieldRow>

                        <FieldRow label="Query where" description="" show={action.type === 'list'}>
                            <Input
                                className="w-full py-2 text-sm"
                                value={action?.queryWhere ?? ''}
                                handleChange={e => setData('queryWhere', e.target.value)}
                                placeholder="FOREIGN KEY NAME = {{ROW.id}}"
                            />
                        </FieldRow>

                        <FieldRow label="Singular" description="" show={action.type === 'singular'}>
                            <Select
                                className="w-full text-sm"
                                value={action?.singular}
                                handleChange={e => setData('singular', e?.value ?? e)}
                                placeholder="Default singular"
                                options={collection?.singulars ?? []}
                                noOptionsMessage={() => "No singulars available"}
                            />
                        </FieldRow>

                        {action.type === 'c_update' &&
                            <>
                                <div className="text-sm px-4 py-2">
                                    Custom SQL
                                </div>
                                <div>
                                    <SqlEditor
                                        value={action?.sql}
                                        handleChange={e => setData('sql', e)}
                                        placeholder="Your custom SQL"
                                        fontSize={14}
                                        height={'200px'}
                                    />
                                </div>
                            </>
                        }
                        <FieldRow label="Confirmation" description="" show={action.type?.startsWith('c_')}
                                  className="items-start">
                            <div className="flex flex-col space-y-4">
                                <Switcher
                                    value={action.confirmation?.enabled}
                                    handleChange={e => setData('confirmation.enabled', e.target.value)}
                                />
                                {action.confirmation?.enabled && (
                                    <>
                                        <Label value="Title" className="text-xs">
                                            <Input
                                                className="w-full py-1 px-2 text-sm"
                                                value={action?.confirmation?.title}
                                                handleChange={e => setData('confirmation.title', e.target.value)}
                                                placeholder="Are you sure?"
                                            />
                                        </Label>
                                        <Label value="Massage" className="text-xs">
                                            <Textarea
                                                className="w-full py-1 px-2 text-sm"
                                                value={action?.confirmation?.message}
                                                handleChange={e => setData('confirmation.message', e.target.value)}
                                                placeholder="Are you sure you want to delete this item?"
                                            />
                                        </Label>

                                        <Label value="Button text" className="text-xs">
                                            <Input
                                                className="w-full py-1 px-2 text-sm"
                                                value={action?.confirmation?.btn_text}
                                                handleChange={e => setData('confirmation.btn_text', e.target.value)}
                                                placeholder="Yes, I am sure"
                                            />
                                        </Label>
                                        <Label value="Button cancel text" className="text-xs">
                                            <Input
                                                className="w-full py-1 px-2 text-sm"
                                                value={action?.confirmation?.btn_cancel_text}
                                                handleChange={e => setData('confirmation.btn_cancel_text', e.target.value)}
                                                placeholder="No, cancel"
                                            />
                                        </Label>
                                    </>
                                )}
                            </div>

                        </FieldRow></div>


                    <div className="p-4 flex justify-end">
                        <Button action={close}>Close</Button>
                    </div>
                </>
            )}
        </EmptyModal>
    )
}

export default ActionModalInputs
