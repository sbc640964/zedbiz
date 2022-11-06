import FieldRow from "@/Components/Form/FieldRow";
import {createElement, Children, useEffect, useState} from "react";
import {Inertia} from "@inertiajs/inertia";
import {collect} from "collect.js";
import InputError from "@/Components/Form/InputError";

function RealFieldRow({value:initialValue, urlUpdate, name, label, type, error, app, children, ...props}) {

    Children.only(children);

    const [value, setValue] = useState(initialValue);
    const [loading, setLoading] = useState(false);
    const [inputError, setError] = useState(error);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        setError(error);
    }, [error]);

    function updateRemote(name, value) {
        return Inertia.put(urlUpdate, collect({[name]: value}).undot().all(), {
            onBefore: () => setLoading(true),
            onSuccess: () => setLoading(false),
            preserveScroll: true,
            preserveState: true,
        });
    }

    function handleBlur() {
        if(value === initialValue) return;
        updateRemote(name, value);
    }

    function handleChange(e) {
        if(inputError) {
            setError(null);
        }
        setValue(e?.target?.value ?? e?.value ?? e);
    }

    return (
        <FieldRow label={label} loading={loading && !inputError} hasError={error} {...props}>
            {createElement(children.type, {
                ...children.props,
                value,
                handleChange,
                onBlur: handleBlur,
                name,
            })}
            {error && <InputError message={error}/>}
        </FieldRow>
    );
}

export default RealFieldRow
