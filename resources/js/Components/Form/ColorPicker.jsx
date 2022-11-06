import Button from "@/Components/Button";
import EmptyModal from "@/Components/Dialogs/EmptyModal";
import {useState} from "react";

function TailwindColorPicker({ value, handleChange, size, icon, iconType, disabled, className, errors, ...props }) {
    const [open, setOpen] = useState(false);

    const colors = {
        'primary': 'bg-primary-500',
        'secondary': 'bg-secondary-500',
        'success': 'bg-success-500',
        'danger': 'bg-danger-500',
        'warning': 'bg-warning-500',
        'info': 'bg-info-500',
    };

    return (
        <>
            <Button
                type="button"
                action={() => setOpen(true)}
                color={value}
                className={`block z-10 cursor-pointer p-1.5 border border-gray-300 focus:border-primary-500 focus:ring-primary-500 focus:ring-2 focus:ring-opacity-50 ${className}`}
                negative
                icon={icon}
                iconType={iconType ?? "outline"}
                disabled={disabled}
                size={size}
            />
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
                                    <div className={`w-8 h-8 rounded-full bg-${color}-500`} />
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
