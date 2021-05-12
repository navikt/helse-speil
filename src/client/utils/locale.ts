export const somPenger = (value?: number) => (value !== undefined ? `${toKronerOgØre(value)} kr` : '-');

export const toKronerOgØre = (value: string | number, decimals = 2, locale = 'nb-NO'): string =>
    Number.parseFloat(`${value}`).toLocaleString(locale, {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
    });

export const capitalizeName = (value: string) =>
    value
        .toLowerCase()
        .split(' ')
        .map((value) => value.substring(0, 1).toUpperCase() + value.substring(1))
        .join(' ');
