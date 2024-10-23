import dayjs, { Dayjs } from 'dayjs';

import { Maybe } from '@io/graphql';
import { DateString } from '@typer/shared';

export const NORSK_DATOFORMAT_MED_KLOKKESLETT = 'DD.MM.YY kl. HH.mm';
export const NORSK_DATOFORMAT = 'DD.MM.YYYY';
export const NORSK_DATOFORMAT_LANG = 'D. MMMM YYYY';
export const ISO_DATOFORMAT = 'YYYY-MM-DD';
export const ISO_TIDSPUNKTFORMAT = 'YYYY-MM-DDTHH:mm:ss';

export const getFormattedDateString = (dateString?: Maybe<DateString>): string =>
    typeof dateString === 'string' ? dayjs(dateString).format(NORSK_DATOFORMAT) : '';

export const getFormattedDatetimeString = (dateString?: Maybe<DateString>): string =>
    typeof dateString === 'string' ? dayjs(dateString).format(NORSK_DATOFORMAT_MED_KLOKKESLETT) : '';

export const somDato = (dato: string): Dayjs => dayjs(dato ?? null, ISO_DATOFORMAT);

export const somDate = (dato?: string): Date | undefined =>
    dayjs(dato, ISO_DATOFORMAT, true).isValid() ? dayjs(dato, ISO_DATOFORMAT).toDate() : undefined;

export const somNorskDato = (dato: string | undefined): string | undefined =>
    dato ? dayjs(somDate(dato)).format(NORSK_DATOFORMAT) : undefined;
