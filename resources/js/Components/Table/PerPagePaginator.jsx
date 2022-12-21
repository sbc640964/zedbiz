import Label from "@/Components/Form/Label";
import React, {useEffect, useState} from "react";
import {Inertia} from "@inertiajs/inertia";
import {usePage} from "@inertiajs/inertia-react";

const PerPagePaginator =  React.memo(function ({options, data, url}){

    const {isAdminScreen} = usePage().props;
    const [perPage, setPerPage] = useState(data.per_page);
    const [rendered, setRendered] = useState(false);

    useEffect(() => {
        if (!rendered) {
            setRendered(true);
        } else {
            Inertia.put(isAdminScreen ? route('central-options.update') : route('options.update'), {
                key: 'per_page-' + window.location.pathname.slice(1),
                value: perPage,
                redirect: window.location.pathname,
            }, {
                preserveScroll: true,
                preserveState: true
            });
        }
    }, [perPage]);

    const selectOptions = options ?? [10, 25, 50, 100, 250];

    return (
        <div className="flex justify-center items-center space-x-2 rtl:space-x-reverse text-sm">
            <select value={perPage.toString()} onChange={e => setPerPage(e.target.value)} name="per-page-paginate" className="text-sm placeholder:text-gray-300 pr-8 placeholder:text-sm border-gray-300 focus:ring focus:ring-opacity-50 rounded-md shadow-sm focus:border-primary-300 focus:ring-primary-200 py-1.5">
                {selectOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
            <Label htmlFor="per-page-paginate" className="text-sm text-gray-500">
                per page
            </Label>
        </div>
    )
})

export default PerPagePaginator
