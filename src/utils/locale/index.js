/* Converts a number to a localized string representation with a fixed number of decimals.
 * Example: toLocaleFixedNumber(123456, 2) -> "123456,00 kr"
 * @param: number (number)   a number to convert
 * @param: decimals (number) the number of decimals to include
 * @param: locale (string)   the locale to convert to
 * @returns: (string)        the string representation of the number
 */
export const toLocaleFixedNumberString = (number, decimals, locale = 'nb-NO') =>
    Number.parseFloat(number).toLocaleString(locale, {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals
    });

export const toKroner = number =>
    Number.parseInt(number).toLocaleString('nb-NO');

export const capitalize = string =>
    string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
