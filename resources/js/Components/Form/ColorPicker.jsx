import Button from "@/Components/Button";
import EmptyModal from "@/Components/Dialogs/EmptyModal";
import {useState} from "react";

function TailwindColorPicker({ value, handleChange, size, icon, iconType, disabled, className, errors, tint = 500, ...props }) {
    const [open, setOpen] = useState(false);

    const colors = {
        500: {'primary': 'bg-primary-500', 'secondary': 'bg-secondary-500', 'success': 'bg-success-500', 'danger': 'bg-danger-500', 'warning': 'bg-warning-500', 'info': 'bg-info-500',},
        400: {'primary': 'bg-primary-400', 'secondary': 'bg-secondary-400', 'success': 'bg-success-400', 'danger': 'bg-danger-400', 'warning': 'bg-warning-400', 'info': 'bg-info-400',},
        300: {'primary': 'bg-primary-300', 'secondary': 'bg-secondary-300', 'success': 'bg-success-300', 'danger': 'bg-danger-300', 'warning': 'bg-warning-300', 'info': 'bg-info-300',},
        200: {'primary': 'bg-primary-200', 'secondary': 'bg-secondary-200', 'success': 'bg-success-200', 'danger': 'bg-danger-200', 'warning': 'bg-warning-200', 'info': 'bg-info-200',},
        100: {'primary': 'bg-primary-100', 'secondary': 'bg-secondary-100', 'success': 'bg-success-100', 'danger': 'bg-danger-100', 'warning': 'bg-warning-100', 'info': 'bg-info-100',},
        50: {'primary': 'bg-primary-50', 'secondary': 'bg-secondary-50', 'success': 'bg-success-50', 'danger': 'bg-danger-50', 'warning': 'bg-warning-50', 'info': 'bg-info-50',},
        600: {'primary': 'bg-primary-600', 'secondary': 'bg-secondary-600', 'success': 'bg-success-600', 'danger': 'bg-danger-600', 'warning': 'bg-warning-600', 'info': 'bg-info-600',},
        700: {'primary': 'bg-primary-700', 'secondary': 'bg-secondary-700', 'success': 'bg-success-700', 'danger': 'bg-danger-700', 'warning': 'bg-warning-700', 'info': 'bg-info-700',},
        800: {'primary': 'bg-primary-800', 'secondary': 'bg-secondary-800', 'success': 'bg-success-800', 'danger': 'bg-danger-800', 'warning': 'bg-warning-800', 'info': 'bg-info-800',},
        900: {'primary': 'bg-primary-900', 'secondary': 'bg-secondary-900', 'success': 'bg-success-900', 'danger': 'bg-danger-900', 'warning': 'bg-warning-900', 'info': 'bg-info-900',},
    }[tint] ?? {};

    return (
        <>
            <Button
                type="button"
                action={() => setOpen(true)}
                color={value}
                className={`block z-10 cursor-pointer ${icon ? '!p-1.5' : '!p-0.5'} border border-gray-300 focus:border-primary-500 focus:ring-primary-500 focus:ring-2 focus:ring-opacity-50 ${className}`}
                negative
                icon={icon}
                iconType={iconType ?? "outline"}
                disabled={disabled}
                size={size}
            >
                {icon ? null : <span className={`block ${size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'} rounded bg-${value}-${tint}`}/>}
            </Button>
            <EmptyModal
                open={open}
                setOpen={setOpen}
                className="w-96"
            >
                {({close}) => (
                    <>
                        <div className="flex items-center justify-between px-4 py-3 border-b">
                            <h2 className="text-lg font-bold text-gray-600">Select Color</h2>
                        </div>
                        <div className="p-4 grid grid-cols-4 gap-4 bg-gray-100 max-h-[calc(100vh-10rem)] overflow-auto">
                            {Object.keys(colors).map((color) => (
                                <div
                                    key={color}
                                    className="flex flex-col items-center justify-center w-full p-4 rounded-lg bg-white cursor-pointer"
                                    onClick={() => {
                                        handleChange(color);
                                        close();
                                    }}
                                >
                                    <div className={`w-8 h-8 rounded-full bg-${color}-${tint}`} />
                                    <div className="text-center text-xs mt-3 text-gray-300">{color}</div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </EmptyModal>
        </>
    )
}

export default TailwindColorPicker
