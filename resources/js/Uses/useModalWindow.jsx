import React, {memo, useCallback, useEffect, useState} from "react";
import {usePage} from "@inertiajs/inertia-react";
import collect from "collect.js";
import {resolvePageComponent} from "laravel-vite-plugin/inertia-helpers";
import {set} from "lodash/fp";

function useModalWindow() {

    const {modal, app} = usePage().props;
    const {component} = usePage();
    const [modalsOpens, setModalsOpens] = useState({});
    const [modals, setModals] = useState([]);

    function addModal(modal) {
        setModals([...modals, modal]);
    }

    function removeModal(modal) {
        setModalsOpens({
            ...modalsOpens,
            [modal.id]: false,
        });
    }

    useEffect(() => {
        if(modal) {
            addModal(modal);
        }
    }, [modal]);

    useEffect(() => {
        if(modals.length) {
            setModalsOpens(collect(modals).mapWithKeys((modal) => [modal.id, true]).all());
        }
    }, [modals]);

    useEffect(() => {
        collect(modalsOpens).each((open, id) => {
            if(!open) {
                modals.find((modal) => modal.id === id)?.updateModalsOnClose?.();
                setModals(modals.filter((modal) => modal.id !== id));
            }
        });
    }, [modalsOpens]);

    const ModalsBar = useCallback( () => (
        <>
            {modals.map((modal) => (
                <Modal
                    key={modal.id}
                    open={modalsOpens[modal.id]}
                    setOpen={() => removeModal(modal)}
                    modal={modal}
                    component={component}
                    app={app}
                />
            ))}
        </>
    ), [modals, modalsOpens]);

    function updateModalsOnClose(id) {
        const index = modals.findIndex((modal) => modal.id === id);
        if(index > 0) {
            console.log('updateModalsOnClose', modals[index - 1].id);
            modals[index - 1].render = (modals[index - 1]?.render ?? 0) + 1
            console.log(modals)
            setModals([...modals]);
        }
    }

    return {
        ModalsBar,
        addModal,
        removeModal,
        modals: modals.map((modal) => ({
            modal: modal,
            component: component,
            app: app,
            open: modalsOpens[modal.id],
            setOpen: () => removeModal(modal),
            onClose: () => updateModalsOnClose(modal.id),
        })),
        Modal
    }
}

function Modal({open, setOpen, modal, onClose, ...props}) {
    const [ModalComponent, setModalComponent] = useState();
    const [id, setId] = useState();

    useEffect(() => {
        async function loadComponent() {
            const component = await resolvePageComponent(`../Pages/Shared/${modal.component}.jsx`, import.meta.glob('../Pages/**/*.jsx'));
            setModalComponent(component);
        }

        if(modal?.id) {
            setId(modal.id);
            loadComponent();
        }
    }, []);

    if(typeof ModalComponent?.default !== 'function') {
        return null;
    }

    return (
        <ModalComponent.default
            open={open}
            setOpen={setOpen}
            {...modal}
            onClose={onClose}
            app={props?.component?.startsWith('Admin/') ? props?.app : {id: 0}}
        />
    );
}

export default useModalWindow
