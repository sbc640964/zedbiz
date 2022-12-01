import CodeEditor from "@/Components/Form/CodeEditor";
import {forwardRef, useEffect, useRef} from "react";


function SqlEditor({handleChange, value, tables = [], ...props}, ref) {

    // const refEditor = useRef(null);

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
        <CodeEditor
            ref={ref}
            value={value}
            language={'mysql'}
            handleChange={handleChange}
            {...props}
        />
    )
}

export default forwardRef(SqlEditor);
