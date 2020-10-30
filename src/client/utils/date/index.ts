import dayjs, { Dayjs } from 'dayjs';
import { Periode } from 'internal-types';
import isoWeek from 'dayjs/plugin/isoWeek';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isoWeek);
dayjs.extend(isSameOrBefore);

export const NORSK_DATOFORMAT = 'DD.MM.YYYY';
export const NORSK_DATOFORMAT_KORT = 'DD.MM.YY';
export const ISO_DATOFORMAT = 'YYYY-MM-DD';
export const ISO_TIDSPUNKTFORMAT = 'YYYY-MM-DDTHH:mm:ss';

export const findLatest = (dates: Dayjs[]): Dayjs => {
    const sorted = dates.map((date) => date).sort((a, b) => (b.isAfter(a) ? -1 : a.isAfter(b) ? 1 : 0));
    return sorted.pop()!;
};

export const daysBetween = (startdato: Dayjs, sluttdato: Dayjs): number => Math.abs(startdato.diff(sluttdato, 'day'));

export const daysBetweenInclusive = (startdato: Dayjs, sluttdato: Dayjs): number =>
    daysBetween(startdato, sluttdato) + 1;

export const listOfDatesBetween = (startdato: Dayjs, sluttdato: Dayjs): Dayjs[] => {
    const dates = [];
    let tempDate = startdato.clone();
    while (tempDate.isBefore(sluttdato)) {
        dates.push(tempDate);
        tempDate = tempDate.add(1, 'day');
    }
    return [...dates, sluttdato];
};

export const arbeidsdagerMellom = (startdato: Dayjs, sluttdato: Dayjs): Dayjs[] => {
    const datoer = [];
    while (!startdato.isAfter(sluttdato)) {
        if (startdato.day() >= 1 && startdato.day() < 6) {
            datoer.push(startdato);
        }
        startdato = startdato.add(1, 'day');
    }
    return datoer;
};

export const first26WeeksInterval = (perioder: Periode[], førsteDag: Dayjs): number =>
    perioder.findIndex((period, index) => {
        const førsteDagForrigePeriode = index === 0 ? førsteDag : perioder[index - 1].fom;
        const sisteDagNåværendePeriode = period.tom;
        return Math.abs(førsteDagForrigePeriode.diff(sisteDagNåværendePeriode, 'week')) >= 26;
    });

export const workdaysBetween = (startdato: Dayjs, sluttdato: Dayjs): number => {
    let tempDate = startdato.clone();
    let dagteller = 0;
    while (tempDate.isSameOrBefore(sluttdato)) {
        if (tempDate.isoWeekday() <= 5) {
            dagteller++;
        }
        tempDate = tempDate.add(1, 'day');
    }
    return dagteller;
};
