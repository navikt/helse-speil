import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isoWeek from 'dayjs/plugin/isoWeek';
import { Maybe } from '@io/graphql';

dayjs.extend(isoWeek);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export const NORSK_DATOFORMAT_MED_KLOKKESLETT = 'DD.MM.YYYY kl HH.mm';
export const NORSK_DATOFORMAT = 'DD.MM.YYYY';
export const NORSK_DATOFORMAT_KORT = 'DD.MM.YY';
export const ISO_DATOFORMAT = 'YYYY-MM-DD';
export const ISO_TIDSPUNKTFORMAT = 'YYYY-MM-DDTHH:mm:ss';

export const findLatest = (dates: Dayjs[]): Dayjs => {
    return Array.from(dates)
        .sort((a, b) => (b.isAfter(a) ? -1 : a.isAfter(b) ? 1 : 0))
        .pop()!;
};

export const findEarliest = (dates: Dayjs[]): Dayjs => {
    return Array.from(dates)
        .sort((a, b) => (b.isBefore(a) ? -1 : a.isBefore(b) ? 1 : 0))
        .pop()!;
};

export const getFormattedDateString = (dateString?: Maybe<DateString>): string =>
    typeof dateString === 'string' ? dayjs(dateString).format(NORSK_DATOFORMAT) : '';

export const getFormattedDatetimeString = (dateString?: Maybe<DateString>): string =>
    typeof dateString === 'string' ? dayjs(dateString).format(NORSK_DATOFORMAT) : '';

export const somDato = (dato: string): Dayjs => dayjs(dato ?? null, ISO_DATOFORMAT);
