import Authenticated from "@/Layouts/Authenticated";
import App from "@/Layouts/App";
import Button from "@/Components/Button";
import {PageIcon} from "@/Pages/Admin/Apps/Pages/Index";
import Tooltip from "@/Components/Dialogs/Tooltip";
import Widgets from "@/Components/Widgets";
import ContainerPage from "@/Components/Table/ContainerPage";
import {useCallback, useEffect, useState} from "react";
import NewWidget from "@/Pages/Admin/Modals/NewWidget";
import Dropdown from "@/Components/NewDropDown";
import Icon from "@/Components/Icon";
import RenderWidget from "@/Components/Widgets/RenderWidget";
import Input from "@/Components/Form/Input";
import Label from "@/Components/Form/Label";
import moment from "moment";
import {
    FloatingFocusManager,
    useDismiss,
    useInteractions,
    useFloating,
    autoUpdate,
    shift,
    offset,
    flip,
    useClick, useRole
} from "@floating-ui/react-dom-interactions";
import {set, upperFirst} from "lodash";
import {Inertia} from "@inertiajs/inertia";

function Edit({ app, collection, page, session_store, ...props }) {

    const [openModal, setOpenModal] = useState(false);
    const [store, _setStore] = useState(session_store);
    const [botting, setBotting] = useState(false);

    const type = {
        'table': 'List page',
        'dashboard': 'Widgets page',
        'form': 'Form page',
        'calendar': 'Calendar page',
    }[page.type];

    const widgets = [
        {
            id: 1,
            name: 'Number',
            icon: 'calculator',
            description: 'Count, Max or ect...',
            className: 'bg-primary-100 text-primary-600',
        },
        {
            id: 2,
            name: 'Chart',
            icon: 'chart-bar',
            description: 'Chart bar on datasets',
            className: 'bg-success-100 text-success-600',
        },
        {
            id: 3,
            name: 'Doughnut',
            icon: 'chart-pie',
            description: 'Chart pie on datasets',
            className: 'bg-warning-100 text-warning-600',
        },
        {
            id: 4,
            name: 'List',
            icon: 'table-cells',
            description: 'List of data',
            className: 'bg-info-100 text-info-600',
        }
    ]

    function setStore(key, value) {
        const newStore = set(store, key, value);
        _setStore({...newStore});
    }

    useEffect(() => {
        if(!botting){
            setBotting(true);
        } else {
            Inertia.post(route('session_store.update'), store, {
                preserveScroll: true,
            });
        }
    }, [store]);

    return (
        <ContainerPage
            label={<div className="flex space-x-3 rtl:space-x-reverse">
                <Tooltip content="Dashboard">
                    <span className="block"><PageIcon type={page.type} className="h-12 w-12 stroke-1 m-3"/></span>
                </Tooltip>
                <div className="felx flex-col">
                    <h1 className="text-3xl font-bold leading-none">{page.name}</h1>
                    <p className="text-gray-500 text-base font-normal">{page.description}</p>
                    <div className="flex">
                       <span className="bg-primary-600 text-primary-50 inline-block px-2 py-0.5 rounded-lg text-xs uppercase font-bold">{type}</span>
                    </div>
                </div>
            </div>}
            className="bg-transparent border-0 shadow-none"
            actions={[
                <Dropdown>
                    <Dropdown.Trigger>
                        <Button icon="plus" label="Widget"/>
                    </Dropdown.Trigger>
                    <Dropdown.Content width="100" contentClasses="w-96 bg-white flex flex-col space-y-1 p-2">
                        {widgets.map(widget => (
                            <div className="">
                                <div className="flex space-x-3 rtl:space-x-reverse rounded-lg hover:bg-gray-50 cursor-pointer p-2" onClick={() => setOpenModal(widget.name)}>
                                    <span><Icon name={widget.icon} className={'w-10 h-10 rounded-lg p-2 ' + widget.className} type="outline"/></span>
                                    <div className="felx flex-col">
                                        <h3 className="font-bold leading-none">{widget.name}</h3>
                                        <p className="text-gray-400 text-sm font-normal">{widget.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Dropdown.Content>
                </Dropdown>

            ]}
        >
            <div>
                <div>
                    <DatesPickerRangeWidgets
                        onChange={newDates => setStore('rangeDate', newDates)}
                        value={store?.rangeDate ?? {}}
                    />
                </div>
                <div className="flex flex-wrap -mx-3">
                    {Object.keys(props).filter(i => i.startsWith('widget_')).map(widgetName => (
                        <RenderWidget
                            key={widgetName}
                            widget={props[widgetName] ?? false}
                            setModalContent={props[widgetName]?.widget_settings ? () => setOpenModal(props[widgetName]?.widget_settings) : null}
                        />
                    ))}
                </div>
            </div>

            <NewWidget
                open={openModal}
                setOpen={setOpenModal}
                pageId={page.id}
                widget={openModal}
            />
        </ContainerPage>
    )
}

Edit.layout = page => <Authenticated title={'Page'}>
    <App children={page}/>
</Authenticated>;

export default Edit


function DatesPickerRangeWidgets({value, onChange}){

    const [open, setOpen] = useState(false);
    const [date, setDate] = useState({start: moment(value.start), end: moment(value.end)});
    const [isFirstRender, setIsFirstRender] = useState(true);

    const getDatesPresets = () => ({
        'today': {start: moment(), end: moment(),},
        'yesterday': {start: moment().subtract(1, 'days'), end: moment().subtract(1, 'days'),},
        'this_week': {start: moment().startOf('week'), end: moment().endOf('week'),},
        'last_week': {start: moment().subtract(1, 'weeks').startOf('week'), end: moment().subtract(1, 'weeks').endOf('week'),},
        'last_7_days': {start: moment().subtract(7, 'days'), end: moment(),},
        'last_30_days': {start: moment().subtract(30, 'days'), end: moment(),},
        'this_month': {start: moment().startOf('month'), end: moment().endOf('month'),},
        'last_month': {start: moment().subtract(1, 'months').startOf('month'), end: moment().subtract(1, 'months').endOf('month'),},
        'last_3_months': {start: moment().subtract(3, 'months').startOf('month'), end: moment().subtract(1, 'months').endOf('month'),},
        'last_6_months': {start: moment().subtract(6, 'months').startOf('month'), end: moment().subtract(1, 'months').endOf('month'),},
        'this_year': {start: moment().startOf('year'), end: moment().endOf('year'),},
        'last_year': {start: moment().subtract(1, 'years').startOf('year'), end: moment().subtract(1, 'years').endOf('year'),},
    });

    const [presets, setPresets] = useState(getDatesPresets());

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
            if (date.end && date.start && typeof onChange === 'function') {
                onChange(date);
            }
        } else {
            setIsFirstRender(false);
        }
        setOpen(false);
    }, [date]);

    const getLabelPreset = useCallback(() => {
        if(!date.start || !date.end) return null;
        const preset = Object.keys(presets).find(key => {
            const preset = presets[key];
            return preset.start.unix() === date.start.unix() && preset.end.unix() === date.end.unix();
        });
        return preset ? upperFirst(preset.replace(/_/g, ' ')) : null;
    }, [date, presets]);

    function setDateFromPreset(preset) {
        const presetDates = presets?.[preset];
        if(presetDates) {
            setDate(presetDates);
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
                    Display data from {!preset ? getLabelPreset() : ` ${date.start.format('DD/MM/YYYY')} to ${date.end.format('DD/MM/YYYY')}`}
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
                                {Object.keys(presets).map((key, index) => (
                                    <button
                                        key={index}
                                        className="p-1 px-2 rounded-md hover:bg-gray-100 text-left rtl:text-right"
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
                                                    onChange={date => setDate({...date, end: date})}
                                                    className="w-full text-sm text-gray-700"
                                                />
                                            </Label>
                                            <Label value="End date">
                                                <Input
                                                    type={'date'}
                                                    onChange={date => setDate({...date, start: date})}
                                                    className="w-full text-sm text-gray-700"
                                                />
                                            </Label>
                                        </div>
                                        <div className="flex justify-end">
                                            <button className="p-1 px-2 rounded-md hover:bg-gray-100 text-left rtl:text-right"> Apply </button>
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
