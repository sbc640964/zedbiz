import Authenticated from "@/Layouts/Authenticated";
import App from "@/Layouts/App";
import Button from "@/Components/Button";
import {PageIcon} from "@/Pages/Admin/Apps/Pages/Index";
import Tooltip from "@/Components/Dialogs/Tooltip";
import ContainerPage from "@/Components/Table/ContainerPage";
import {useCallback, useEffect, useRef, useState} from "react";
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
import SettingsModal from "@/Pages/Admin/Apps/Pages/SettingsModal";
import DatesPickerRangeWidgets from "@/Components/Widgets/DatesPickerRangeWidgets";

function Edit({ app, collection, page, session_store = {}, ...props }) {

    const [openModal, setOpenModal] = useState(false);
    const [openSettingsModal, setOpenSettingsModal] = useState(false);

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

    function setDates(newDates) {
        Inertia.reload({
            data: {
                range_date_start: newDates.start.format('YYYY-MM-DD'),
                range_date_end: newDates.end.format('YYYY-MM-DD'),
            },
            preserveScroll: true,
            preserveState: true,
        })
    }

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
                </Dropdown>,
                <Button
                    icon={'cog-8-tooth'}
                    iconType={'outline'}
                    negative
                    action={() => setOpenSettingsModal(true)}
                />,
            ]}
        >
            <div>
                <div>
                    <DatesPickerRangeWidgets
                        onUpdate={newDates => setDates(newDates)}
                        initialValue={page.settings?.default_range_date ?? 'this_month'}
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

            <SettingsModal
                open={openSettingsModal}
                setOpen={setOpenSettingsModal}
                page={page}
            />
        </ContainerPage>
    )
}

Edit.layout = page => <Authenticated title={'Page'}>
    <App children={page}/>
</Authenticated>;

export default Edit
