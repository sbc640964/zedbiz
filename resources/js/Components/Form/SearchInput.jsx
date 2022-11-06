import Input from "@/Components/Form/Input";
import Icon from "@/Components/Icon";

function SearchInput({
    name,
    value,
    className = '',
    required = false,
    isFocused,
    handleChange = () => null,
    placeholder = 'Search...',
    size = 'md',
    color = 'primary',
}) {
    return (
        <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center justify-center w-8 h-8 text-gray-400 pointer-events-none group-focus-within:text-indigo-500">
               <Icon
                   name={'magnifying-glass'}
                   className="h-5 w-5"
               />
            </span>
            <Input
                type="search"
                name={name}
                value={value}
                required={required}
                isFocused={isFocused}
                handleChange={handleChange}
                className={`pl-9 ${className}`}
                autoComplete={'false'}
                placeholder={placeholder}
                size={size}
                color={color}
            />
        </div>
    )
}

export default SearchInput
