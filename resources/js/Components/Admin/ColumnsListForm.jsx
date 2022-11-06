import Input from "@/Components/Form/Input";
import Button from "@/Components/Button";
import Select from "@/Components/Form/Select";
import {collect} from "collect.js";
import {get as getData} from "lodash";
import {DndContext, useDroppable} from "@dnd-kit/core";
import {CSS} from '@dnd-kit/utilities';
import {SortableContext, useSortable, arrayMove,} from "@dnd-kit/sortable";
import {v4 as uuid} from 'uuid';
import {restrictToVerticalAxis} from "@dnd-kit/modifiers";
import Icon from "@/Components/Icon";

function ColumnsListForm({data, setData, errors, collection, collections}) {

    const systemColumns = [
        {label: 'ID', value: 'id', type: 'text'},
        {label: 'Created At', value: 'created_at', type: 'datetime'},
        {label: 'Updated At', value: 'updated_at', type: 'datetime'},
        {label: 'User Created', value: 'user_created_id', type: 'relation'},
        {label: 'User Modified', value: 'user_modified_id', type: 'relation'},
    ];

    function getSelectsOptions() {
        let options = [];

        collect(collection.columns).each(column => {
            options.push({
                label: column.label,
                value: `${collection.table_name}.${column.name}`,
                name: column.name,
                table: collection.table_name
            });
        });

        systemColumns.forEach(column => {
            options.push({
                label: column.label,
                value: `${collection.table_name}.${column.value}`,
                name: column.value,
                table: collection.table_name
            });
        });

        if(data.settings.query_joins) {
            data.settings.query_joins.forEach(join => {
                const joinColumns = collections.find(collection => collection.table_name === join.table)?.columns ?? [];
                const alias = join?.['as'] ? join['as'] : join.table;
                let group = [...collect(joinColumns).map(column => ({
                    label: column.label,
                    value: `${alias}.${column.name}`,
                    name: column.name,
                    table: join.table
                })).all(), ...collect(systemColumns).map(column => ({
                    label: column.label,
                    value: `${alias}.${column.value}`,
                    name: column.value,
                    table: join.table
                })).all()];

                options.push({
                    label: alias,
                    options: group,
                });
            });
        }

        return options;
    }

    function getColumn(obj, key = null) {
        const column = collections
            .find(collection => collection.table_name === obj.table)
            ?.columns
            ?.find(column => column.name === obj.name);

        return key ? getData(column, key) : column;
    }

    function handleDragEnd(event) {
        const { active, over } = event;

        const items = data.settings.query_selects;

        const activeIndex = active.data.current.sortable.index;
        const overIndex = over.data.current?.sortable.index || 0;

        const newValue = arrayMove(items, activeIndex, overIndex);

        if (active.id !== over.id) {
            setData('settings.query_selects', newValue);
        }
    }

    return (
        <>
            <div className="flex flex-col">
                <DndContext
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                >
                    <SortableContext id="selects" items={data.settings.query_selects ?? []}>
                        <div>
                            {(data.settings?.query_selects ?? []).map((select, index) => (
                                <ItemSelect
                                    key={index}
                                    select={select}
                                    index={index}
                                    data={data}
                                    setData={setData}
                                    getColumn={getColumn}
                                    getSelectsOptions={getSelectsOptions}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
            <Button
                size="sm"
                action={() => {
                    const selects = data.settings.query_selects ?? [];
                    selects.push({id: uuid(), type: 'select', aggregation: null, column: '', label: '', alias: ''});
                    setData('settings.query_selects', selects);
                }}
            >
                Add select
            </Button>

            <Button
                size="sm"
                className="ml-2"
                action={() => {
                    const selects = data.settings.query_selects ?? [];
                    selects.push({id: uuid(), type: 'raw', column: '', label: '', alias: ''});
                    setData('settings.query_selects', selects);
                }}
            >
                Add raw select
            </Button>
        </>
    )
}

export default ColumnsListForm


function ItemSelect(props) {
    return(
        <Draggable {...props}>
            {({attributes, listeners}) => (
                props.select?.type === 'raw'
                    ? <ItemSelectRaw {...props} handlerProps={{...listeners, ...attributes}}/>
                    : <ItemSelectSelect {...props} handlerProps={{...listeners, ...attributes}}/>
            )}
        </Draggable>

    )
}

function Draggable({children, index, select}) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({id: select.id});

    // const {attributes, listeners, setNodeRef, transform, transition} = useDraggable({
    //     id: `select-${index}`,
    //     data: select,
    // });

    return (
        <div
            ref={setNodeRef}
            style={{transform: CSS.Translate.toString(transform), transition, zIndex: 99999}}
        >
            {children({attributes, listeners})}
        </div>
    );
}

function ItemSelectRaw(props) {
    const {select, index, data, setData} = props;
    return(
        <ItemSelectWrapper {...props}>
            <div className="w-full">
                <Input
                    value={select.value}
                    className="w-full py-2 text-sm"
                    placeholder={'Example: SUM(table.column * 2) as total'}
                    onChange={e => {
                        const selects = data.settings.query_selects;
                        selects[index].value = e.target.value;
                        setData('settings.query_selects', selects);
                    }}
                />
            </div>
        </ItemSelectWrapper>

    )
}

function ItemSelectWrapper({children, handlerProps, setData, data, index}) {
    return(
        <div className="flex space-x-2 items-center rtl:space-x-reverse mb-2">
            <div {...handlerProps}>
                <Icon name="bars-4" className="cursor-move w-4 h-4 text-gray-400 hover:text-gray-500 transition"/>
            </div>
            {children}
            <div className="flex justify-end items-center">
                <Button
                    color="danger"
                    className="mr-2"
                    negative
                    icon="trash"
                    iconType="outline"
                    size="sm"
                    action={() => {
                        const selects = data.settings.query_selects;
                        selects.splice(index, 1);
                        setData('settings.query_selects', selects);
                    }}
                />
            </div>
        </div>
    )
}

function ItemSelectSelect(props) {
    const {select, index, setData, getColumn, getSelectsOptions} = props;
    return (
       <ItemSelectWrapper {...props}>
           <div className="grid grid-cols-12 gap-4 w-full">
               <div className="col-span-4">
                   <Select
                       className="w-full text-sm"
                       options={getSelectsOptions()}
                       value={select.column}
                       handleChange={value => {
                           setData(`settings.query_selects.${index}.column`, value)
                           setData(`settings.query_selects.${index}.alias`, getColumn(value, 'label'))
                       }}
                       placeholder="Choose..."
                   />
               </div>
               <div className="col-span-4">
                   <Input
                       className="w-full text-sm py-2"
                       value={select.alias}
                       onChange={e => setData(`settings.query_selects.${index}.alias`, e.target.value)}
                       placeholder={select.column.name}
                   />
               </div>
           </div>
       </ItemSelectWrapper>
    )
}

function Droppable({children}) {
    const {setNodeRef} = useDroppable({
        id: 'selects',
    });

    return (
        <div ref={setNodeRef}>
            {children}
        </div>
    );
}

