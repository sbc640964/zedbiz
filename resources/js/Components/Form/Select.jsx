import ReactSelect from "react-select";
import ReactSelectCreatable from "react-select/creatable";
import AsyncSelect from "react-select/async";
import AsyncSelectCreatable from "react-select/async-creatable";
import {components} from "react-select";
import Icon from "@/Components/Icon";
import {useCallback, useEffect, useRef, useState} from "react";
import {debounce} from "lodash";
import collect, {Collection} from "collect.js";
import {addToast} from "@/helpers";

function Select({size, color, isAsync, handleChange, isCreatable, value, ...props}) {

    const [options, setOptions] = useState(props?.options ?? []);
    const [currentValue, setCurrentValue] = useState(null);

    const colorClasses = {
        primary: 'focus-within:border-primary-300 focus-within:ring-primary-200',
        secondary: 'focus-within:border-gray-300 focus-within:ring-gray-200',
        danger: 'focus-within:border-red-300 focus-within:ring-red-200',
        success: 'focus-within:border-green-300 focus-within:ring-green-200',
        warning: 'focus-within:border-yellow-300 focus-within:ring-yellow-200',
    }[color] ?? 'focus-within:border-primary-300 focus-within:ring-primary-200';

    const componentsObject = useRef(customComponents(`${colorClasses} ${props?.className ?? ''}`, size))

    useEffect(() => {
        setOptions(props?.options ?? []);
    }, [props?.options]);

    const Component = isAsync ? (isCreatable ? AsyncSelectCreatable : AsyncSelect) : (isCreatable ? ReactSelectCreatable : ReactSelect);

    function defaultLoadOptions(inputValue, callback) {
        const url = props.url;
        axios.get(url, {
            params: {
                q: inputValue,
            }
        })
            .then(response => {
                callback(response.data);
            })
            .catch(error => {
                addToast('Error', error, 'error');
            });
    }

    function callbackLoadOptions(data, callback) {
        setOptions(data);
        callback(data);
    }

    const loadOptions = useCallback(
        debounce((inputValue, callback) =>
            typeof props.loadOptions === "function"
                    ? props.loadOptions(inputValue, data => callbackLoadOptions(data, callback))
                    : defaultLoadOptions(inputValue, data => callbackLoadOptions(data, callback))
        , 750),
        []
    );

    const asyncProps = isAsync ? {
        loadOptions,
        cacheOptions: true,
    } : {};

    function getValue() {
        if(!value) return null;

        const _options = (options instanceof Collection ? options : collect(options))
            .pluck('options')
            .flatten(1)
            .merge(options?.all?.() || options)
            .filter(i => Boolean(i))
            .all();

        const _value = props.isMulti && Array.isArray(value) ? value.map(i => i?.value ?? i) : (value?.value || value);
        const current = props?.isMulti
            ? collect(_options).filter(option => _value.includes(option?.value)).all()
            : collect(_options).first((option) => option?.value === _value);

        return current ?? (typeof currentValue !== "undefined" ? currentValue : null);
    }

    useEffect(() => {
        setCurrentValue(getValue(value));
    }, [options]);

    function handleChangeSelect(newValue, actionMeta) {
        setCurrentValue(newValue);
        handleChange(Array.isArray(newValue) ? newValue.map(item => item?.value ?? item) : newValue);
    }

    function onCreateOption(newValue) {
        typeof props.onCreateOption === "function"
            ? props.onCreateOption(newValue)
            : setOptions([...options, {value: newValue, label: newValue}]);
        setCurrentValue({value: newValue, label: newValue});
        handleChange(newValue);
    }

    return (
        <Component
            components={componentsObject.current}
            styles={ {
                control:  (provided, state) => ({}),
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                dropdownIndicator: (base) => ({...base, padding: size === 'xs' ? '0.1rem' : base.padding}),
                indicatorSeparator: (base) => ({...base, marginTop: size === 'xs' ? '0.2rem' : base.marginTop, marginBottom: size === 'xs' ? '0.2rem' : base.marginBottom}),
                input: (base) => ({...base, ...(size === 'xs' ? {paddingTop: '0px', paddingBottom: '0px', margin: 0} : {}) }),
                valueContainer: (base) => ({...base, ...(size === 'xs' ? {paddingTop: '0px', paddingBottom: '0px', margin: 0} : {}) }),
                // menu: (base) => ({...base, ...(size === 'xs' ? {fontSize: '0.75rem', padding: '2px'} : {}) }),
            }}
            menuPortalTarget={document.body}
            onChange={(value, actionMeta) => handleChangeSelect(value, actionMeta)}
            value={currentValue}
            noOptionsMessage={() => 'No options'}
            menuPlacement="auto"
            {...props}
            options={options}
            {...asyncProps}
            onCreateOption={onCreateOption}
        />
    )
}

export default Select


const customComponents = (controlClasses, size) =>  ({

    ClearIndicator: (props) => {

        const classes = {
            'base': '!p-2',
            'sm': '!p-0 !pr-1 !rtl:pr-0 !rtl:pl-1',
            'xs': '!p-0 !pr-1 !rtl:pr-0 !rtl:pl-1',
        }[size] ?? '!p-2 !pr-1 !rtl:pr-0 !rtl:pl-1';

        const iconSize = {
            'base': 'w-4 h-4',
            'sm': 'w-4 h-4',
            'xs': 'w-3.5 h-3.5',
        }[size] ?? 'w-4 h-4';

        return(<components.ClearIndicator {...props} className={`${classes}`}><Icon className={`${iconSize}`} name="trash"/></components.ClearIndicator>)
    },

    Control: (props) => {

        const sizeClasses = {
            'xs': 'focus-within:ring-[1.5px]'
        }[size] ?? '';

        return(
            <div className={`${controlClasses} ${sizeClasses} border-gray-300 focus-within:ring focus-within:ring-opacity-50 rounded-md shadow-sm p-0
            `} type="text">
                <components.Control
                    className="flex justify-between items-center"
                    {...props}
                >
                    {props.children}
                </components.Control>
            </div>
        )
    },
    DropdownIndicator: (props) => {
        return(<components.DropdownIndicator {...props}><Icon name={'chevron-up-down'} className={size === 'xs' ? 'w-4' : 'w-5'}/></components.DropdownIndicator>)
    },
    // DownChevron: (props) => {
    //     return(<components.DownChevron {...props}>DownChevron {props.children}</components.DownChevron>)
    // },
    // CrossIcon: (props) => {
    //     return(<components.CrossIcon {...props}>CrossIcon {props.children}</components.CrossIcon>)
    // },
    // Group: (props) => {
    //     return(<components.Group {...props}>Group {props.children}</components.Group>)
    // },
    // GroupHeading: (props) => {
    //     return(<components.GroupHeading {...props}>GroupHeading {props.children}</components.GroupHeading>)
    // },
    // IndicatorsContainer: (props) => {
    //     return(<components.IndicatorsContainer {...props}>IndicatorsContainer {props.children}</components.IndicatorsContainer>)
    // },
    // IndicatorSeparator: (props) => {
    //     return(<components.IndicatorSeparator {...props}>IndicatorSeparator {props.children}</components.IndicatorSeparator>)
    // },
    Input: (props) => {
        return(<components.Input {...props} className="focus-within:[&>*]:ring-0"/>)
    },
    // LoadingIndicator: (props) => {
    //     return(<components.LoadingIndicator {...props}>LoadingIndicator {props.children}</components.LoadingIndicator>)
    // },
    Menu: (props) => {
        return(<components.Menu {...props} className="scrollbar text-sm overflow-hidden">{props.children}</components.Menu>)
    },
    MenuList: (props) => {
        return(<components.MenuList {...props} className="">{props.children}</components.MenuList>)
    },
    // MenuPortal: (props) => {
    //     return(<components.MenuPortal {...props}>MenuPortal {props.children}</components.MenuPortal>)
    // },
    // LoadingMessage: (props) => {
    //     return(<components.LoadingMessage {...props}>LoadingMessage {props.children}</components.LoadingMessage>)
    // },
    // NoOptionsMessage: (props) => {
    //     return(<components.NoOptionsMessage {...props}>NoOptionsMessage {props.children}</components.NoOptionsMessage>)
    // },
    // MultiValue: (props) => {
    //     return(<components.MultiValue {...props}>MultiValue {props.children}</components.MultiValue>)
    // },
    // MultiValueContainer: (props) => {
    //     return(<components.MultiValueContainer {...props}>MultiValueContainer {props.children}</components.MultiValueContainer>)
    // },
    // MultiValueLabel: (props) => {
    //     return(<components.MultiValueLabel {...props}>MultiValueLabel {props.children}</components.MultiValueLabel>)
    // },
    // MultiValueRemove: (props) => {
    //     return(<components.MultiValueRemove {...props}>MultiValueRemove {props.children}</components.MultiValueRemove>)
    // },
    Option: (props) => {

        const classes = props.data?.className ?? '';

        const sizeClasses = {
            'base': '!text-base',
            'sm': '!text-sm !px-105 !py-0.5',
            'xs': '!text-xs !px-1.5 !py-0.5',
        }[size] ?? '!text-base';

        return(
            <div className={`${classes}`}>
                <components.Option {...props} className={`${sizeClasses}`}>
                    <div className="flex space-x-2 rtl:space-x-reverse items-center">
                        {props.data?.color &&
                            <span className={`w-5 h-5 rounded-md bg-${props.data.color}`}/>
                        }
                        {props.data?.icon &&
                            <span className={`w-5 h-5 block rounded-md`}>
                                   {React.createElement(props.data.icon)}
                                </span>
                        }
                        {(props.data?.image) &&
                            <span className={`w-8 h-8 rounded-md flex border justify-center items-center`} >
                                {props.data.image && <img src={props.data.image} alt={props.data.label} className=""/>}
                            </span>
                        }
                        {props.data?.symbol &&
                            <span className={`w-8 h-8 rounded-md flex border justify-center items-center`} >
                                {props.data.symbol && <span className="text-sm font-bold text-gray-500">{props.data.symbol}</span>}
                            </span>
                        }
                        <span>
                           <span>{props.children}</span>
                            {props.data?.subtext && <span className="block text-xs text-gray-400">{props.data.subtext}</span>}
                        </span>
                    </div>
                </components.Option>
            </div>
        )
    },

    Placeholder: (props) => {
        const classes = {
            'base': '!text-base',
            'sm': '!text-sm',
            'xs': '!text-xs',
        }[size] ?? '!text-base';

        return(<components.Placeholder {...props} className={`${classes} !text-gray-500`}>{props.children}</components.Placeholder>)
    },
    // SelectContainer: (props) => {
    //     return(<components.SelectContainer {...props}>{props.children}</components.SelectContainer>)
    // },

    SingleValue: (props) => {

        const classes = {
            'base': 'text-sm',
            'sm': 'text-sm',
            'xs': 'text-xs',
        }[size] ?? 'text-sm';

        return(
            <components.SingleValue
                {...props}
            >
                <div className={`flex space-x-2 rtl:space-x-reverse items-center ${classes}`}>
                    {props.data?.color &&
                        <span className={`w-5 h-5 rounded-md bg-${props.data.color}`}/>
                    }
                    {props.data?.icon &&
                        <span className={`w-5 h-5 rounded-md`}>
                                   {React.createElement(props.data.icon)}
                                </span>
                    }
                    <span>{props.children}</span>
                </div>
            </components.SingleValue>
        )
    },

    ValueContainer: (props) => {
        return(<components.ValueContainer {...props} className="flex">{props.children}</components.ValueContainer>)
    },
})



