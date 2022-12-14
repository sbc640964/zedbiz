import Widgets from "@/Components/Widgets/index";
import {useEffect, useState} from "react";
import {collect} from "collect.js";
import {get, set} from "lodash";

function RenderWidget({widget, setModalContent}) {

    const [widgetData, setWidgetData] = useState(null);

    if (!widget) {
        return null;
    }

    function parserToken(str) {

        if(!str || typeof str !== 'string') {
            return str;
        }

        return str.replace(/\{\{(.*)\}\}/g, (match, p1) => {
            let [token, ...funcs] = p1.split('|');

            let isCalc = token.includes('*') || token.includes('+') || token.includes('-') || token.includes('/');

            token = token.includes(' ') ? token.split(' ') : [token];

            token = token.map(v => {
                if(v.includes('.')){
                    const [t, defaultValue] = v.split(':', 2);
                    return getTokenValue(t, defaultValue ?? null);
                }
                if(isNaN(v) && v !== '-' && v !== '+' && v !== '*' && v !== '/'){
                    isCalc = false;
                }
                return v;
            }).join(' ');

            if(isCalc){
                token = Function(`return ${token}`)();
            }

            if (funcs.length) {
                funcs.forEach(func => {
                    const [name, ...args] = func.split(':');
                    token = Function(`return ${name}(${args.map(v => `'${v}'`).join(',')})`)(token);
                });
            }

            return token;
        });
    }

    function getTokenValue(token, defaultValue = null) {
        const data = {
            self: widget.self,
        };
        return get(data, token, defaultValue);
    }

    function renderWidgetData() {
        let props = {...collect(widget).filter((value, key) => !['keysToParser', 'self'].includes(key)).all()};
        const keysToParser = collect(widget.keysToParser);
        if(keysToParser.count() > 0) {
            keysToParser.each(key => {
                set(props, key, parserToken(get(props, key)));
            })
        }

        return props;
    }

    useEffect(() => {
        setWidgetData(renderWidgetData());
    }, [widget]);

    const Component = Widgets[widget.type];

    if(!Component) {
        return null;
    }

    // console.log(widgetData);

    function getClasses() {
       return {
           '1/1': 'p-3 w-full',
           '1/2': 'p-3 w-full lg:w-1/2',
           '1/3': 'p-3 w-full lg:w-1/3',
           '1/4': 'p-3 w-full lg:w-1/4',
           '3/4': 'p-3 w-full lg:w-3/4',
           '2/3': 'p-3 w-full lg:w-2/3',
       }[widget.width] ?? 'p-3 w-full';
    }

    return (
        <Component
            loading={!widgetData}
            {...widgetData}
            setModal={typeof setModalContent === 'function' ? setModalContent : null}
            className={getClasses()}
        />
    )
}

export default RenderWidget
