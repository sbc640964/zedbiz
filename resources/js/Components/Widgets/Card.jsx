import {twMerge} from "tailwind-merge";
import Button from "@/Components/Button";
import SettingsWidgetButton from "@/Components/Admin/SettingsWidgetButton";

function Card({ children, className, ...props }) {
    return (
        <div className={className}>
            <div className={`bg-white rounded-lg shadow h-full flex flex-col ${props?.classNameCard ?? ''}`} {...props}>
                {props?.loading ? '...' : children}
            </div>
        </div>
    )
}

Card.Header = function ({ children, className, action, show= true, settingsBtn, ...props }) {
    if (!show) return null;
    return (
        <div className={twMerge('py-3 px-4 border-b flex justify-between items-center', className)} {...props}>
            <span className="font-bold">{children}</span>
            <div className="flex items-center space-x-1 rtl:space-x-reverse">
                {action &&
                    <Button
                        negative
                        {...action}
                    />
                }
                {settingsBtn &&
                    <>
                        <SettingsWidgetButton onClick={settingsBtn} paths={props?.paths ?? []}/>
                    </>
                }
            </div>
        </div>
    )
}

Card.Body = function ({ children, className, ...props }) {
    return (
        <div className={twMerge('p-4 px-6 flex-grow' ,className)} {...props}>
            {children}
        </div>
    )
}

Card.Footer = function ({ children, className, show = true, ...props }) {
    if (!show) return null;
    return (
        <div className={`py-4 px-6 border-t ${className}`} {...props}>
            {children}
        </div>
    )
}

export default Card
