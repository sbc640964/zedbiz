import {useState} from "react";
import Dropdown from "@/Components/Dropdown";
import Icon from "@/Components/Icon";
import Button from "@/Components/Button";
import {upperFirst} from "lodash/string";

function ListWidget({label, column, widgetsValues, icon, aggregations, color, id}) {

    const [currentAggregation, setCurrentAggregation] = useState(aggregations[0] );

    const colorIcon = {
        success: 'fill-green-100 stroke-green-600',
        warning: 'fill-yellow-100 stroke-yellow-600',
        danger: 'fill-red-100 stroke-red-600',
        info: 'fill-sky-100 stroke-sky-600',
        primary: 'fill-blue-100 stroke-blue-600',
        secondary: 'fill-gray-100 stroke-gray-600',
    }[color ?? 'primary'];

    return (
        <div key={id} className="bg-white rounded-lg shadow p-5">
            <div className="flex-col">
                <div className="flex justify-between items-start">
                    <Icon name={icon} className={`h-10 w-10 stroke-[0.5] ${colorIcon}`} type="outline"/>
                    {aggregations.length > 1 &&
                        <Dropdown>
                            <Dropdown.Trigger>
                                <Button
                                    size="sm"
                                    className="text-gray-500 hover:text-gray-700"
                                    icon="ellipsis-vertical"
                                    negative
                                    color="secondary"
                                />
                            </Dropdown.Trigger>
                            <Dropdown.Content contentClasses="p-2 bg-white">
                                {aggregations?.map((aggregation) => (
                                    <a
                                        key={aggregation}
                                        className={`cursor-pointer rounded-lg px-2 py-1 block ${aggregation === currentAggregation ? 'bg-primary-300 text-primary-700 font-bold' : 'hover:bg-gray-100 text-gray-600'}`}
                                        onClick={() => setCurrentAggregation(aggregation)}
                                    >
                                        {upperFirst(aggregation)}
                                        {/*<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">{aggregation}</a>*/}
                                    </a>
                                ))}
                            </Dropdown.Content>
                        </Dropdown>
                    }
                </div>
                <div className="mt-2 flex items-center text-2xl font-bold text-gray-800">
                    <span className="">
                        {widgetsValues?.[id + '_' + currentAggregation] ?? '0'}
                    </span>
                </div>
                <div>
                    <div>
                        <p className="text-sm font-medium text-gray-400">
                            {upperFirst(currentAggregation)} the {label}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListWidget
