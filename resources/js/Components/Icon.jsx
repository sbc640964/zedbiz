import * as OutlinesIcons from "@heroicons/react/24/outline";
import * as SolidIcons from "@heroicons/react/24/solid";
import * as MiniIcons from "@heroicons/react/20/solid";
import React from "react";

function Icon({name = '', type, className}) {
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
