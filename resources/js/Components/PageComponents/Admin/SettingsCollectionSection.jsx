import Card from "@/Components/Card/Card";
import Label from "@/Components/Form/Label";
import RealInput from "@/Components/RealInput";
import Input from "@/Components/Form/Input";
import Textarea from "@/Components/Form/Textarea";
import InputError from "@/Components/Form/InputError";
import Icon from "@/Components/Icon";
import {get as getData} from "lodash";
import Switcher from "@/Components/Form/Switcher";
import Checkbox from "@/Components/Form/Checkbox";
import Select from "@/Components/Form/Select";

function SettingsCollectionSection({ collection, errors, clearError, update, label, icon, fields }) {

    function getComponent(type){
        switch (type) {
            case 'textarea':
                return <Textarea/>;
            case 'switcher':
                return <Switcher/>;
            case 'checkbox':
                return <Checkbox/>;
            case 'select':
                return <Select/>;
            default:
                return <Input/>;
        }
    }

    return (
        <Card className="bg-transparent rounded-none shadow-none">
            <div className="px-3 py-2 border-b flex space-x-2 rtl:space-x-reverse items-center">
                <span className="rounded-lg bg-primary-100 p-1 text-primary-800">
                    <Icon name={icon ?? 'tag'} className="w-5 h-5"/>
                </span>
                <h4 className="text-primary-600 uppercase font-semibold">{label}</h4>
            </div>
            <div className="p-4 flex flex-col space-y-4">
                {fields && fields.map((field, index) => (
                    <div key={index}>
                        <Label value={field.label} className="">
                            <RealInput
                                className={`mt-1 block w-full text-sm py-2`}
                                value={getData(collection, field.name)}
                                handleChange={clearError}
                                input={getComponent(field.type)}
                                callback={update}
                                {...field}
                            />
                        </Label>
                        <InputError message={errors[field.name]}/>
                    </div>
                ))}
            </div>
        </Card>
    )
}

export default SettingsCollectionSection
