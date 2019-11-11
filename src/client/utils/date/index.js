/* eslint-disable no-console */
import moment from 'moment';

moment.suppressDeprecationWarnings = true;
moment.locale = 'nb-NO';

import dayjs from 'dayjs';

export const toDate = dateString => {
    return moment(dateString, ['DD.MM.YYYY', 'YYYY-MM-DD', moment.ISO_8601]).format('DD.MM.YYYY');
};

export const toDateAndTime = dateString => {
    return moment(dateString).format('DD.MM.YYYY, kk:mm');
};

export const daysBetween = (firstDate, lastDate) => {
    const first = moment(firstDate, ['DD.MM.YYYY', 'YYYY-MM-DD']);
    const last = moment(lastDate, ['DD.MM.YYYY', 'YYYY-MM-DD']);
    return Math.abs(first.diff(last, 'days'));
};

export const listOfDatesBetween = (firstDate, lastDate) => {
    const dates = [];
    let first = dayjs(firstDate);
    const last = dayjs(lastDate);
    while (first.isBefore(last)) {
        dates.push(first.format('YYYY-MM-DD'));
        first = first.add(1, 'day');
    }
    return [...dates, last.format('YYYY-MM-DD')];
};

export const first26WeeksInterval = (periods, firstDay) => {
    return periods.findIndex((period, i) => {
        const firstDayPreviousPeriod = i === 0 ? firstDay : periods[i - 1].fom;
        const lastDayCurrentPeriod = period.tom;
        return (
            Math.abs(moment(firstDayPreviousPeriod).diff(moment(lastDayCurrentPeriod), 'weeks')) >=
            26
        );
    });
};

export const workdaysBetween = (firstDate, lastDate) => {
    firstDate = moment(firstDate);
    lastDate = moment(lastDate);

    const tempDate = firstDate.clone();
    let numberOfDays = 0;
    while (tempDate <= lastDate) {
        if (tempDate.isoWeekday() <= 5) {
            numberOfDays++;
        }
        tempDate.add(1, 'days');
    }
    return numberOfDays;
};
