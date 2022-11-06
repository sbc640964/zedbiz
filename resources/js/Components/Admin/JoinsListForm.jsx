import Dropdown from "@/Components/Dropdown";
import Button from "@/Components/Button";
import {useState} from "react";
import {collect} from "collect.js";

function JoinsListForm({data, setData, errors, collection, collections}) {

    const [tables] = useState(getTables());

    function getTables() {
        if (!collections) return [];
        return collections.map(collection => {
            return {
                caption: collection.name,
                name: collection.name,
                score: 1000,
                value: collection.table_name,
                meta: 'collection table',
                columns: collection.columns
            }
        });
    }

    function getColumns() {
        let columns = [
            {
                label: `Primary Query (${collection.name})`,
                columns: [...collection.columns.map(column => {
                    return {
                        label: `${column.label}`,
                        value: `${collection.table_name}.${column.name}`,
                    }
                }), {
                    label: 'ID',
                    value: `${collection.table_name}.id`,
                }]
            }
        ];

        collect(tables).each(table => {
            columns.push({
                label: `${table.caption}`,
                columns: [...table.columns.map(column => {
                    return {
                        label: `${column.label}`,
                        value: `${table.value}.${column.name}`,
                    }
                }), {
                    label: 'ID',
                    value: `${table.value}.id`,
                }]
            })
        });

        return columns;
    }

    return (
        <>
            <div>
                {data.settings.query_joins?.map((join, index) => (
                    <div
                        className="flex items-center last:border-b-0 mb-2 space-x-2 rtl:space-x-reverse pb-2 border-b"
                        key={index}
                    >
                        <div className="text-gray-400 text-sm">
                            {index + 1}
                        </div>
                        <div>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <Button
                                        icon="chevron-down"
                                        color="primary"
                                        className="py-2 px-1"
                                        negative
                                        outline
                                    >
                                        {join.type} join
                                    </Button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <div className="px-2 py-1">
                                        <div
                                            className={`${join.type === 'inner' ? 'text-white bg-primary-600' : 'hover:bg-gray-100'} cursor-pointer rounded-md px-2 py-0.5 text-sm`}
                                            onClick={() => setData(`settings.query_joins.${index}.type`, 'inner')}
                                        >Inner
                                        </div>
                                        <div
                                            onClick={() => setData(`settings.query_joins.${index}.type`, 'left')}
                                            className={`${join.type === 'left' ? 'text-white bg-primary-600' : 'hover:bg-gray-100'} mt-1 cursor-pointer rounded-md px-2 py-0.5 text-sm`}>Left
                                        </div>
                                        <div
                                            onClick={() => setData(`settings.query_joins.${index}.type`, 'right')}
                                            className={`${join.type === 'right' ? 'text-white bg-primary-600' : 'hover:bg-gray-100'} mt-1 cursor-pointer rounded-md px-2 py-0.5 text-sm`}>Right
                                        </div>
                                        <div
                                            onClick={() => setData(`settings.query_joins.${index}.type`, 'full')}
                                            className={`${join.type === 'full' ? 'text-white bg-primary-600' : 'hover:bg-gray-100'} mt-1 cursor-pointer rounded-md px-2 py-0.5 text-sm`}>Full
                                        </div>
                                    </div>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        <div>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <Button
                                        icon="chevron-down"
                                        color="primary"
                                        className="py-2 px-2"
                                        negative
                                        outline
                                        noupper={join.table}
                                    >
                                        {join.table ? join.table : 'Choose...'}
                                    </Button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <div className="px-2 py-1">
                                        {(tables ?? []).map(table => (
                                            <div
                                                key={table}
                                                onClick={() => setData(`settings.query_joins.${index}.table`, table.value)}
                                                className={`${join.table === table.value ? 'text-white bg-primary-600' : 'hover:bg-gray-100'} cursor-pointer rounded-md px-2 py-0.5 text-sm`}
                                            >{table.caption}</div>
                                        ))}
                                    </div>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        <div className="text-xs">
                            ON
                        </div>

                        <div>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <Button
                                        icon="chevron-down"
                                        color="primary"
                                        className="py-2 px-2"
                                        negative
                                        outline
                                        noupper={join.on_join}
                                    >
                                        {join.on_join ? join.on_join : 'Choose...'}
                                    </Button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <div className="px-2 py-1">
                                        <div
                                            onClick={() => setData(`settings.query_joins.${index}.on_join`, 'id')}
                                            className={`${join.on_join === 'id' ? 'text-white bg-primary-600' : 'hover:bg-gray-100'} cursor-pointer rounded-md px-2 py-0.5 text-sm`}
                                        >ID
                                        </div>
                                        {(tables.find(t => t.value === join.table)?.columns ?? []).map(column => (
                                            <div
                                                key={column.name}
                                                onClick={() => setData(`settings.query_joins.${index}.on_join`, column.name)}
                                                className={`${join.on_join === column.name ? 'text-white bg-primary-600' : 'hover:bg-gray-100'} cursor-pointer rounded-md px-2 py-0.5 text-sm`}
                                            >{column.label}</div>
                                        ))}
                                    </div>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                        <div className="text-xs">
                            =
                        </div>
                        <div>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <Button
                                        icon="chevron-down"
                                        color="primary"
                                        className="py-2 px-2"
                                        negative
                                        outline
                                        noupper={join.on_query}
                                    >
                                        {join.on_query ? join.on_query : 'Choose...'}
                                    </Button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <div className="px-2 py-1 max-h-60 overflow-auto">
                                        {(getColumns() ?? []).map(table => (
                                            <div key={table.name}>
                                                <span className="text-xs text-gray-500 font-bold uppercase">{table.label}</span>
                                                <div className="ml-2">
                                                    {table.columns.map(column => (
                                                        <div
                                                            key={column.value}
                                                            onClick={() => setData(`settings.query_joins.${index}.on_query`, column.value)}
                                                            className={`${join.on_query === column.value ? 'text-white bg-primary-600' : 'hover:bg-gray-100'} cursor-pointer rounded-md px-2 py-0.5 text-sm`}
                                                        >{column.label}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        <div className="flex items-center justify-end flex-1">
                            <Button
                                color="danger"
                                className="mr-2"
                                negative
                                icon="trash"
                                iconType="outline"
                                size="sm"
                                action={() => {
                                    const joins = data.settings.query_joins;
                                    joins.splice(index, 1);
                                    setData('settings.query_joins', joins);
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex">
                <Button
                    size="sm"
                    action={() => {
                        const joins = data.settings.query_joins ?? [];
                        joins.push({type: 'inner', table: '', on_join: '', on_query: ''});
                        setData('settings.query_joins', joins);
                    }}
                >
                    Add join
                </Button>
            </div>
        </>
    )
}

export default JoinsListForm
