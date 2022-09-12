/* eslint-disable unicorn/filename-case */
export const StrUtils = {
    /**
     * Method to replace data from a string
     * @param {string} str String to replace the data
     * @param {string} replace String to replace
     * @param {string} replacement String to replacement
     *
     * @returns {string} Returns the the String with data replaced
     */
    replace(str: string, replace: string, replacement: string): string {
        return str.split(replace).join(replacement);
    },

    /**
     * Method to count the ocurrences into the String
     * @param {string} str Source to check
     * @param {string} strToCheck String to check if exists on str
     *
     * @returns {number} true if "strToCheck" exists on "str", false in otherwise
     */
    count(str: string, strToCheck: string): number {
        return (str.match(new RegExp(strToCheck, 'g')) || []).length;
    },

    /**
     * Method to check if a String contains other String
     * @param {string} str Source to check
     * @param {string} strToCheck String to check if exists on str
     *
     * @returns {boolean} true if "strToCheck" exists on "str", false in otherwise
     */
    contains(str: string, strToCheck: string): boolean {
        return str.includes(strToCheck);
    },

    /**
     * Method to check if a String contains other String ignoring letter case
     * @param {string} str Source to check
     * @param {string} strToCheck String to check if exists on str
     *
     * @returns {boolean} true if "strToCheck" exists on "str", false in otherwise
     */
    containsIgnorecase(str: string, strToCheck: string): boolean {
        return str.toLowerCase().includes(strToCheck.toLowerCase());
    },

    normalize(value: string | null, toUpper?: boolean): string {
        if (!value) {
            return '';
        }

        let normalized = value.toLowerCase();
        normalized = normalized.replace(/é/g, 'e');
        normalized = normalized.replace(/ú/g, 'u');
        normalized = normalized.replace(/í/g, 'i');
        normalized = normalized.replace(/á/g, 'a');
        normalized = normalized.replace(/ó/g, 'o');
        normalized = normalized.replace(/[^\d\sA-Za-z]/g, '').trim();
        return toUpper ? normalized.toUpperCase() : normalized;
    },
};
