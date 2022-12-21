function Switcher({ name, value, handleChange, color, size, type, className, ...props }) {

    function onChange() {
        if(!props?.disabled) {
            handleChange({target: {name, value: !value}})
        }
    }

    const classesSizes = {
        body: {
            xs: 'w-6 h-3.5',
            sm: 'w-8 h-4',
            md: 'w-12 h-6',
            lg: 'w-16 h-8',
            xl: 'w-20 h-10',
        }[size] ?? 'w-12 h-6',
        circle: {
            xs: 'w-2 h-2',
            sm: 'w-2.5 h-2.5',
            md: 'w-4 h-4',
            lg: 'w-5 h-5',
            xl: 'w-6 h-6',
        }[size] ?? 'w-4 h-4',
        circleActive: {
            sm: 'translate-x-[1rem]',
            md: 'translate-x-[1.6rem]',
            lg: 'translate-x-[2rem]',
            xl: 'translate-x-[2.4rem]',
        }[size] ?? 'translate-x-[1.6rem]',
    }

    return (
        <label className="mt-1 relative inline-block align-middle select-none transition duration-200 ease-in">
            <button
                type="button"
                role="checkbox"
                aria-checked={!!value}
                aria-label={name}
                className={`inline-block border relative shadow-inner ${classesSizes.body} rounded-full transition focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-400 focus:ring-opacity-50 ${className}`}
                onClick={onChange}
                name={name}
                onBlur={e => typeof props?.onBlur === 'function' && props?.onBlur({ ...e, target: { ...e.target, value: value } })}
            >
                <span
                    className={`${classesSizes.circle} block rounded-full transition duration-200 ease-in-out top-1 transform ${!!value ? `${classesSizes.circleActive} bg-primary-600` : 'translate-x-1 bg-gray-600/30'}`}
                />
            </button>
        </label>
    );
}

export default Switcher
