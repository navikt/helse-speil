/* eslint-disable no-console */
import moment from 'moment';

moment.suppressDeprecationWarnings = true;
moment.locale = 'nb-NO';

export const toDate = dateString => {
    return moment(dateString, ['DD.MM.YYYY', 'YYYY-MM-DD']).format('DD.MM.YYYY');
};

export const toDateAndTime = dateString => {
    return moment(dateString).format('DD.MM.YYYY, kk:mm');
};

export const daysBetween = (firstDate, lastDate) => {
    const first = moment(firstDate, ['DD.MM.YYYY', 'YYYY-MM-DD']);
    const last = moment(lastDate, ['DD.MM.YYYY', 'YYYY-MM-DD']);
    return Math.abs(first.diff(last, 'days'));
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
