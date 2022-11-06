function ResultsTablePaginator({data, label, className}) {
    return (
        <div className={`flex items-center text-sm font-medium ${className}`}>
            Showing {data.from} to {data.to} of {data.total} {label ? label : 'results'}
        </div>
    )
}

export default ResultsTablePaginator
