const map = items =>
    Object.keys(items).map(key => ({
        label: beautifyKey(key),
        value: beautifyValue(items[key])
    }));

const beautifyKey = key => capitalize(key.split(/(?=[A-Z|0-9])/).join(' '));

const beautifyValue = value =>
    isDate(value)
        ? new Date(value).toLocaleDateString('nb-NO')
        : `${value || '-'}`;

const isDate = string => Date.parse(string) > 0;

const capitalize = string =>
    string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

export default {
    map
};
