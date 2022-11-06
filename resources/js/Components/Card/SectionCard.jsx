function SectionCard({label, show = true, className = '', children}) {
    if (!show) return null;
    return (
        <div className={`flex flex-col w-full rounded-lg overflow-hidden shadow border border-gray-300 ${className}`}>
            <div className="bg-gray-100 py-3 px-4 uppercase font-bold text-xs text-gray-600 border-b border-gray-300">
                <div>
                    {label}
                </div>
            </div>
            <div className="bg-white">
                {children}
            </div>
        </div>
    )
}

export default SectionCard
