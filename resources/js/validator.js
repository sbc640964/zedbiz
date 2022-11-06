import {collect} from "collect.js";

class Validator
{
    _errors = {};

    _prefix = '';

    _rows = null;

    _uniquesAttributes = {};

    _currentRowIndex = null;

    _currentAttribute = null;

    get errors()
    {
        return this._errors;
    }

    get hasErrors()
    {
        return Object.keys(this._errors).length > 0;
    }

    fails()
    {
        return this.hasErrors;
    }

    make(data, rules, messages = {}, multiValidateRows = false, keysAlias = {})
    {
        if(messages === null || messages === undefined || messages === ''){
            messages = {};
        }

        if(multiValidateRows === true){

            this._rows = data;

            collect(data).each((row, index) => {
                this._prefix = index + '.';
                this._currentRowIndex = index;
                this.make(row, rules, messages, false, keysAlias);
            });
        }

        for (let attribute in rules) {
            if (rules.hasOwnProperty(attribute)) {
                this._currentAttribute = attribute;
                this.validateAttribute(attribute, data[keysAlias?.[attribute] ?? attribute], rules[attribute], messages[attribute] ?? {});
            }
        }

        return this;
    }

    validateAttribute(attribute, value, rules, messages)
    {
        for (let rule of rules) {
            let [validateName, ...params] = rule.split(':');
            if (this[`validate${validateName[0].toUpperCase()}${validateName.slice(1)}`] === undefined) {
                throw new Error(`Validator ${validateName} is not defined`);
            }

            this[`validate${validateName[0].toUpperCase()}${validateName.slice(1)}`](value, attribute, messages[validateName] ?? null, params);
        }
    }

    validateNumeric(value, attribute, message = null)
    {
        if (typeof value !== 'number') {
            return this.addError(attribute, 'numeric', message);
        }
    }

    validateUnique(value, attribute, message = null, params)
    {
        if(this._uniquesAttributes[attribute] === undefined){
            this._uniquesAttributes[attribute] = [];
        }

        if(this._uniquesAttributes[attribute].includes(value)){
            return this.addError(attribute, 'unique', message);
        }

        if(value) this._uniquesAttributes[attribute].push(value);
    }

    // validateExists(value, attribute, message = null, params)
    // {
    //     let [model, column] = params;
    //     let data = {};
    //     data[column] = value;
    //     return this.validateUniqueRaw(model, data);
    // }
    //
    // validateUniqueRaw(model, data)
    // {
    //     let modelInstance = new model();
    //     let result = modelInstance.find(data);
    //     return result !== null;
    // }

    validateEmail(email, attribute, message = null)
    {
        if (!this.validateRegexpRaw(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, email)) {
            return this.addError(attribute, 'email', message);
        }
    }

    validateBoolean(value, attribute, message = null)
    {
        if (typeof value !== 'boolean') {
            return this.addError(attribute, 'boolean', message);
        }
    }

    validateRequired(value, attribute, message = null)
    {
        if (value === null || value === undefined || value === '') {
            return this.addError(attribute, 'required', message);
        }
    }

    validateIn(value, attribute, message = null, params)
    {
        if (!params.includes(value)) {
            return this.addError(attribute, 'in', message);
        }
    }

    validateNotIn(value, attribute, message = null, params)
    {
        if (params.includes(value)) {
            return this.addError(attribute, 'notIn', message);
        }
    }

    validateRegexp(value, attribute, message = null, params)
    {
        if (!this.validateRegexpRaw(new RegExp(params[0]), value)) {
            return this.addError(attribute, 'regexp', message);
        }
    }

    validateString(value, attribute, message = null)
    {
        if (typeof value !== 'string') {
            return this.addError(attribute, 'string', message);
        }
    }

    validateMin(value, attribute, message = null, params)
    {
        if(typeof value === 'string' && !this.errors[attribute].includes(this.getMessage(attribute, 'numeric'))){
            if (value.length < params[0]) {
                return this.addError(attribute, 'minLength', message);
            }
        }

        if (value < params[0]) {
            return this.addError(attribute, 'min', message);
        }
    }

    validateMax(value, attribute, message = null, params)
    {
        if(typeof value === 'string' && !this.errors[attribute].includes(this.getMessage(attribute, 'numeric'))){
            if (value.length > params[0]) {
                return this.addError(attribute, 'maxLength', message);
            }
        }
        if (value > params[0]) {
            return this.addError(attribute, 'max', message);
        }
    }

    validateDate(value, attribute, message = null, params)
    {
        if (isNaN(Date.parse(value))) {
            return this.addError(attribute, 'date', message);
        }

        //check format
        if(params?.[0]){
            let format = params[0];
            let regexp = new RegExp(format.replace(/Y/g, '\\d{4}').replace(/m/g, '\\d{2}').replace(/d/g, '\\d{2}'));
            if(!regexp.test(value)){
                return this.addError(attribute, 'date', message);
            }
        }
    }

    validateAfterDate(value, attribute, message = null, params){
        let date = new Date(value);
        let afterDate = new Date(params[0]);
        if(date <= afterDate){
            return this.addError(attribute, 'after', message);
        }
    }

    validateBeforeDate(value, attribute, message = null, params){
        let date = new Date(value);
        let beforeDate = new Date(params[0]);
        if(date >= beforeDate){
            return this.addError(attribute, 'before', message);
        }
    }

    validateUrl(value, attribute, message = null)
    {
        if (!this.validateRegexpRaw(/^(http|https):\/\/[^\s$.?#].[^\s]*$/, value)) {
            return this.addError(attribute, 'url', message);
        }
    }

    validateFile(value, attribute, message = null, params, returnRaw = false)
    {
        if (!value instanceof File) {
            return returnRaw ? false : this.addError(attribute, 'file', message);
        }

        //check mime
        if(params?.[0]){
            let mime = Array.isArray(params[0]) ? params[0] : params[0].split(',');
            if(!mime.includes(value.type)){
                return returnRaw ? false : this.addError(attribute, 'file', message);
            }
        }

        return true;
    }

    validateImage(value, attribute, message = null, params)
    {
        if(!this.validateFile(value, attribute, message, params, true)){
            return this.addError(attribute, 'image', message);
        }
    }

    validateRegexpRaw(regexp, value)
    {
        if (value.length === 0) {
            return false;
        }

        return regexp.test(value);
    }

    addError(attribute, validateName, message = null)
    {
        attribute = this._prefix + attribute;

        if (message === null) {
            message = this.getMessage(attribute, validateName);
        }

        if(!this._errors[attribute]){
            this._errors[attribute] = [];
        }

        this._errors[attribute].push(typeof message === 'function' ? message(attribute) : message);
    }

    getMessage(attribute, validateName)
    {
        return {
            'email': `${attribute} is not valid email`,
            'regexp': `${attribute} is not valid`,
            'required': `${attribute} is required`,
            'string': `${attribute} is not string`,
            'number': `${attribute} is not number`,
            'integer': `${attribute} is not integer`,
            'boolean': `${attribute} is not boolean`,
            'array': `${attribute} is not array`,
            'object': `${attribute} is not object`,
            'date': `${attribute} is not date`,
            'min': `${attribute} is less than min value`,
            'max': `${attribute} is more than max value`,
            'between': `${attribute} is not between min and max value`,
            'minLength': `${attribute} is less than min length`,
            'maxLength': `${attribute} is more than max length`,
            'betweenLength': `${attribute} is not between min and max length`,
            'in': `${attribute} is not in list`,
            'notIn': `${attribute} is in list`,
            'url': `${attribute} is not valid url`,
            'file': `${attribute} is not valid file`,
            'image': `${attribute} is not valid image`,
            'unique': `${attribute} is not unique in import file`,
        }[validateName] ?? `${attribute} is not valid`;
    }
}

export default Validator;
