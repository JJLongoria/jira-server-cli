/* eslint-disable no-negated-condition */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable unicorn/numeric-separators-style */
/* eslint-disable unicorn/prefer-date-now */
/* eslint-disable unicorn/prefer-math-trunc */
/* eslint-disable no-mixed-operators */
export const Utils = {
    /**
     * Method to force to put the data into an array if the data must be an array
     * @param {any} data Data to force be an array
     *
     * @returns {Array<any>} Returns an array with the data or undefined if data is undefined
     */
    forceArray(data: any): any[] {
        if (data === undefined) {
            return data;
        }

        return (Array.isArray(data)) ? data : [data];
    },

    /**
     * Method to clone an object
     * @param {any} obj Object to clone
     *
     * @returns {any} Returns the cloned object
     */
    clone(obj: any): any {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Method to check if the value is an object
     * @param {any} value Value to check
     *
     * @returns {boolean} true if the value is an object, false in otherwise
     */
    isObject(value: any): boolean {
        return !Utils.isArray(value) && typeof value === 'object';
    },

    /**
     * Method to check if the value is a string
     * @param {any} value Value to check
     *
     * @returns {boolean} true if the value is a string, false in otherwise
     */
    isString(value: any): boolean {
        return !Utils.isNull(value) && typeof value === 'string';
    },

    /**
     * Method to check if the value is a number
     * @param {any} value Value to check
     *
     * @returns {boolean} true if the value is a number, false in otherwise
     */
    isNumber(value: any): boolean {
        return !Utils.isNull(value) && typeof value === 'number';
    },

    /**
     * Method to check if the value is a BigInt
     * @param {any} value Value to check
     *
     * @returns {boolean} true if the value is a BigInt, false in otherwise
     */
    isBigInt(value: any): boolean {
        return !Utils.isNull(value) && typeof value === 'bigint';
    },

    /**
     * Method to check if the value is a symbol
     * @param {any} value Value to check
     *
     * @returns {boolean} true if the value is a symbol, false in otherwise
     */
    isSymbol(value: any): boolean {
        return !Utils.isNull(value) && typeof value === 'symbol';
    },

    /**
     * Method to check if the value is a boolean
     * @param {any} value Value to check
     *
     * @returns {boolean} true if the value is a boolean, false in otherwise
     */
    isBoolean(value: any): boolean {
        return !Utils.isNull(value) && typeof value === 'boolean';
    },

    /**
     * Method to check if the value is a function
     * @param {any} value Value to check
     *
     * @returns {boolean} true if the value is a function, false in otherwise
     */
    isFunction(value: any): boolean {
        return !Utils.isNull(value) && typeof value === 'function';
    },

    /**
     * Method to check if the value is an array
     * @param {any} value Value to check
     *
     * @returns {boolean} true if the value is an array, false in otherwise
     */
    isArray(value: any): boolean {
        return !Utils.isNull(value) && Array.isArray(value);
    },

    /**
     * Method to check if the value is null or undefined
     * @param {any} value Value to check
     *
     * @returns {boolean} true if the value is null or undefined, false in otherwise
     */
    isNull(value: any): boolean {
        return value === undefined || value === null;
    },

    /**
     * Method to check if an object has keys
     * @param {any} value Object to check
     *
     * @returns {boolean} true if the object has keys, false in otherwise
     */
    hasKeys(value: any): boolean {
        return !Utils.isNull(value) && Utils.isObject(value) && Object.keys(value).length > 0;
    },

    /**
     * Method to count the keys from an object
     * @param {any} value Object to get the keys
     *
     * @returns {number} Returns the keys from the object
     */
    countKeys(value: any): number {
        return (Utils.hasKeys(value)) ? Object.keys(value).length : 0;
    },

    /**
     * Method to get the first element from an object
     * @param {any} value Object to get the first element
     *
     * @returns {any} Returns the first element data
     */
    getFirstElement(value: any): any {
        return (Utils.hasKeys(value)) ? value[Object.keys(value)[0]] : 0;
    },

    /**
     * Method to get the last element from an object
     * @param {any} value Object to get the last element
     *
     * @returns {any} Returns the last element data
     */
    getLastElement(value: any): any {
        return (Utils.hasKeys(value)) ? value[Object.keys(value)[Object.keys(value).length - 1]] : 0;
    },

    /**
     * Method to sort an Array. You can use fields from elements to sort and sort with case sensitive or insensitive
     * @param {Array<any>} elements Array with the elements to sort
     * @param {Array<string>} [fields] fields from child to sort
     * @param {boolean} [caseSensitive] true if want sort data with case sensitive
     *
     * @returns {Array<any>} Returns the array sorted
     */
    sort(elements: any[], fields?: string[], caseSensitive?: boolean): any[] {
        if (Array.isArray(elements) && elements.length > 0) {
            elements.sort(function (a, b) {
                if (fields && fields.length > 0) {
                    let nameA = '';
                    let nameB = '';
                    let counter = 0;
                    for (const field of fields) {
                        const valA = (a[field] !== undefined) ? a[field] : '';
                        const valB = (b[field] !== undefined) ? b[field] : '';
                        if (counter === 0) {
                            nameA = valA;
                            nameB = valB;
                        } else {
                            nameA += '_' + valA;
                            nameB += '_' + valB;
                        }

                        counter++;
                    }

                    if (Utils.isNumber(nameA) && Utils.isNumber(nameB)) {
                        if (nameA > nameB) {
                            return 1;
                        }

                        if (nameA < nameB) {
                            return -1;
                        }

                        return 0;
                    }

                    nameA = String(nameA);
                    nameB = String(nameB);
                    return caseSensitive ? nameA.localeCompare(nameB) : nameA.toLowerCase().localeCompare(nameB.toLowerCase());
                }

                if (Utils.isNumber(a) && Utils.isNumber(b)) {
                    if (a > b) {
                        return 1;
                    }

                    if (b < a) {
                        return -1;
                    }

                    return 0;
                }

                return caseSensitive ? a.localeCompare(b) : a.toLowerCase().localeCompare(b.toLowerCase());
            });
        }

        return elements;
    },

    /**
     * Method to sort an Array. You can use fields from elements to sort and sort with case sensitive or insensitive
     * @param {Array<any>} elements Array with the elements to sort
     * @param {Array<string>} [fields] fields from child to sort
     * @param {boolean} [caseSensitive] true if want sort data with case sensitive
     *
     * @returns {Array<any>} Returns the array sorted
     */
    sortReverse(elements: any[], fields?: string[], caseSensitive?: boolean): any[] {
        if (Array.isArray(elements) && elements.length > 0) {
            elements.sort(function (a, b) {
                if (fields && fields.length > 0) {
                    let nameA = '';
                    let nameB = '';
                    let counter = 0;
                    for (const field of fields) {
                        const valA = (a[field] !== undefined) ? a[field] : '';
                        const valB = (b[field] !== undefined) ? b[field] : '';
                        if (counter === 0) {
                            nameA = valA;
                            nameB = valB;
                        } else {
                            nameA += '_' + valA;
                            nameB += '_' + valB;
                        }

                        counter++;
                    }

                    if (Utils.isNumber(nameA) && Utils.isNumber(nameB)) {
                        if (nameA < nameB) {
                            return 1;
                        }

                        if (nameA > nameB) {
                            return -1;
                        }

                        return 0;
                    }

                    nameA = String(nameA);
                    nameB = String(nameB);
                    return caseSensitive ? nameB.localeCompare(nameA) : nameB.toLowerCase().localeCompare(nameA.toLowerCase());
                }

                if (Utils.isNumber(a) && Utils.isNumber(b)) {
                    if (a > b) {
                        return -1;
                    }

                    if (a < b) {
                        return 1;
                    }

                    return 0;
                }

                return caseSensitive ? b.localeCompare(a) : b.toLowerCase().localeCompare(a.toLowerCase());
            });
        }

        return elements;
    },

    deserializeObject<T>(object: any, Type: new (a?: any) => T): { [key: string]: T } {
        const result: { [key: string]: T } = {};
        if (Utils.isObject(object) && Utils.hasKeys(object)) {
            for (const key of Object.keys(object)) {
                result[key] = new Type(object[key]);
            }
        }

        return result;
    },

    deserializeArray<T>(collection: any[], Type: new (a?: any) => T): T[] {
        const result: T[] = [];
        if (collection && collection.length > 0) {
            for (const data of collection) {
                result.push(new Type(data));
            }
        }

        return result;
    },

    moveArrayElement(collection: any[], from: number, to: number) {
        const element = collection[from];
        collection.splice(from, 1);
        collection.splice(to, 0, element);
        return collection;
    },

    createUUID(): string {
        let dt = new Date().getTime();
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    },

    toNumber(value: number | string | null): number {
        if (value !== null) {
            const strValue = String(value);
            if (strValue.indexOf(',')) {
                return Number(strValue.split(',').join('.'));
            }

            return Number(strValue);
        }

        return 0;
    },

    randomColor(): string {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    },
};
