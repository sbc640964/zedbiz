import AceEditor from "react-ace";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-min-noconflict/mode-mysql";
import "ace-builds/src-noconflict/theme-chrome";
import {forwardRef} from "react";

function CodeEditor({handleChange, value, ...props}, refEditor) {

    return (
        <AceEditor
            ref={refEditor}
            mode="mysql"
            theme="chrome"
            name="raw_query"
            width={'100%'}
            className="min-h-96"
            fontSize={20}
            showPrintMargin={true}
            placeholder="Write your Query here..."
            showGutter={true}
            editorProps={{
                $blockScrolling: true,
            }}
            highlightActiveLine={true}
            value={value}
            onChange={handleChange}
            setOptions={{
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2,
            }}
            {...props}
        />
    )
}

export default forwardRef(CodeEditor);
