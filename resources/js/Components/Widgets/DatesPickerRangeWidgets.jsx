import {useEffect, useRef, useState} from "react";
import moment from "moment/moment";
import {
    autoUpdate,
    flip, FloatingFocusManager,
    offset,
    shift,
    useClick,
    useDismiss,
    useFloating, useInteractions,
    useRole
} from "@floating-ui/react-dom-interactions";
import {upperFirst} from "lodash";
import Icon from "@/Components/Icon";
import Label from "@/Components/Form/Label";
import Input from "@/Components/Form/Input";

function DatesPickerRangeWidgets({onUpdate, initialValue}){

    const [open, setOpen] = useState(false);
    const [date, setDate] = useState({start: moment(initialValue?.start), end: moment(initialValue?.end)});
    const [label, setLabel] = useState('current month');
    const [custom, setCustom] = useState({start: moment(), end: moment()});
    const [isFirstRender, setIsFirstRender] = useState(true);

    const presets =  useRef({
        'today': () => ({start: moment(), end: moment(),}),
        'yesterday': () => ({start: moment().subtract(1, 'days'), end: moment().subtract(1, 'days')}),
        'this_week': () => ({start: moment().startOf('week'), end: moment().endOf('week'),}),
        'last_week': () => ({start: moment().subtract(1, 'weeks').startOf('week'), end: moment().subtract(1, 'weeks').endOf('week'),}),
        'last_7_days': () => ({start: moment().subtract(7, 'days'), end: moment(),}),
        'last_30_days': () => ({start: moment().subtract(30, 'days'), end: moment(),}),
        'this_month': () => ({start: moment().startOf('month'), end: moment().endOf('month'),}),
        'last_month': () => ({start: moment().subtract(1, 'months').startOf('month'), end: moment().subtract(1, 'months').endOf('month'),}),
        'last_3_months': () => ({start: moment().subtract(3, 'months').startOf('month'), end: moment().subtract(1, 'months').endOf('month'),}),
        'last_6_months': () => ({start: moment().subtract(6, 'months').startOf('month'), end: moment().subtract(1, 'months').endOf('month'),}),
        'this_year': () => ({start: moment().startOf('year'), end: moment().endOf('year'),}),
        'last_year': () => ({start: moment().subtract(1, 'years').startOf('year'), end: moment().subtract(1, 'years').endOf('year'),}),
    });

    const [preset, setPreset] = useState(false);

    const {x, y, reference, floating, strategy, context,} = useFloating({
        open,
        onOpenChange: setOpen,
        placement: 'bottom-start',
        strategy: 'fixed',
        middleware: [offset(2), flip(), shift()],
        whileElementsMounted: autoUpdate,
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);
    const role = useRole(context);

    const {
        getFloatingProps,
        getReferenceProps,
    } = useInteractions([dismiss, click, role]);

    useEffect(() => {
        if (preset && preset !== true) {
            setOpen(false);
        }
    }, [preset]);

    useEffect(() => {
        if(!isFirstRender){
            if (date.end && date.start && typeof onUpdate === 'function') {
                onUpdate(date);
            }
        } else {
            setIsFirstRender(false);
        }
        setOpen(false);
    }, [date]);

    useEffect(() => {
        if(isFirstRender){
            setLabel(() => ({
                key: initialValue,
                label: upperFirst(initialValue.replace(/_/g, ' '))
            }))
        }
    }, []);

    function setDateFromPreset(preset) {
        const presetDates = presets.current?.[preset];
        if(typeof presetDates === "function") {
            setDate(() => presetDates());
            setPreset(false);
            setLabel(() => ({
                key: preset,
                label: upperFirst(preset.replace(/_/g, ' '))
            }));
        }
    }

    return (
        <div className="flex p-1">
            <button
                className={`flex py-1 px-2 relative border border-tr rounded-md items-center hover:bg-gary-100 ${open ? 'bg-white shadow ring-2 ring-primary-100 border-primary-400' : ''}`}
                ref={reference}
                {...getReferenceProps()}
            >
                <span className="text-gray-500 font-normal">
                    Display data from {label.label}
                </span>
                <span className="ml-2">
                    <Icon name="chevron-down" className={`w-4 h-4 transition-all ${open ? 'rotate-180' : ''}`}/>
                </span>
            </button>
            {open && (
                <FloatingFocusManager context={context} modal={false}>
                    <div
                        className="bg-white shadow-lg rounded-lg border border-gray-200 absolute z-10"
                        style={{
                            position: strategy,
                            top: y ?? 0,
                            left: x ?? 0,
                            width: 'max-content',
                        }}
                        ref={floating}
                        {...getFloatingProps()}
                    >
                        <div className="flex divide-x rtl:divide-x-reverse">
                            <div className="p-2 flex flex-col justify-start text-sm text-zinc-600">
                                {Object.keys(presets.current).map((key, index) => (
                                    <button
                                        key={index}
                                        className={`p-1 px-2 rounded-md hover:bg-gray-100 text-left rtl:text-right`}
                                        onClick={() => setDateFromPreset(key)}
                                    >
                                        {upperFirst(key.replace(/_/g, ' '))}
                                    </button>
                                ))}
                                <button className="p-1 px-2 rounded-md hover:bg-gray-100 text-left rtl:text-right" onClick={() => setPreset(true)}> Custom </button>
                            </div>
                            {preset === true && (
                                <div className="p-2 flex flex-col justify-start w-96 space-y-4">
                                    <div className="flex flex-col h-full">
                                        <div className="flex-grow flex flex-col space-y-4">
                                            <Label value="End date">
                                                <Input
                                                    type={'date'}
                                                    value={date.start.format('YYYY-MM-DD')}
                                                    handleChange={e => setCustom({...custom, start: moment(e.target.value)})}
                                                    className="w-full text-sm text-gray-700"
                                                />
                                            </Label>
                                            <Label value="End date">
                                                <Input
                                                    type={'date'}
                                                    value={date.end.format('YYYY-MM-DD')}
                                                    handleChange={e => setCustom({...custom, end: moment(e.target.value)})}
                                                    className="w-full text-sm text-gray-700"
                                                />
                                            </Label>
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                className="p-1 px-2 rounded-md hover:bg-gray-100 text-left rtl:text-right"
                                                onClick={() => {
                                                    setDate({...custom});
                                                    setLabel(() => ({
                                                        key: 'custom',
                                                        label: `${custom.start.format('D MMM YYYY')} - ${custom.end.format('D MMM YYYY')}`
                                                    }));
                                                    setOpen(false);
                                                }}
                                            > Apply </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </FloatingFocusManager>
            )}
        </div>
    )
}

export default DatesPickerRangeWidgets;
