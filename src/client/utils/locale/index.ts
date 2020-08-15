export const somPenger = (value?: number) => (value ? `${toKronerOgØre(value)} kr` : '-');

export const toKronerOgØre = (value: string | number, decimals = 2, locale = 'nb-NO'): string =>
    Number.parseFloat(`${value}`).toLocaleString(locale, {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
    });

export const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

export const capitalizeName = (value: string): string => value.replace(/\b[\w']+\b/g, (word) => capitalize(word));

export const extractNameFromEmail = (email?: string): string =>
    email?.split('@')[0].split('.').join(' ') ?? 'Navn mangler';
