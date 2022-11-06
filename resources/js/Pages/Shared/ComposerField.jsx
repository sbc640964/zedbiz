import Label from "@/Components/Form/Label";
import Input from "@/Components/Form/Input";
import InputError from "@/Components/Form/InputError";
import Select from "@/Components/Form/Select";
import Checkbox from "@/Components/Form/Checkbox";
import Switcher from "@/Components/Form/Switcher";
import {collect} from "collect.js";
import {appUrlName} from "@/helpers";
import {usePage} from "@inertiajs/inertia-react";
import Textarea from "@/Components/Form/Textarea";
import classNames from "classnames";

function ComposerField({fieldSettings, value, handleChange, errors, form, options, ...props}) {

    const isAdmin = usePage().props?.isAdminScreen;

    function getUrlRelation() {
        return appUrlName('search-records', {
            app: props?.app?.id,
            form: form.id,
            field: fieldSettings.id,
            _query: collect(typeof props?.record === 'object' ? props.record : {}).filter((value, key) => key.startsWith('__')).all()
        }, isAdmin)
    }

    const Component = {
        'text': {Component: Input, type: 'text'},
        'email': {Component: Input, type: 'email'},
        'password': {Component: Input, type: 'password'},
        'textarea': {Component: Textarea, type: 'textarea'},
        'select': {Component: Select, options: fieldSettings?.options ?? []},
        'checkbox': {Component: Checkbox, type: 'checkbox'},
        'radio': {Component: Checkbox, type: 'radio'},
        'boolean': {Component: Switcher},
        'date': {Component: Input, type: 'date'},
        'datetime': {Component: Input, type: 'datetime-local'},
        'time': {Component: Input, type: 'time'},
        'number': {Component: Input, type: 'number'},
        'currency': {Component: Input, type: 'number'},
        'file': {Component: Input, type: 'file'},
        'image': {Component: Input, type: 'file'},
        'color': {Component: Input, type: 'color'},
        'url': {Component: Input, type: 'url'},
        'tel': {Component: Input, type: 'tel'},
        'range': {Component: Input, type: 'range'},
        'relation': {Component: Select, isAsync: true, url: getUrlRelation(fieldSettings), defaultOptions: true},
    }[fieldSettings.type] ?? {Component: Input, type: 'text'}

    const size = options?.size;

    const classes = classNames({
        'py-1 px-1.5': size === 'xs',
        'py-1 px-2': size === 'sm',
        'py-2 px-1.5': size === 'md' || !size,
        'py-2 px-2': size === 'lg' || size === 'xl',
        '!p-0': Component.Component === Select,
        'mt-1': !options?.hiddenLabel,
    }, options?.className ?? '', 'block w-full')

    fieldSettings.type === 'datetime' && console.log(value)
    return (
        <div>
            <Label value={options?.hiddenLabel ? '' : fieldSettings.label}>
                <Component.Component
                    id={fieldSettings.name}
                    type={fieldSettings.type}
                    className={`${classes}`}
                    value={value}
                    handleChange={handleChange}
                    {...collect(Component).filter((_, key) => key !== 'Component').all()}
                    autoFocus={props?.autoFocus}
                    size={options?.size ?? null}
                />
            </Label>
            <InputError message={errors} className="text-xs"/>
        </div>
    )
}

export default ComposerField
