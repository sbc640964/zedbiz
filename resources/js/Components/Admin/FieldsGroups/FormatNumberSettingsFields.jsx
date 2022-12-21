import {get} from "lodash";
import Select from "@/Components/Form/Select";
import {currencies} from "@/helpers";
import Input from "@/Components/Form/Input";
import Switcher from "@/Components/Form/Switcher";
import ColorPicker from "@/Components/Form/ColorPicker";
import Field from "@/Components/Admin/FieldsGroups/FieldRowSmall";

export function FormatNumberSettingsFields({prefixPath, setData, data, errors, trendColor = false}) {

    const handleChange = (e, key) =>
        setData(`${prefixPath}.${key}`, e?.target?.value ?? e?.value ?? e ?? '');

    const getValues = (key) =>
        get(data, `${prefixPath}.${key}`);

    const getErrors = (key) =>
        get(errors, `${prefixPath}.${key}`);

    return (
        <div className="flex flex-col gap-2 w-full">
            <Field label={'Format'}>
                <Select
                    size={'sm'}
                    errors={getErrors('format')}
                    className="w-full"
                    value={getValues('format')}
                    handleChange={e => handleChange(e, 'format')}
                    options={[
                        {value: 'number', label: 'Standard Number'},
                        {value: 'percent', label: 'Percent'},
                        {value: 'currency', label: 'Currency'},
                    ]}
                />
            </Field>
            <Field label={'Currency Code'} show={getValues('format') === 'currency'}>
                <Select
                    size={'sm'}
                    errors={getErrors('currency_code')}
                    className="w-full"
                    value={getValues('currency_code')}
                    handleChange={e => handleChange(e, 'currency_code')}
                    options={currencies}
                />
            </Field>

            <Field label={'Decimal Places'}>
                <Input
                    type={'number'}
                    size={'sm'}
                    errors={getErrors('decimal_places')}
                    className="w-full mt-1 py-1 px-2"
                    value={getValues('decimal_places') ?? ''}
                    handleChange={e => handleChange(e, 'decimal_places')}
                />
            </Field>

            <Field label="Thousands Separator" checkbox>
                <Switcher
                    size={'sm'}
                    errors={getErrors('thousands_separator')}
                    value={getValues('thousands_separator') ?? ''}
                    handleChange={e => handleChange(e, 'thousands_separator')}
                />
            </Field>

            {trendColor &&
                <>
                    <Field label="Trend Mode" checkbox>
                        <Switcher
                            size={'sm'}
                            errors={getErrors('trend_mode_enable')}
                            value={getValues('trend_mode_enable') ?? true}
                            handleChange={e => handleChange(e, 'trend_mode_enable')}
                        />
                    </Field>

                    <Field label="Trend color negative" checkbox show={getValues('trend_mode_enable') ?? true}>
                        <ColorPicker
                            size={'sm'}
                            errors={getErrors('trend_color_negative')}
                            value={getValues('trend_color_negative') ?? 'danger'}
                            handleChange={e => handleChange(e, 'trend_color_negative')}
                        />
                    </Field>

                    <Field label="Trend color positive" checkbox show={getValues('trend_mode_enable') ?? true}>
                        <ColorPicker
                            size={'sm'}
                            errors={getErrors('trend_color_positive')}
                            value={getValues('trend_color_positive') ?? 'success'}
                            handleChange={e => handleChange(e, 'trend_color_positive')}
                        />
                    </Field>
                </>
            }

            <Field label={'Before text'}>
                <Input
                    size={'sm'}
                    errors={getErrors('before_text')}
                    className="w-full mt-1 py-1 px-2"
                    value={getValues('before_text') ?? ''}
                    handleChange={e => handleChange(e, 'before_text')}
                />
            </Field>

            <Field label={'After text'}>
                <Input
                    size={'sm'}
                    errors={getErrors('after_text')}
                    className="w-full mt-1 py-1 px-2"
                    value={getValues('after_text') ?? ''}
                    handleChange={e => handleChange(e, 'after_text')}
                />
            </Field>
        </div>
    )
}

export default FormatNumberSettingsFields
