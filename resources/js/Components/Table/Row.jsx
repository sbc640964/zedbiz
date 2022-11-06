function Row({ children, className, ...props }) {
    return (
        <div className={`flex border-b last:border-b-0 w-full ${className}`} {...props}>
            {children}
        </div>
    )
}

export default Row
