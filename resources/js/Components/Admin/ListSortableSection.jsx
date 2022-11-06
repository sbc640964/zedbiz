import Button from "@/Components/Button";
import SectionCard from "@/Components/Card/SectionCard";
import {DndContext} from "@dnd-kit/core";
import {restrictToVerticalAxis} from "@dnd-kit/modifiers";
import {arrayMove, SortableContext, useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Children, Fragment} from "react";

function ListSortableSection({show, actions, labelAdd, addItem, changeOrder, remove, setData, errors, label, items, ...props}) {
    function onDragEnd(event) {
        const { active, over } = event;

        const _items = items;

        const activeIndex = active.data.current.sortable.index;
        const overIndex = over.data.current?.sortable.index || 0;

        const newValue = arrayMove(_items, activeIndex, overIndex);

        if (active.id !== over.id) {
            typeof changeOrder === 'function' && changeOrder(newValue);
        }
    }

    return (
        <SectionCard label={label} className="mt-10" show={show}>
            <DndContext
                onDragEnd={onDragEnd}
                modifiers={[restrictToVerticalAxis]}
            >
                <SortableContext id={label.toLowerCase().trim().replace(' ', '')} items={items ?? []}>
                    <div>
                        {items.map((item, index) => (
                            <Item
                                key={item?.id ?? index}
                                item={item}
                                index={index}
                                setData={(key, value) => setData(`${index}.${key}`, value)}
                                errors={errors}
                                show={items?.length}
                                remove={() => remove(index)}
                                {...props}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
            <div className="p-4 flex space-x-4 rtl:space-x-reverse">
                <Button
                    className="text-sm"
                    action={addItem}
                >
                    {labelAdd}
                </Button>
                {actions && actions.map((action, index) => <Fragment key={index}>{action}</Fragment>)}
            </div>
        </SectionCard>
    )
}


function Item(props) {

    const {item} = props;

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: item.id
    });

    const ComponentItem = props?.ComponentItem ?? 'div';

    return(
        <div
            ref={setNodeRef}
            style={{transform: CSS.Translate.toString(transform), transition}}
            className={`border-b ${isDragging ? 'bg-white shadow-lg z-50 opacity-50' : 'z-0'}`}
        >
            <ComponentItem
                key={item.id}
                label={item.label}
                handle={{...listeners, ...attributes}}
                {...props}
            />
        </div>
    )
}

export default ListSortableSection
