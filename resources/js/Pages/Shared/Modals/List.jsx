import EmptyModal from "@/Components/Dialogs/EmptyModal";
import ListComponent from "@/Pages/Admin/Apps/List";
import {useEffect, useState} from "react";
import collect from "collect.js";

function List({open, setOpen, id, ...initialProps}) {

    function getActiveUrl() {
        return collect(initialProps.records.links).firstWhere('active', true)?.url;
    }

    const [currentUrl, setCurrentUrl] = useState(getActiveUrl());
    const [props, setProps] = useState(initialProps);
    const [booted, setBooted] = useState(false);
    const [widthLoading, setWidthLoading] = useState(0);

    useEffect(() => {
        booted && refreshList();
    }, [initialProps?.render]);

    const refreshList = () => setUrl({timestamp: Date.now()});

    useEffect(() => {
        if(booted){
            setWidthLoading(1);
        }
    }, [currentUrl]);

    useEffect(() => {
        if(booted && currentUrl) {
            const source = axios.CancelToken.source();
            axios.get(currentUrl, {cancelToken: source.token}).then(response => {
                setProps(response.data);
                setWidthLoading(100);
            });
            return () => source.cancel();
        }
        setBooted(true);
    }, [currentUrl]);

    useEffect(() => {
        let timer;
        if(widthLoading === 100){
            timer = setTimeout(() => {
                setWidthLoading(0);
            }, 200);
        } else if(widthLoading > 0 && widthLoading < 90){
            timer = setTimeout(() => {
                setWidthLoading(v => v + 10);
            }, 50);
        }

        return () => timer && clearTimeout(timer);
    }, [widthLoading]);

    function setUrl(url) {
        if(typeof url === 'object'){
            url = '/' + props.ajaxUrl + '?' + collect({...props.queryParameters, ...url, isModal: id}).filter().map((value, key) => key + '=' + value).join('&');
        }

        //add parameter 'isModal' to url if not exists
        else if(!url.includes('isModal=')){
            url += (url.includes('?') ? '&' : '?') + 'isModal=' + id;
        }


        setCurrentUrl(url);
    }

    setUrl.url = props?.ajaxUrl;

    return (
        <EmptyModal
            open={open}
            setOpen={setOpen}
            maxWidth={props?.width}
        >
            <div className="bg-gray-100">
                {widthLoading > 0 && <span className="absolute top-0 left-0 w-full transition-all ease-in-out h-1 bg-primary-400" style={{width: widthLoading + '%'}}/>}
                <ListComponent {...props} ajax={setUrl} refreshList={refreshList}/>
            </div>
        </EmptyModal>
    );
}

export default List
