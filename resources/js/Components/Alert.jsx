import {ExclamationTriangleIcon} from "@heroicons/react/24/outline";

export default function Alert({children, className, type, show}) {
    if (!show) {
        return null;
    }

    let icon, color, bgColor;

    switch (type) {
        case 'error':
            icon = <ExclamationTriangleIcon className="h-5 w-5 text-red-600"/>;
            color = 'text-red-800';
            bgColor = 'bg-red-50';
            break;
        case 'warning':
            icon = <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600"/>;
            color = 'text-yellow-800';
            bgColor = 'bg-yellow-50';
            break;
        case 'success':
            icon = <ExclamationTriangleIcon className="h-5 w-5 text-green-600"/>;
            color = 'text-green-800';
            bgColor = 'bg-green-50';
            break;
        case 'info':
            icon = <ExclamationTriangleIcon className="h-5 w-5 text-blue-600"/>;
            color = 'text-blue-800';
            bgColor = 'bg-blue-50';
            break;
        default:
            icon = <ExclamationTriangleIcon className="h-5 w-5 text-gray-600"/>;
            color = 'text-gray-800';
            bgColor = 'bg-gray-50';
            break;
    }

    return <div className={`${className} ${color} ${bgColor} p-2 rounded-xl shadow-lg mb-10`}>
        <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-4">
                <span>{icon}</span>
                <div>
                    {children}
                </div>
            </div>
        </div>
    </div>;
}
