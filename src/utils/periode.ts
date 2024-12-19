import dayjs from 'dayjs';

import { DatePeriod, DateString } from '@typer/shared';
import { ISO_DATOFORMAT } from '@utils/date';

export const erIPeriode = (dato: DateString, periode: DatePeriod) =>
    dayjs(dato, ISO_DATOFORMAT, true).isBetween(periode.fom, periode.tom, 'day', '[]');
