function RowHeader({className, children}) {
    return (
        <div className={`flex border-y w-full first:border-t-0 ${className}`}>
            {children}
        </div>
        )
}

export default RowHeader
