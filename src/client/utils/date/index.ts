/* eslint-disable no-console */
import moment from 'moment';

moment.locale = () => 'nb-NO';

import dayjs from 'dayjs';
import { Periode } from '../../context/types';

export const toDate = (date: string) => {
    return moment(date, ['DD.MM.YYYY', 'YYYY-MM-DD', moment.ISO_8601]).format('DD.MM.YYYY');
};

export const daysBetween = (firstDate: string, lastDate: string) => {
    const first = moment(firstDate, ['DD.MM.YYYY', 'YYYY-MM-DD']);
    const last = moment(lastDate, ['DD.MM.YYYY', 'YYYY-MM-DD']);
    return Math.abs(first.diff(last, 'days'));
};

export const daysBetweenInclusive = (firstDate: string, lastDate: string) => {
    return daysBetween(firstDate, lastDate) + 1;
};

export const listOfDatesBetween = (firstDate: string, lastDate: string) => {
    const dates = [];
    let first = dayjs(firstDate);
    const last = dayjs(lastDate);
    while (first.isBefore(last)) {
        dates.push(first.format('YYYY-MM-DD'));
        first = first.add(1, 'day');
    }
    return [...dates, last.format('YYYY-MM-DD')];
};

export const first26WeeksInterval = (periods: Periode[], firstDay: string) => {
    return periods.findIndex((period, i) => {
        const firstDayPreviousPeriod = i === 0 ? firstDay : periods[i - 1].fom;
        const lastDayCurrentPeriod = period.tom;
        return (
            Math.abs(moment(firstDayPreviousPeriod).diff(moment(lastDayCurrentPeriod), 'weeks')) >=
            26
        );
    });
};

export const workdaysBetween = (firstDate: string, lastDate: string) => {
    const _firstDate = moment(firstDate);
    const _lastDate = moment(lastDate);

    const tempDate = _firstDate.clone();
    let numberOfDays = 0;
    while (tempDate <= _lastDate) {
        if (tempDate.isoWeekday() <= 5) {
            numberOfDays++;
        }
        tempDate.add(1, 'days');
    }
    return numberOfDays;
};
