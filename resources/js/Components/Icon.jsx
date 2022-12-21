import * as OutlinesIcons from "@heroicons/react/24/outline";
import * as SolidIcons from "@heroicons/react/24/solid";
import * as MiniIcons from "@heroicons/react/20/solid";
import React from "react";

/**
 * @param {string} [name=bookmark] - The name of the icon to render.
 * @param {string} [type=outline] - The type of icon to render.
 * @param {string} className - The class name to apply to the icon.
 * @returns {JSX.Element} - The icon component.
 * @constructor
 */
function Icon({name = '', type = 'outline', className = ''}) {

    if(typeof name === "function") {
        return name;
    }

    name = name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).replaceAll(' ', '');
    if(!name.endsWith('Icon')){
        name += 'Icon';
    }

    const icons = {
        solid: SolidIcons,
        outline: OutlinesIcons,
        mini: MiniIcons,
    }[type] ?? OutlinesIcons;

    const Component = icons?.[name] ?? (type === 'solid' ? OutlinesIcons : SolidIcons )['BookmarkIcon'];

    return <Component className={className}/>;
}

export default Icon
