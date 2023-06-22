import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isoWeek from 'dayjs/plugin/isoWeek';
import minMax from 'dayjs/plugin/minMax';

import { Maybe } from '@io/graphql';

dayjs.extend(isoWeek);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(minMax);

export const NORSK_DATOFORMAT_MED_KLOKKESLETT = 'DD.MM.YY kl. HH.mm';
export const NORSK_DATOFORMAT = 'DD.MM.YYYY';
export const NORSK_DATOFORMAT_KORT = 'DD.MM.YY';
export const ISO_DATOFORMAT = 'YYYY-MM-DD';
export const ISO_TIDSPUNKTFORMAT = 'YYYY-MM-DDTHH:mm:ss';

export const getFormattedDateString = (dateString?: Maybe<DateString>): string =>
    typeof dateString === 'string' ? dayjs(dateString).format(NORSK_DATOFORMAT) : '';

export const getFormattedDatetimeString = (dateString?: Maybe<DateString>): string =>
    typeof dateString === 'string' ? dayjs(dateString).format(NORSK_DATOFORMAT_MED_KLOKKESLETT) : '';

export const somDato = (dato: string): Dayjs => dayjs(dato ?? null, ISO_DATOFORMAT);
