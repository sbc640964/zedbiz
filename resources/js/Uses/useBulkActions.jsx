import {useCallback, useState} from "react";
import Checkbox from "@/Components/Form/Checkbox";
import {usePage} from "@inertiajs/inertia-react";
import LoaderSpinner from "@/Components/LoaderSpinner";

function useBulkActions(records, actions) {

    const page = usePage();

    const [selected, setSelected] = useState([]);
    const [processing, setProcessing] = useState(false);

    function isSelected(id) {
        return selected.includes(id);
    }

    function toggleSelected(id) {
        if (isSelected(id)) {
            setSelected(selected.filter(item => item !== id));
        } else {
            setSelected([...selected, id]);
        }
    }

    function selectAll() {
        const isAdminScreen = page.props?.isAdminScreen;
        const url = isAdminScreen
            ? route('admin.apps.edit.collections.lists.select-all', route().params)
            : route('lists.select_all', route().params);

        setProcessing(true);

        axios.get(url).then(response => {
            setSelected(response.data);
            setProcessing(false);
        });
    }

    function deselectAll() {
        setSelected([]);
    }

    function selectAllInScreen() {
        setSelected([...selected, ...records.data.map(item => item.id).filter(id => !isSelected(id))]);
    }

    function deselectAllInScreen() {
        const ids = records.data.map(item => item.id);
        setSelected(selected.filter(item => !ids.includes(item)));
    }

    function getSelectedIds() {
        return selected;
    }

    const hasSelected = selected.length > 0;
    const hasSelectedInScreen = selected.filter(item => records.data.map(item => item.id).includes(item)).length > 0;

    const CheckRow =  useCallback(({id}) => {
        return (
            <Checkbox
                checked={isSelected(id)}
                onChange={() => toggleSelected(id)}
            />
        );
    }, [selected, records]);

    //select all in screen
    const CheckAll = useCallback(() => {
        return (
            <Checkbox
                checked={hasSelectedInScreen}
                onChange={() => hasSelectedInScreen ? deselectAllInScreen() : selectAllInScreen()}
            />
        );
    }, [hasSelectedInScreen, records]);

    const Status =  useCallback(() => {
        return hasSelected ? (
            <div className="flex items-center px-4 py-2 bg-primary-50 border-b">
                <span className="text-sm text-gray-700">
                    {selected.length} rows selected.
                </span>
                {selected.length < records.total &&
                    <button
                        className={`relative text-sm ml-1 rtl:ml-0 rtl:mr-1 font-bold ${processing ? 'text-transparent' : 'text-primary-500 hover:text-primary-400'} transition cursor-pointer`}
                        onClick={selectAll}
                    >
                        Select all {records.total} rows.
                        {processing &&
                            <span className="absolute inset-0 w-full h-full inline-flex justify-center items-center">
                                <LoaderSpinner
                                    className="w-4 h-4 fill-primary-500"
                                />
                            </span>
                        }
                    </button>
                }
                <button
                    className="text-sm ml-1 rtl:ml-0 rtl:mr-1 font-bold text-primary-500 hover:text-primary-400 transition cursor-pointer"
                    onClick={deselectAll}
                >
                    Clear all selected rows
                </button>
                {/*{hasSelected && actions}*/}
            </div>
        ) : null;
    }, [hasSelected, selected, records, processing]);


    return {
        CheckAll,
        CheckRow,
        Status,
    }
}

export default useBulkActions
