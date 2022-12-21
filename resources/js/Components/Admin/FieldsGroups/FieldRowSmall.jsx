function Field({label, helpText, children, show = true, checkbox = false}) {
    return (
        <>
            {show &&
                <label className={`flex items-center`}>
                    <span
                        className={`text-gray-700 mr-2 rtl:ml-2 rtl:mr-0 text-sm ${checkbox ? 'basis-1/2' : 'basis-1/3'}`}>{label}</span>
                    <div className={`flex-1  ${checkbox ? 'flex justify-end' : ''}`}>
                        {children}
                    </div>
                </label>
            }
        </>
    )
}

export default Field
