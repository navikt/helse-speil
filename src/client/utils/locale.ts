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
        .map((value) => {
            if (value.includes('-')) {
                const strekIndeks = value.indexOf('-');
                return (
                    value.substring(0, 1).toUpperCase() +
                    value.substring(1, strekIndeks + 1) +
                    value.substring(strekIndeks + 1, strekIndeks + 2).toUpperCase() +
                    value.substring(strekIndeks + 2)
                );
            }
            return value.substring(0, 1).toUpperCase() + value.substring(1);
        })
        .join(' ');

export const capitalize = (value: string): string =>
    value.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase());
