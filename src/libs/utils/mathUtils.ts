/* eslint-disable unicorn/numeric-separators-style */
/* eslint-disable unicorn/prefer-date-now */
/* eslint-disable unicorn/prefer-math-trunc */
/* eslint-disable no-mixed-operators */
/* eslint-disable unicorn/no-for-loop */
/* eslint-disable unicorn/no-static-only-class */
export class MathUtils {
    
    /**
     * Method to round a number with a selected decimal precission. By default, round with two decimals
     * @param {number} number Number to round
     * @param {number} [decimalNumbers] Decimal numbers precission
     * 
     * @returns {number} Returns a rounded number with the specified decimals
     */
     static round(number: number, decimalNumbers?: number): number {
        if (!decimalNumbers) {
            decimalNumbers = 2;
        }
        return Number(Math.round(Number(number + 'e' + decimalNumbers)) + 'e-' + decimalNumbers);
    }
}
