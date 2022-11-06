function Tabs({className, children, ...props}) {
    return (
        <div className="relative">
            <ol className={'flex block items-center'} {...props}>
                {children}
            </ol>
            <span className="absolute w-full block bottom-0 h-0.5 bg-gray-200"/>
        </div>
    )
}

export default Tabs
