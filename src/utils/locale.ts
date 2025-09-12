export const somPenger = (value?: number | null) =>
    value !== undefined && value !== null ? `${toKronerOgØre(value)} kr` : '-';

export const somPengerUtenDesimaler = (value?: number | null) =>
    value !== undefined && value !== null ? `${toKronerOgØre(value, 0, 'nb-NO')} kr` : '-';

export const toKronerOgØre = (value: string | number, decimals = 2, locale = 'nb-NO'): string =>
    Number.parseFloat(`${value}`).toLocaleString(locale, {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
    });

export const kronerOgØreTilNumber = (value: string) =>
    Number(
        value
            .replaceAll(' ', '')
            .replaceAll(',', '.')
            // Når tallet blir formattert av toKronerOgØre får det non braking space i stedet for ' '
            .replaceAll(String.fromCharCode(160), ''),
    );

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

// Denne fungerer dårlig for navn, Øyvind blir ØYvind. Bruk capitalizeName!
export const capitalize = (value: string): string =>
    value.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.substring(1).toLowerCase());

export const getMonthName = (yearMonth: string) => {
    const monthNumberToMonthName: Record<string, string> = {
        '01': 'Januar',
        '02': 'Februar',
        '03': 'Mars',
        '04': 'April',
        '05': 'Mai',
        '06': 'Juni',
        '07': 'Juli',
        '08': 'August',
        '09': 'September',
        '10': 'Oktober',
        '11': 'November',
        '12': 'Desember',
    };
    const måned = yearMonth.split('-')?.[1];
    return (måned && monthNumberToMonthName[måned]) ?? 'Fant ikke måned';
};

export const tilTelefonNummer = (value: string): string =>
    value.replace(/\D+/g, '').replace(/(\d{3})(\d{2})(\d{3})/, '$1 $2 $3');
