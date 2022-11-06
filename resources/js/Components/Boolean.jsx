import Icon from "@/Components/Icon";

function Boolean({ value, trueLabel = null, falseLabel = null, ...props }) {
    return (
        value
            ? trueLabel ?? <Icon name="check-circle" className="h-6 w-6 text-green-400"/>
            : falseLabel ?? <Icon name="x-circle" className="h-6 w-6 text-red-400"/>
    )
}

export default Boolean
