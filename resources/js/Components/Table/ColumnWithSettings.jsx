import Column from "@/Components/Table/Column";
import classNames from "classnames";
import HeadColumn from "@/Components/Table/HeadColumn";
import ActionRow from "@/Components/Admin/ActionRow";
import {useEffect, useState} from "react";

function ColumnWithSettings({head, column, list, record, app, collection, actionProps, ...props}) {

    if(column?.show === false) return null;

    const {
        label,
        name,
        type,
        width,
        actions,
        iconActions,
        align,
    } = column;

    //todo: remove effect on mount - first render
    const [mounted, setMounted] = useState(false);
    const [highlighted, setHighlighted] = useState(false);

    useEffect(() => {
        if (mounted) {
            setHighlighted(true);
        } else {
            setMounted(true);
        }
    }, [record?.[name]]);

    useEffect(() => {
        if(highlighted) {
            const timer = setTimeout(() => {
                setHighlighted(false);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [highlighted]);

    function getAlias(column)
    {
        switch (list.query_mode){
            case 'sql_raw' :
                return column.label;
            default :
                return column?.type === 'raw'
                    ? ( (column.value.split(' AS ')?.[1] ?? column.value).replaceAll('`', '') )
                    : ( column.alias ?? column?.label ?? column.column.value.split('.')?.[1] ?? column.value );
        }
    }

    const classes = classNames([
        {'justify-center': type === 'image' || type === 'boolean' || type === 'icon' || align === 'center'},
        {'justify-end': align === 'right'},
        {'justify-start': align === 'left'},
        {'bg-yellow-100': highlighted && !head},
    ]);

    if(head){
        return (
            <HeadColumn
                width={width}
                isSortable={column.sortable}
                className={classes}
                column={column}
                {...props}
            >
                {getAlias(column)}
            </HeadColumn>
        )
    }

    const TextComponent = actions?.click?.enabled ? ActionRow : 'span';
    return (
        <Column
            width={width ? width : null}
            className={`${classes} transition-all`}
            isJustifyBetween={iconActions?.justify_between}
        >
            <span className={`flex items-center ${iconActions?.justify_between ? 'justify-between' : ''} space-x-2 rtl:space-x-reverse`}>
                <TextComponent className="text-ellipsis overflow-hidden max-w-full" {...(actions?.click?.enabled ? {...actionProps, action: actions.click, type: 'text'} : {})}>
                    {record[name]}
                </TextComponent>
                {iconActions?.enabled && !head && iconActions?.click?.enabled &&
                    <ActionRow
                        {...actionProps}
                        action={{
                            ...iconActions.click,
                            icon: iconActions.click?.icon ?? 'plus-circle',
                            color: iconActions.click?.color ?? 'secondary',
                        }}
                        refreshList={props?.refreshList}
                        type="icon"
                        className="ml-2"
                    />
                }
            </span>
        </Column>
    )
}

export default ColumnWithSettings
