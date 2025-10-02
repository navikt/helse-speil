import dayjs, { Dayjs } from 'dayjs';

import { DatePeriod, DateString } from '@typer/shared';

export const NORSK_DATOFORMAT_MED_KLOKKESLETT = 'DD.MM.YYYY kl. HH.mm';
export const NORSK_DATOFORMAT = 'DD.MM.YYYY';
export const NORSK_DATOFORMAT_LANG = 'D. MMMM YYYY';
export const ISO_DATOFORMAT = 'YYYY-MM-DD';
export const ISO_TIDSPUNKTFORMAT = 'YYYY-MM-DDTHH:mm:ss';

export const iDag: DateString = dayjs().format(ISO_DATOFORMAT);

export const getFormattedDateString = (dateString?: DateString | null): string =>
    typeof dateString === 'string' ? dayjs(dateString).format(NORSK_DATOFORMAT) : '';

export const getFormattedDatetimeString = (dateString?: DateString | null): string =>
    typeof dateString === 'string' ? dayjs(dateString).format(NORSK_DATOFORMAT_MED_KLOKKESLETT) : '';

export const somDato = (dato: string): Dayjs => dayjs(dato ?? null, ISO_DATOFORMAT);

export const somDate = (dato?: string): Date | undefined =>
    dayjs(dato, ISO_DATOFORMAT, true).isValid() ? dayjs(dato, ISO_DATOFORMAT).toDate() : undefined;

export const somNorskDato = (dato: string | undefined): string | undefined =>
    dato ? dayjs(somDate(dato)).format(NORSK_DATOFORMAT) : undefined;

export const plussEnDag = (dato: DateString): DateString =>
    dayjs(dato, ISO_DATOFORMAT, true).add(1, 'day').format(ISO_DATOFORMAT);

export const minusEnDag = (dato: DateString): DateString =>
    dayjs(dato, ISO_DATOFORMAT, true).subtract(1, 'day').format(ISO_DATOFORMAT);

export const erIPeriode = (dato: DateString, periode: DatePeriod) =>
    dayjs(dato, ISO_DATOFORMAT, true).isBetween(periode.fom, periode.tom, 'day', '[]');
export const erEtter = (dato: DateString, tidligst: DateString) =>
    dayjs(dato, ISO_DATOFORMAT, true).isAfter(dayjs(tidligst, ISO_DATOFORMAT, true));
export const erFør = (dato: DateString, senest: DateString) =>
    dayjs(dato, ISO_DATOFORMAT, true).isBefore(dayjs(senest, ISO_DATOFORMAT, true));
export const erSammeEllerFør = (dato: DateString, senest: DateString) =>
    dayjs(dato, ISO_DATOFORMAT, true).isSameOrBefore(dayjs(senest, ISO_DATOFORMAT, true), 'day');

export const erHelg = (dato: DateString): boolean => dayjs(dato, ISO_DATOFORMAT).isoWeekday() > 5;

export const erGyldigNorskDato = (dato: string): boolean => dayjs(dato, NORSK_DATOFORMAT, true).isValid();
export const dateTilNorskDato = (date: Date): string => dayjs(date).format(NORSK_DATOFORMAT);
export const norskDatoTilDate = (dato: string): Date => dayjs(dato, NORSK_DATOFORMAT, true).toDate();
export const norskDatoTilIsoDato = (norskDato: string): DateString =>
    dayjs(norskDato, NORSK_DATOFORMAT, true).format(ISO_DATOFORMAT);

export const perioderOverlapper = (periode: DatePeriod, annenPeriode: DatePeriod) =>
    periode.fom <= annenPeriode.tom && periode.tom >= annenPeriode.fom;

export const tilDatoer = (periode: DatePeriod) => {
    const datoer: DateString[] = [];
    const dayjsFom = dayjs(periode.fom);
    const dayjsTom = dayjs(periode.tom);
    for (let djs = dayjsFom; djs.isSameOrBefore(dayjsTom); djs = djs.add(1, 'day')) {
        const dato = djs.format(ISO_DATOFORMAT);
        datoer.push(dato);
    }
    return datoer;
};

export const tilUkedager = (periode: DatePeriod) => {
    return tilDatoer(periode).filter((dato) => !erHelg(dato));
};
