import * as icons from '@heroicons/react/24/outline';
import Button from "@/Components/Button";
import Icon from "@/Components/Icon";
import EmptyModal from "@/Components/Dialogs/EmptyModal";
import {useState} from "react";
import Input from "@/Components/Form/Input";
import SearchInput from "@/Components/Form/SearchInput";
import {lowerCase} from "lodash";

function IconPicker({ value, handleChange, disabled, className, size, onBlur, errors, ...props }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    return (
        <>
            <Button
                type="button"
                action={() => setOpen(true)}
                color="secondary"
                className={`${className ?? ''} block z-10 cursor-pointer p-1.5 border border-gray-300 focus:border-primary-500 focus:ring-primary-500 focus:ring-2 focus:ring-opacity-50`}
                negative
                disabled={disabled}
                icon={value}
                iconType="outline"
                size={size}
            />
            <EmptyModal
                open={open}
                setOpen={setOpen}
                className="w-96"
                onClose={onBlur}
            >
                {({close}) => (
                    <>
                        <div className="flex items-center justify-between px-4 py-3 border-b">
                            <h2 className="text-lg font-bold text-gray-600">Select Icon</h2>
                            <div className="flex items-center gap-x-2">
                                <SearchInput
                                    value={search}
                                    handleChange={e => setSearch(e.target.value)}
                                    className="w-60 mr-10 py-0.5"
                                />
                            </div>
                        </div>
                        <div className="p-4 grid grid-cols-4 gap-4 bg-gray-100 max-h-[calc(100vh-10rem)] overflow-auto">
                            {Object.keys(icons).filter((icon) => search ? lowerCase(icon).includes(search.toLowerCase()) : true).map((icon) => (
                                <div
                                    key={icon}
                                    className="flex flex-col items-center justify-center w-full p-4 rounded-lg bg-white cursor-pointer"
                                    onClick={() => {
                                        handleChange(icon);
                                        close();
                                    }}
                                >
                                    <Icon name={icon} className="w-8 h-8 text-gray-500" />
                                    <div className="text-center text-xs mt-3 text-gray-300">{lowerCase(icon).replace(' icon', '')}</div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </EmptyModal>
        </>
    )
}

export default IconPicker
