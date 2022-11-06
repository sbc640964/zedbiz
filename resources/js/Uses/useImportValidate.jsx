import collect from "collect.js";
import {useEffect, useState} from "react";
import Validator from "@/validator";
import _ from "lodash";

export default function useImportValidate(rows, collection) {

    const [loader, setLoader] = useState(false);
    const [mapping, setMapping] = useState({});
    const [defaults, setDefaults] = useState({});
    const [errors, setErrors] = useState(0);
    const [jsErrors, setJsErrors] = useState({});
    const [success, setSuccess] = useState(0);
    const [counterChunk, setCounterChunk] = useState(null);
    const [chunks, setChunks] = useState(null);
    const [isValidated, setIsValidated] = useState(false);
    const [isImported, setIsImported] = useState(false);

    const [importedRecords, setImportedRecords] = useState({
        insert: [],
        update: [],
        failed: [],
        unChanged: [],
    });

    const [merged, setMerged] = useState({
        enabled: false,
        columns: [
            'id'
        ],
    });

    const [isImportStarted, setIsImportStarted] = useState(null);

    useEffect(() => {
        if(chunks === null && counterChunk !== null){
            setCounterChunk(null);
            setLoader(false);
        }
        if(chunks !== null && chunks.count() > 0){
            setCounterChunk(0);
        }
    }, [chunks]);

    useEffect(() => {
        if(isImportStarted !== null){
            !loader && setLoader(true);
            const data = prepareChunks(true);
            importData(data.get(isImportStarted)).then((res) => {
                if(merged.enabled){
                    setImportedRecords(previousStats => ({
                        ...previousStats,
                        insert: previousStats.insert.concat(...Object.values(res.insert)),
                        update: previousStats.update.concat(...Object.values(res.update)),
                        failed: previousStats.failed.concat(...Object.values(res.failed)),
                        unChanged: previousStats.unChanged.concat(...Object.values(res.unChanged)),
                    }));
                }

                if( (isImportStarted) < (data.count() - 1) ){
                    setIsImportStarted(isImportStarted + 1);
                }else{
                    setIsImported(true);
                    setIsImportStarted(null);
                    setLoader(false);
                }
            });
        }
    }, [isImportStarted]);

    useEffect(() => {

        const controller = new AbortController();

        if(counterChunk !== null && chunks !== null){
            validateChunk(chunks.get(counterChunk), controller).then(() => {
                if(counterChunk + 1 < chunks.count()){
                    setCounterChunk(counterChunk + 1);
                }else{
                    rows.length - Object.keys(errors).length > 0 && setIsValidated(true);
                    setSuccess(rows.length - Object.keys(errors).length);
                    setChunks(null);
                }
            });
        }

        return () => controller.abort();

    }, [counterChunk]);

    useEffect(() => {
        setIsValidated(false);
    }, [mapping, defaults]);

    const prepareChunks = (filterErrors = true) => collect(rows)
        .when(filterErrors, col => col.filter((row, index) => !errors[index] && !jsErrors[index]))
        .mapWithKeys((row, key) => {
            const data = {};
            Object.keys(mapping).forEach(key => {
                if(key && mapping[key]){
                    data[mapping[key]] = row[key] ?? null;
                }
            });
            return [key + '', data];
        })
        .chunk(1000);

    function validate()
    {
        setLoader(true);
        setSuccess(0);
        setErrors(0);

        setChunks(prepareChunks());
    }

    async function validateChunk(chunk, controller) {
        const response = await axios.post(route('import.validate', collection.id), {rows: chunk}, {signal: controller.signal});
        if(response.data?.errors){
            setErrors({...(errors ?? {}), ...collect(response.data.errors).undot().all()?.rows});
        }
    }

    function getProcessingStatus(){
        if(chunks === null){
            return null;
        }
        return 'Validating ' + (counterChunk * 1000)  + ' of ' + rows.length;
    }

    async function importData(rows)
    {
        return await axios.post(route('import.store', collection.id), {rows, merge: merged.enabled ? merged.columns : false}).then(response => {
            return response.data;
        });
    }

    function clearImportedRecords(){

        let newState = {};
        Object.keys(importedRecords).forEach(key => {
            newState[key] = [];
        });

        setImportedRecords(newState);

        return true;
    }

    function downloadReport()
    {
        //TODO: download report
    }

    function jsValidate(rules, messages)
    {
        setLoader(true);

        let jsNewErrors = collect({});

        collect({...rows}).chunk(500).each((chunk, index) => {
            const validator = new Validator().make(chunk.all(), rules, messages, true, collect(mapping).mapWithKeys((value, key) => [value, key]).all());
            if (validator.fails()) {
                jsNewErrors = jsNewErrors.merge(collect(validator.errors).undot().all());
            }
        });
        setJsErrors(jsNewErrors.all());

        setLoader(false);
    }

    function mergeErrors(errorsToMerge)
    {
        errorsToMerge.entries(function (key, value) {
            if(errors[key]){
                value.entries(function (innerKey, innerValue) {
                    errors[key][innerKey] = innerValue;
                });
            }else{
                errors[key] = value;
            }
        });
        setErrors({...errors});
    }

    function getColumnErrors(row, column)
    {
        const $return = errors[row]?.[column] ?? null;

        const jsError = jsErrors[row]?.[column] ?? null;

        return Object.values(_.merge($return, jsError));
    }

    return {
        validate,
        jsValidate,
        errors: {
            count: collect(errors).keys().merge([...collect(jsErrors).keys()]).unique().count(),
            hasErrors: Object.keys(errors).length > 0 || Object.keys(jsErrors).length > 0,
            hasErrorRow: row => errors[row] !== undefined || jsErrors[row] !== undefined,
            hasErrorColumn: (row, column) => errors?.[row]?.[column] !== undefined || jsErrors?.[row]?.[column] !== undefined,
            getColumnError: getColumnErrors,
            getRowErrors: row => errors?.[row],
            mergeErrors,
        },
        success,
        loader,
        isValidated,
        processingStatus: getProcessingStatus(counterChunk, chunks),
        mapping,
        setMapping,
        merged: {
            enabled: merged.enabled,
            columns: merged.columns,
            setEnabled: enabled => setMerged({...merged, enabled}),
            setColumns: columns => setMerged({...merged, columns}),
        },
        import: () => clearImportedRecords() && setIsImportStarted(0),
        defaults: {
            set: (key, value) => setDefaults(d => ({...d, [key]: value})),
            get: name => defaults?.[name] ?? null,
        },
        importedRecordsReport: {
            isImported,
            ...importedRecords,
            clear: clearImportedRecords,
            download: downloadReport,
            total: {
                insert: importedRecords.insert.length,
                update: importedRecords.update.length,
                failed: importedRecords.failed.length,
                unChanged: importedRecords.unChanged.length,
            }
        }
    }
}

