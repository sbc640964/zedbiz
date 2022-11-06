import Icon from "@/Components/Icon";
import {useEffect, useState} from "react";

function ImageInput({id, name, value, handleChange, className, iconName = "document-arrow-up", allowTypes}) {

    const [image, setImage] = useState(null);

    useEffect(() => {
        setImage(value instanceof File ? URL.createObjectURL(value) : null);
    }, [value]);

    const style = {
        backgroundImage: `url(${image})`,
    }

    return (
        <div style={image ? style : {}} className={`bg-contain bg-no-repeat bg-center relative w-full h-40 border-dashed border rounded-md cursor-pointer group hover:bg-gray-50/50 transition ${className}`}>
            <input
                id={id}
                type="file"
                name={name}
                className={`w-full h-full opacity-0 cursor-pointer absolute top-0 left-0`}
                onChange={handleChange}
                accept={allowTypes}
            />
            {!image &&
                <div className="flex justify-center items-center flex-col absolute top-1/2 left-1/2 max-h-full transform -translate-x-1/2 -translate-y-1/2 p-4">
                    <Icon name={iconName} className="w-1/2 h-1/2 text-gray-200 stroke-1 transition group-hover:text-gray-300"/>
                    <span className="text-gray-300 group-hover:text-gray-500 transition">Drag and drop here or click here</span>
                </div>
            }
        </div>
    )
}

export default ImageInput
