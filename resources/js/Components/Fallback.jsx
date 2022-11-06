function Fallback({image, title, description, action}) {
    return (
        <div className="flex flex-col items-center justify-center p-8">
            {image && <img src={image} alt="" className="w-1/2"/>}
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-gray-500 text-center mt-2">{description}</p>
            <div className="mt-4">
                {action && action}
            </div>
        </div>
    )
}

export default Fallback
