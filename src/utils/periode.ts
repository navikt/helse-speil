import dayjs from 'dayjs';

import { DatePeriod, DateString } from '@typer/shared';
import { ISO_DATOFORMAT } from '@utils/date';

export const erIPeriode = (dato: DateString, periode: DatePeriod) =>
    dayjs(dato, ISO_DATOFORMAT, true).isBetween(periode.fom, periode.tom, 'day', '[]');

export const erEtter = (dato: DateString, tidligst: DateString) =>
    dayjs(dato, ISO_DATOFORMAT, true).isAfter(dayjs(tidligst, ISO_DATOFORMAT, true));

export const erFør = (dato: DateString, senest: DateString) =>
    dayjs(dato, ISO_DATOFORMAT, true).isBefore(dayjs(senest, ISO_DATOFORMAT, true));
