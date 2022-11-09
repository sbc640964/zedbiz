import Icon from "@/Components/Icon";
import {Inertia} from "@inertiajs/inertia";
import {collect} from "collect.js";

function HeadColumn({ children, className, width, isSortable, column, queryParameters, show = true, ajax }) {

    if(!show) {
        return null;
    }

    function sortDirection() {
        return queryParameters.sortColumn === column.name
            ? queryParameters.sortDirection
            : null;
    }

    function sortableColumn() {
        if(!isSortable) {
            return null;
        }

        const sortDirectionStatus = sortDirection();

        console.log('sortDirectionStatus: ', sortDirectionStatus);

        const [newColumn, newDirection] = (sortDirectionStatus === 'asc' ? `${column.name}:desc` : (sortDirectionStatus === 'desc' ? '' : `${column.name}:asc`))?.split(':');

        console.log(newColumn, newDirection);

        const params = collect({
            sortColumn: newColumn,
            sortDirection: newDirection,
        }).all();

        const newParams = collect({...queryParameters})
            .except(['sortColumn', 'sortDirection', 'page'])
            .merge(params);

        if(ajax) {
            return ajax(newParams.all());
        }

        const url = window.location.origin + window.location.pathname;

        Inertia.get( url, newParams.filter().all(),{
            preserveState: true,
            preserveScroll: true,
            only: ['records', 'queryParameters'],
        })
    }

    return (
        <div
            className={`flex items-center text-xs text-gray-500 max-w-full whitespace-nowrap py-2 px-4 bg-gray-50 uppercase font-bold ${className}`}
            style={{flex: `${width ? 0 : 1} 0 ${width ? width : 0}px`, minWidth: `${width ?? 100}px`}}
        >
            <div className={`flex items-center ${isSortable ? 'cursor-pointer' : ''}`} onClick={isSortable ? sortableColumn : null}>
                <span>{children}</span>
                {isSortable && sortDirection() === null && <Icon name="chevron-down" type="solid" className="ml-1 h-3 w-3 text-gray-400" />}
                {isSortable && sortDirection() === 'asc' && <Icon name="chevron-up" type="solid" className="ml-1 h-3 w-3 text-gray-600" />}
                {isSortable && sortDirection() === 'desc' && <Icon name="chevron-down" type="solid" className="ml-1 h-3 w-3 text-gray-600" />}
            </div>
        </div>
    )
}

export default HeadColumn
