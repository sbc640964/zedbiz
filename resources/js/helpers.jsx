import toast from "react-hot-toast";
import BaseToast from "@/Components/Toasts/BaseToast";
import {collect} from "collect.js";

export function addToast(title, message, type) {
    toast.custom(t => <BaseToast t={t} title={title} message={message} type={type} onClose={() => {}} />);
}

export function isPopstate() {
    return window.history.state === 'popstate';
}

export const currencies = [
    {"label": "Albania Lek", "value": "ALL", "symbol": "Lek"},
    {"label": "Afghanistan Afghani", "value": "AFN", "symbol": "؋"},
    {"label": "Argentina Peso", "value": "ARS", "symbol": "$"},
    {"label": "Aruba Guilder", "value": "AWG", "symbol": "ƒ"},
    {"label": "Australia Dollar", "value": "AUD", "symbol": "$"},
    {"label": "Azerbaijan Manat", "value": "AZN", "symbol": "₼"},
    {"label": "Bahamas Dollar", "value": "BSD", "symbol": "$"},
    {"label": "Barbados Dollar", "value": "BBD", "symbol": "$"},
    {"label": "Belarus Ruble", "value": "BYN", "symbol": "Br"},
    {"label": "Belize Dollar", "value": "BZD", "symbol": "BZ$"},
    {"label": "Bermuda Dollar", "value": "BMD", "symbol": "$"},
    {"label": "Bolivia Bolíviano", "value": "BOB", "symbol": "$b"},
    {"label": "Bosnia and Herzegovina Convertible Mark", "value": "BAM", "symbol": "KM"},
    {"label": "Botswana Pula", "value": "BWP", "symbol": "P"},
    {"label": "Bulgaria Lev", "value": "BGN", "symbol": "лв"},
    {"label": "Brazil Real", "value": "BRL", "symbol": "R$"},
    {"label": "Brunei Darussalam Dollar", "value": "BND", "symbol": "$"},
    {"label": "Cambodia Riel", "value": "KHR", "symbol": "៛"},
    {"label": "Canada Dollar", "value": "CAD", "symbol": "$"},
    {"label": "Cayman Islands Dollar", "value": "KYD", "symbol": "$"},
    {"label": "Chile Peso", "value": "CLP", "symbol": "$"},
    {"label": "China Yuan Renminbi", "value": "CNY", "symbol": "¥"},
    {"label": "Colombia Peso", "value": "COP", "symbol": "$"},
    {"label": "Costa Rica Colon", "value": "CRC", "symbol": "₡"},
    {"label": "Croatia Kuna", "value": "HRK", "symbol": "kn"},
    {"label": "Cuba Peso", "value": "CUP", "symbol": "₱"},
    {"label": "Czech Republic Koruna", "value": "CZK", "symbol": "Kč"},
    {"label": "Denmark Krone", "value": "DKK", "symbol": "kr"},
    {"label": "Dominican Republic Peso", "value": "DOP", "symbol": "RD$"},
    {"label": "East Caribbean Dollar", "value": "XCD", "symbol": "$"},
    {"label": "Egypt Pound", "value": "EGP", "symbol": "£"},
    {"label": "El Salvador Colon", "value": "SVC", "symbol": "$"},
    {"label": "Euro Member Countries", "value": "EUR", "symbol": "€"},
    {"label": "Falkland Islands (Malvinas) Pound", "value": "FKP", "symbol": "£"},
    {"label": "Fiji Dollar", "value": "FJD", "symbol": "$"},
    {"label": "Ghana Cedi", "value": "GHS", "symbol": "¢"},
    {"label": "Gibraltar Pound", "value": "GIP", "symbol": "£"},
    {"label": "Guatemala Quetzal", "value": "GTQ", "symbol": "Q"},
    {"label": "Guernsey Pound", "value": "GGP", "symbol": "£"},
    {"label": "Guyana Dollar", "value": "GYD", "symbol": "$"},
    {"label": "Honduras Lempira", "value": "HNL", "symbol": "L"},
    {"label": "Hong Kong Dollar", "value": "HKD", "symbol": "$"},
    {"label": "Hungary Forint", "value": "HUF", "symbol": "Ft"},
    {"label": "Iceland Krona", "value": "ISK", "symbol": "kr"},
    {"label": "India Rupee", "value": "INR", "symbol": "₹"},
    {"label": "Indonesia Rupiah", "value": "IDR", "symbol": "Rp"},
    {"label": "Iran Rial", "value": "IRR", "symbol": "﷼"},
    {"label": "Isle of Man Pound", "value": "IMP", "symbol": "£"},
    {"label": "Israel Shekel", "value": "ILS", "symbol": "₪"},
    {"label": "Jamaica Dollar", "value": "JMD", "symbol": "J$"},
    {"label": "Japan Yen", "value": "JPY", "symbol": "¥"},
    {"label": "Jersey Pound", "value": "JEP", "symbol": "£"},
    {"label": "Kazakhstan Tenge", "value": "KZT", "symbol": "лв"},
    {"label": "Korea (North) Won", "value": "KPW", "symbol": "₩"},
    {"label": "Korea (South) Won", "value": "KRW", "symbol": "₩"},
    {"label": "Kyrgyzstan Som", "value": "KGS", "symbol": "лв"},
    {"label": "Laos Kip", "value": "LAK", "symbol": "₭"},
    {"label": "Lebanon Pound", "value": "LBP", "symbol": "£"},
    {"label": "Liberia Dollar", "value": "LRD", "symbol": "$"},
    {"label": "Macedonia Denar", "value": "MKD", "symbol": "ден"},
    {"label": "Malaysia Ringgit", "value": "MYR", "symbol": "RM"},
    {"label": "Mauritius Rupee", "value": "MUR", "symbol": "₨"},
    {"label": "Mexico Peso", "value": "MXN", "symbol": "$"},
    {"label": "Mongolia Tughrik", "value": "MNT", "symbol": "₮"},
    {"label": "Moroccan-dirham", "value": "MNT", "symbol": "د.إ"},
    {"label": "Mozambique Metical", "value": "MZN", "symbol": "MT"},
    {"label": "Namibia Dollar", "value": "NAD", "symbol": "$"},
    {"label": "Nepal Rupee", "value": "NPR", "symbol": "₨"},
    {"label": "Netherlands Antilles Guilder", "value": "ANG", "symbol": "ƒ"},
    {"label": "New Zealand Dollar", "value": "NZD", "symbol": "$"},
    {"label": "Nicaragua Cordoba", "value": "NIO", "symbol": "C$"},
    {"label": "Nigeria Naira", "value": "NGN", "symbol": "₦"},
    {"label": "Norway Krone", "value": "NOK", "symbol": "kr"},
    {"label": "Oman Rial", "value": "OMR", "symbol": "﷼"},
    {"label": "Pakistan Rupee", "value": "PKR", "symbol": "₨"},
    {"label": "Panama Balboa", "value": "PAB", "symbol": "B/."},
    {"label": "Paraguay Guarani", "value": "PYG", "symbol": "Gs"},
    {"label": "Peru Sol", "value": "PEN", "symbol": "S/."},
    {"label": "Philippines Peso", "value": "PHP", "symbol": "₱"},
    {"label": "Poland Zloty", "value": "PLN", "symbol": "zł"},
    {"label": "Qatar Riyal", "value": "QAR", "symbol": "﷼"},
    {"label": "Romania Leu", "value": "RON", "symbol": "lei"},
    {"label": "Russia Ruble", "value": "RUB", "symbol": "₽"},
    {"label": "Saint Helena Pound", "value": "SHP", "symbol": "£"},
    {"label": "Saudi Arabia Riyal", "value": "SAR", "symbol": "﷼"},
    {"label": "Serbia Dinar", "value": "RSD", "symbol": "Дин."},
    {"label": "Seychelles Rupee", "value": "SCR", "symbol": "₨"},
    {"label": "Singapore Dollar", "value": "SGD", "symbol": "$"},
    {"label": "Solomon Islands Dollar", "value": "SBD", "symbol": "$"},
    {"label": "Somalia Shilling", "value": "SOS", "symbol": "S"},
    {"label": "South Korean Won", "value": "KRW", "symbol": "₩"},
    {"label": "South Africa Rand", "value": "ZAR", "symbol": "R"},
    {"label": "Sri Lanka Rupee", "value": "LKR", "symbol": "₨"},
    {"label": "Sweden Krona", "value": "SEK", "symbol": "kr"},
    {"label": "Switzerland Franc", "value": "CHF", "symbol": "CHF"},
    {"label": "Suriname Dollar", "value": "SRD", "symbol": "$"},
    {"label": "Syria Pound", "value": "SYP", "symbol": "£"},
    {"label": "Taiwan New Dollar", "value": "TWD", "symbol": "NT$"},
    {"label": "Thailand Baht", "value": "THB", "symbol": "฿"},
    {"label": "Trinidad and Tobago Dollar", "value": "TTD", "symbol": "TT$"},
    {"label": "Turkey Lira", "value": "TRY", "symbol": "₺"},
    {"label": "Tuvalu Dollar", "value": "TVD", "symbol": "$"},
    {"label": "Ukraine Hryvnia", "value": "UAH", "symbol": "₴"},
    {"label": "UAE-Dirham", "value": "AED", "symbol": "د.إ"},
    {"label": "United Kingdom Pound", "value": "GBP", "symbol": "£"},
    {"label": "United States Dollar", "value": "USD", "symbol": "$"},
    {"label": "Uruguay Peso", "value": "UYU", "symbol": "$U"},
    {"label": "Uzbekistan Som", "value": "UZS", "symbol": "лв"},
    {"label": "Venezuela Bolívar", "value": "VEF", "symbol": "Bs"},
    {"label": "Viet Nam Dong", "value": "VND", "symbol": "₫"},
    {"label": "Yemen Rial", "value": "YER", "symbol": "﷼"},
    {"label": "Zimbabwe Dollar", "value": "ZWD", "symbol": "Z$"}
];


export const inputTypes = [
    {
        label: 'Text', options: [
            {value: 'text', label: 'Text'},
            {value: 'textarea', label: 'Textarea'},
            {value: 'wysiwyg', label: 'Wysiwyg'},
            {value: 'password', label: 'Password'},
            {value: 'email', label: 'Email'},
            {value: 'url', label: 'Url'},
            {value: 'tel', label: 'Tel'},
        ]
    },

    {
        label: 'Numbers', options: [
            {value: 'number', label: 'Number'},
            {value: 'currency', label: 'Currency'},
            {value: 'percent', label: 'Percent'},
        ]
    },

    {
        label: 'Date and time', options: [
            {value: 'date', label: 'Date'},
            {value: 'datetime', label: 'Datetime'},
            {value: 'time', label: 'Time'},
        ]
    },

    {
        label: 'Selects', options: [
            {value: 'select', label: 'Select'},
            {value: 'radio', label: 'Radio'},
            {value: 'checkbox', label: 'Checkbox'},
        ]
    },

    {value: 'boolean', label: 'True / False'},

    {value: 'relation', label: 'Relation'},

    {value: 'file', label: 'File'},
    {value: 'image', label: 'Image'},

    {value: 'raw', label: 'Raw'},
];

export function labelInputType(inputType) {
    for (let group of inputTypes) {
        if (group.options) {
            for (let option of group.options) {
                if (option.value === inputType) {
                    return option.label;
                }
            }
        } else {
            if (group.value === inputType) {
                return group.label;
            }
        }
    }
}

export function appUrlName(name, args, isAdmin = false) {
    isAdmin = isAdmin || route().current('admin.*');
    name = isAdmin ? 'admin.apps.edit.' + name : name;
    return route(name, args);
}

export function getAllSearchParams(...exclude) {
    let params = {};

    for (let key in window.location.searchParams) {
        if (exclude.indexOf(key) === -1) {
            params[key] = window.location.searchParams[key];
        }
    }

    return params;
}


export function prepareRulesValidation(columns){
    const rules = {};

    columns.forEach(column => {
        rules[column.name] = [];

        if(column.required){
            rules[column.name].push('required');
        }

        if(column.type === 'email'){
            rules[column.name].push('email');
        }

        if(['number', 'percent', 'currency'].includes(column.type)){
            rules[column.name].push('numeric');
        }

        if(column.type === 'date'){
            rules[column.name].push('date');
        }

        if(column.type === 'time'){
            rules[column.name].push('time');
        }

        if(column.type === 'datetime'){
            rules[column.name].push('datetime');
        }

        if(column.type === 'url'){
            rules[column.name].push('url');
        }

        if(column.type === 'boolean'){
            rules[column.name].push('boolean');
        }

        if(['image', 'file'].includes(column.type)){
            let rule = column.type;
            if (column?.allowedTypes?.length > 0) {
                rule += `:${column.allowedTypes.join(',')}`;
            }
            rules[column.name].push(rule);
        }

        if(['select', 'radio'].includes(column.type)){
            rules[column.name].push('in:' + column.options.map(option => option.value).join(','));
        }

        if((column.type === 'select' && column.multiple) || column.type === 'checkbox'){
            rules[column.name].push('array');
        }

        if(column.unique){
            rules[column.name].push('unique');
        }
    });

    return rules;
}


export function getSectionsFormOptions(collections, collection) {
    const options = [];

    collect(collections).each(c => {
        if(c.id !== collection.id) {
            const columnsRelations = collect(c.columns).filter(c => c.type === 'relation' && c.relationTable === collection.id);
            if(columnsRelations.count() > 0) {
                columnsRelations.each(cr => {
                    options.push({
                        label: `${c.name} (${cr.unique ? 'Unique' : 'Multiple'})`,
                        subtext: `Column foreign key: ${cr.name}`,
                        value: {
                            collection: c.id,
                            column: {
                                collection: c.id,
                                id: cr.id,
                                name: cr.name
                            }
                        },
                    });
                });
            }
        }
    });

    const columnsRelations = collect(collection.columns).filter(c => c.type === 'relation');

    if(columnsRelations.count() > 0) {
        columnsRelations.each(cr => {
            const collectionRelation = collect(collections).first(c => c.id === cr.relationTable);
            options.push({
                label: `${collectionRelation.name} (Unique)`,
                subtext: `Column foreign key: ${cr.name}`,
                value: {
                    collection: collectionRelation.id,
                    column: {
                        id: cr.id,
                        name: cr.name,
                        collection: collection.id
                    }
                }
            });
        });
    }

    return options;
}
