import ResultsTablePaginator from "@/Components/Table/ResultsTablePaginator";
import PerPagePaginator from "@/Components/Table/PerPagePaginator";
import Paginator from "@/Components/Table/Paginator";

function PaginationSection({data, className = '', ajax = false}) {
    return (
        <div className={`grid grid-cols-3 p-2 justify-between items-center border-t ${className}`}>
            <ResultsTablePaginator data={data} className="ml-2 rtl:ml-0 rtl:mr-2"/>
            <div className="flex items-center justify-center">
                <PerPagePaginator data={data}/>
            </div>
            <div className="flex justify-end">
                <Paginator links={data.links} ajax={ajax}/>
            </div>
        </div>
    )
}

export default PaginationSection
