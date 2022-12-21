import CodeEditor from "@/Components/Form/CodeEditor";
import {useEffect, useRef, useState} from "react";
import InputError from "@/Components/Form/InputError";
import Tree from "@/Components/Tree";
import {collect} from "collect.js";
import {Parser} from "lite-ui-sql-parser";


function SqlEditor({handleChange, value, tables = [], error, ...props}) {

    const refEditor = useRef(null);
    const [sqlError, setSqlError] = useState(null);

    useEffect(() => {
        let test = null;
        try{
            test = new Parser().parse(value?.trim() ?? '');
        } catch (e) {
            return setSqlError(e);
        }
        if(test) setSqlError(null);
    }, [value]);

    const queryTablesColumns = useRef(tables.map(c => ({
        id: c.table_name,
        label: c.name,
        children: collect(c.columns).map(col => ({
            id: `${c.table_name}.${col.name}`,
            label: col.label ?? col.name,
            type: col.type,
            table: c.table_name,
        }))
            .prepend({
                id: `${c.table_name}.id`,
                label: 'ID',
                type: 'integer',
                table: c.table_name,
            })
            .merge(
                collect({
                    created_at: 'Created at',
                    updated_at: 'Updated at'
                })
                    .map((value, key) => ({
                        id: `${c.table_name}.${key}`,
                        label: value,
                        table: c.table_name,
                    }))
                    .values()
                    .all()
            ).all()
    })));


    // useEffect(() => {
    //     if (refEditor.current){
    //         refEditor.current.editor.completers = [
    //             ...refEditor.current.editor.completers,
    //             {
    //                 getCompletions: (editor, session, pos, prefix, callback) => {
    //                     // if(tables.map(table => table.value + '.').includes(prefix)) {
    //                     //     return callback(null, tables.find(table => table.value === prefix).columns.map(column => {
    //                     //         return {
    //                     //             name: column.label,
    //                     //             value: column.name,
    //                     //             score: 1000,
    //                     //             meta: 'column'
    //                     //         }
    //                     //     }));
    //                     // }
    //                     callback(null, tables.map(table => {
    //                         return {
    //                             caption: table?.caption,
    //                             name: table?.name,
    //                             score: table?.score,
    //                             value: table?.value,
    //                             meta: table?.meta
    //                         }
    //                     }));
    //                 }
    //             }
    //         ];
    //     }
    // }, []);

    return (
        <>
            <div className="flex border rounded-md overflow-hidden">
                <div className="w-4/5 border-r rtl:border-r-0 rtl:border-l">
                    <CodeEditor
                        ref={refEditor}
                        value={value}
                        language={'mysql'}
                        handleChange={handleChange}
                        {...props}
                    />
                    <InputError message={error}/>
                </div>
                <div className="w-1/5 p-4 overflow-y-auto scrollbar" style={{maxHeight: props?.height ?? '300'}}>
                    <Tree
                        style={{fontSize: `${props?.fontSize ? props.fontSize - 2 : 12}px`}}
                        items={queryTablesColumns.current}
                        onClick={item => {
                            if (item.id) {
                                const cursorPosition = refEditor.current.editor.selection.getCursor();
                                refEditor.current.editor.session.insert(cursorPosition, item.id);
                                refEditor.current.editor.focus();
                            }
                        }}
                    >
                        {(item, isOpened, style) => (
                            <div className="flex items-center hover:bg-gray-100 cursor-pointer w-full rounded-lg" style={style}>
                                <span className={`${isOpened ? 'bold py-0.5' : 'text-gray-600 py-1'} px-2`}>
                                    {item.label}
                                </span>
                            </div>
                        )}
                    </Tree>
                </div>
            </div>
            {sqlError &&
                <div className="pt-4">
                    <div className="bg-red-50 p-2 rounded-lg border border-red-700 text-red-700">
                        <div className="text-xs"><span className="font-bold">SQL {sqlError.name}</span> on line {sqlError.location?.start?.line}</div>
                        <p className="text-xs"></p>
                    </div>
                </div>
            }
        </>
    )
}

export default SqlEditor;
