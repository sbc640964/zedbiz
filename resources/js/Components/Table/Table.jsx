function Table({className, children}) {
    return (
        <div className={`flex flex-col ${className}`}>
            {children}
        </div>
    )
}

export default Table
