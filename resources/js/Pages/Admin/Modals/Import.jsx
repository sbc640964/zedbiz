import {useEffect, useRef, useState, useTransition} from "react";
import EmptyModal from "@/Components/Dialogs/EmptyModal";
import FileInput from "@/Components/Form/FileInput";
import {read, utils} from "xlsx";
import Table from "@/Components/Table/Table";
import HeadColumn from "@/Components/Table/HeadColumn";
import RowHeader from "@/Components/Table/RowHeader";
import Row from "@/Components/Table/Row";
import collect from "collect.js";
import {FixedSizeList} from "react-window";
import Column from "@/Components/Table/Column";
import Select from "@/Components/Form/Select";
import Button from "@/Components/Button";
import useImportValidate from "@/Uses/useImportValidate";
import Tooltip from "@/Components/Dialogs/Tooltip";
import Icon from "@/Components/Icon";
import SectionCard from "@/Components/Card/SectionCard";
import FieldRow from "@/Components/Form/FieldRow";
import Switcher from "@/Components/Form/Switcher";
import ComposerField from "@/Pages/Shared/ComposerField";
import {Inertia} from "@inertiajs/inertia";
import {prepareRulesValidation} from "@/helpers";

function Import({onClose, ...props}) {
    const [keyComponent, setKeyComponent] = useState(0);

    function reset() {
        setKeyComponent(keyComponent + 1);
    }

    return <Init key={keyComponent} {...props} onClose={() => {
        reset();
        typeof onClose === 'function' && onClose();
    }}/>
}

function Init({collection, app, open, onClose}) {

    const [openModal, setOpenModal] = useState(false);
    const [file, setFile] = useState(null);
    const [rows, setRows] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);
    const [loader, setLoader] = useState(false);

    const importer = useImportValidate(rows, collection);

    useEffect(() => {
        setOpenModal(open);
    }, [open]);

    useEffect(() => {
        if (file) {
            setLoader(true);
            switch (file.type) {
                case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                case 'text/csv':
                    importExcel(file);
                    break;
                case 'text/csve':
                    importCSV(file);
                    break;
                default:
                    alert('Invalid file type');
            }
        }
    }, [file]);

    function importExcel(file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = e.target.result;
            const workbook = read(data, {type: 'binary'});
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const dataExcel = utils.sheet_to_json(worksheet);
            if(dataExcel.length > 0){
                setRows(dataExcel);
                setCurrentStep(2);
                setLoader(false);
            }
        };
        reader.readAsArrayBuffer(file);
    }

    function importCSV(file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = e.target.result;
            const rows = Papa.parse(data, {header: true});
            setRows(rows.data);
            setCurrentStep(2);
            setLoader(false);
        };
        reader.readAsText(file);
    }

    function resetAndClose() {
        setCurrentStep(1);
        setRows([]);
        setFile(null);
        typeof onClose === 'function' && onClose();
    }

    return (
        <EmptyModal
            open={openModal}
            setOpen={setOpenModal}
            onClose={() => resetAndClose()}
            title={`Import ${collection?.settings?.plural_label ?? collection?.name ?? 'Records'}`}
            maxWidth="6xl"
        >
            {({close}) => (
                <div className="p-4">
                    { currentStep === 1 && (
                        <div className="flex flex-col relative">
                            {loader && (
                                <div className="flex justify-center items-center absolute inset-0 w-full h-full bg-white/50">
                                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                                </div>
                            )}
                            <label className="block text-sm font-medium text-gray-700">
                                Import File
                                <FileInput className="p-4" value={file} handleChange={(e) => setFile(e.target.files[0])} allowTypes={[
                                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                    'text/csv'
                                ]}/>
                            </label>
                        </div>
                    )}
                    { currentStep === 2 && <MappingColumns collection={collection} rows={rows} importer={importer} nextStep={() => setCurrentStep(3)}/> }
                    { currentStep === 3 && <Importing collection={collection} rows={rows} importer={importer} close={close}/>}
                </div>
            )}
        </EmptyModal>
    )
}

export default Import

function MappingColumns({rows, collection, importer, nextStep}) {

    const [columnsFile, setColumnsFile] = useState([]);
    const refHeader = useRef(null);
    const refBox = useRef(null);

    const {mapping, setMapping, errors, defaults} = importer;

    const [isPendingValidator, startValidator] = useTransition();

    useEffect(() => {

        const timer = setTimeout(() => {

            const requires  = collect(columns)
                .filter(column => column.required && Object.values(mapping).includes(column.name) === false)
                .mapWithKeys(column => [column.name, column.label])
                .all();

            if(Object.keys(requires).length === 0){
                const columnsMap = collection.columns.map(column => {
                    if(mapping[column.name]){
                        column['mapping'] = mapping[column.name];
                    }
                    return column;
                });

                const rules = prepareRulesValidation(columnsMap);

                importer.jsValidate(rules);
            }

        }, 1000);

        return () => clearTimeout(timer);

    }, [mapping]);

    useEffect(() => {
        let max = [];
        collect(rows).each(row => {
            if (Object.keys(row).length > max.length) {
                max = Object.keys(row);
            }
        });
        setColumnsFile(max);
    }, [rows]);

    useEffect(() => {
        function handler () {
            refHeader.current.scrollLeft = refBox.current.scrollLeft;
        }

        if (refBox.current) {
            refBox.current.addEventListener('scroll', handler);
        }

        return () => {
            refBox.current?.removeEventListener?.('scroll', handler);
        }
    });

    const columns = collection?.columns;

    if(columnsFile.length === 0){
        return null;
    }

    return (
        <div>
            <div>
                {isPendingValidator && <div>Validating...</div>}
            </div>
            <Table>
                <div className="overflow-x-hidden border-b" ref={refHeader}>
                    <RowHeader>
                        {columnsFile.map((column, index) => (
                            <HeadColumn key={index} width={200}>{column}</HeadColumn>
                        ))}
                    </RowHeader>
                    <Row className="border-b-0">
                        {columnsFile.map((column, index) => (
                            <Column key={index} width={200} isJustifyBetween>
                                <div className="p-0.5">
                                    <Select
                                        className="w-full"
                                        options={([...columns, {name: 'id', label: 'ID'}]).map(column => ({value: column.name, label: column.label})).filter(item => Object.values(mapping).includes(item.value) === false || item.value === mapping?.[column])}
                                        value={mapping?.[column] ?? null}
                                        isClearable
                                        handleChange={(e) => setMapping({...mapping, [column]: e?.value})}
                                        size={'xs'}
                                    />
                                </div>
                            </Column>
                        ))}
                    </Row>
                    <Row className="">
                        {columnsFile.map((column, index) => (
                            mapping?.[column] && mapping?.[column] !== 'id' ? (
                            <Column key={index} width={200} isJustifyBetween>
                                <div className="p-0.5">
                                    <ComposerField
                                        handleChange={e => defaults.set(mapping?.[column], e?.target?.value ?? e?.value ?? e)}
                                        value={defaults.get(mapping?.[column]) ?? ''}
                                        fieldSettings={columns.find(item => item.name === mapping?.[column])}
                                        form={collection}
                                        options={{
                                            hiddenLabel: true,
                                            size: 'xs',
                                        }}
                                    />
                                </div>
                            </Column>
                            ) : <Column key={index} width={200} isJustifyBetween/>
                        ))}
                    </Row>
                </div>
                <FixedSizeList
                    outerRef={refBox}
                    height={600}
                    itemSize={35}
                    itemCount={rows.length}
                    className="scrollbar overflow-x-auto"
                >
                    {({index, style}) => (
                        <Row key={index} style={{...style, width: columnsFile.length * 200 + 'px'}} className={`w-full ${errors.hasErrorRow(index) ? 'bg-red-50' : ''}`}>
                            {columnsFile.map((column, key) => (
                                <Column key={key} width={200} className={`${errors.hasErrorColumn(index, mapping[column]) ? 'bg-red-100' : ''}`}>
                                    {rows[index][column]}
                                    {errors.hasErrorColumn(index, mapping[column]) && (
                                        <span className="text-xs text-red-800">
                                            {errors.getColumnError(index, mapping[column])}
                                        </span>
                                    )}
                                </Column>
                            ))}
                        </Row>
                    )}
                </FixedSizeList>
            </Table>

            <div className="mt-4 flex justify-end">
                <Validate columns={columns} rows={rows} mapping={mapping} collection={collection} {...importer} nextStep={nextStep}/>
            </div>
        </div>
    )
}

function Validate({mapping, columns, validateStates, errors, success, loader, validate:serverValidate, isValidated, nextStep, collection}) {

    const [requiredAlerts, setRequiredAlerts] = useState({});

    useEffect(() => {
        const requires  = collect(columns)
            .filter(column => column.required && Object.values(mapping).includes(column.name) === false)
            .mapWithKeys(column => [column.name, column.label])
            .all();
        setRequiredAlerts(requires);
    }, [mapping]);

    return(
        <div className="flex space-x-4 rtl:space-x-reverse items-center">
            { ( errors.hasErrors || success > 0 ) && (
                <Button
                    color="danger"
                    negative
                    className="normal-case font-normal"
                    tooltip="Click to show errors"
                >
                    {errors.count} Errors
                </Button>
            )}
            {Object.keys(requiredAlerts).length > 0 &&
                //alert
                <Tooltip
                    content={<div className="flex flex-col">
                        {Object.keys(requiredAlerts).map((key, index) => (
                            <div key={index} className="whitespace-nowrap">
                                <span className="font-bold">{requiredAlerts[key]}</span> is required
                            </div>
                        ))}
                    </div>}
                >
                    <span><Icon name="exclamation-circle" className="text-red-500 w-6 h-6"/></span>
                </Tooltip>
            }
            <Button
                disabled={Object.keys(requiredAlerts).length > 0}
                loadingAtProcessing
                processing={loader}
                action={isValidated ? nextStep : serverValidate}
            >
                {isValidated ? 'Import' : 'Validate'}
            </Button>
        </div>
    )
}

function Importing({rows, collection, importer, close}){

    const {loader, success, errors, merged, import:submitImport, importedRecordsReport } = importer;

    const { insert, update, failed, unChanged } = importedRecordsReport.total;

    function closeAndRenderPage(){
        close();
        Inertia.reload();
    }

    return(
        <div>
            <div className="flex">
                <div className="w-full p-2">
                    <div className="flex flex-col items-center justify-center p-6 shadow-lg">
                        <div className="flex items-center space-x-2">
                            <span>Records ready for import</span>
                        </div>
                        <span className="text-green-500 font-light text-6xl mt-4">{success - failed}</span>
                        <div className="flex space-x-6 rtl:space-x-reverse divide-x rtl:divide-x-reverse mt-2 border-t w-full pt-4">
                            <span className="flex flex-col justify-center items-center w-full">
                                <span className="text-gray-500 font-light text-sm">Update</span>
                                <span className="text-green-500 text-lg">{update}</span>
                            </span>
                            <span className="flex flex-col justify-center items-center w-full">
                                <span className="text-gray-500 font-light text-sm">New</span>
                                <span className="text-green-500 text-lg">{insert}</span>
                            </span>
                            <span className="flex flex-col justify-center items-center w-full">
                                <span className="text-gray-500 font-light text-sm">No Changed</span>
                                <span className="text-green-500 text-lg">{unChanged}</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-full p-2">
                    <div className="flex flex-col items-center justify-center p-6 shadow-lg">
                        <div className="flex items-center space-x-2">
                            <span>Failed (Skipped)</span>
                        </div>
                        <span className="text-red-500 font-light text-6xl mt-4">{errors.count + failed}</span>
                        <div className="flex space-x-6 rtl:space-x-reverse divide-x rtl:divide-x-reverse mt-2 border-t w-full pt-4">
                            <span className="flex flex-col justify-center items-center w-full">
                                <span className="text-gray-500 font-light text-sm">Failed on validate</span>
                                <span className="text-red-500 text-lg">{errors.count}</span>
                            </span>
                            <span className="flex flex-col justify-center items-center w-full">
                                <span className="text-gray-500 font-light text-sm">Failed on inserted</span>
                                <span className="text-red-500 text-lg">{failed}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <SectionCard label="Overrun settings" className="mt-4">
                    <FieldRow label="Merging records">
                        <Switcher
                            value={merged.enabled ?? false}
                            handleChange={(e) => importer.merged.setEnabled(e.target.value)}
                        />
                    </FieldRow>
                    <FieldRow label="Merging records by" show={merged.enabled}>
                        <Select
                            options={[...collection.columns.filter(v => v?.unique).map(column => ({value: column.name, label: column.label})), {value: 'id', label: 'ID'}]}
                            value={merged.columns ?? []}
                            isMulti
                            isClearable
                            handleChange={(e) => merged.setColumns(e)}
                        />
                    </FieldRow>
                </SectionCard>
            </div>

            <div className="mt-12">
                {
                    importedRecordsReport.isImported
                        ? <>
                            <div className="flex items-center justify-between">
                                <Button
                                    color="success"
                                    action={() => importer.importedRecordsReport.download()}
                                >
                                    Download report (Excel)
                                </Button>
                                <Button
                                    color="secondary"
                                    action={() => closeAndRenderPage()}
                                >
                                    Close
                                </Button>
                            </div>
                        </>
                        : <Button
                            action={submitImport}
                            loadingAtProcessing
                            processing={importer.loader}
                            disabled={importer.loader}
                        >
                            Import
                        </Button>
                }
            </div>
        </div>
    )
}
