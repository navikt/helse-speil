export const somPenger = (value?: number) => (value !== undefined ? `${toKronerOgØre(value)} kr` : '-');

export const toKronerOgØre = (value: string | number, decimals = 2, locale = 'nb-NO'): string =>
    Number.parseFloat(`${value}`).toLocaleString(locale, {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
    });
