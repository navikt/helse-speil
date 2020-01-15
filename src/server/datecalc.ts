'use strict';

import moment, { Moment } from 'moment';

const isWithin3Months = (oldest: string | Date, newest: string | Date): boolean => {
    return moment(oldest)
        .add(4, 'month')
        .date(0)
        .hours(23)
        .minutes(59)
        .seconds(59)
        .milliseconds(999)
        .isSameOrAfter(moment(newest));
};

const calendarDaysBetween = (firstDate: string | Moment, lastDate: string | Moment): number => {
    return Math.abs(moment(lastDate).diff(moment(firstDate), 'days')) + 1;
};

const workdaysBetween = (firstDate: string | Moment, lastDate: string | Moment) => {
    const firstMoment = moment(firstDate);
    const lastMoment = moment(lastDate);

    const tempDate = firstMoment.clone();
    let numberOfDays = 0;
    while (tempDate <= lastMoment) {
        if (tempDate.isoWeekday() <= 5) {
            numberOfDays++;
        }
        tempDate.add(1, 'days');
    }
    return numberOfDays;
};

const toDate = (dateString?: string): Date | null => (dateString ? new Date(dateString) : null);

const newestTom = (items: { tom: string }[]) => newestDate(items.map(obj => obj.tom));

const newestDate = (dates: string[]) => {
    return dates.reduce((max, date) => {
        return toDate(date)! > toDate(max)! ? date : max;
    }, dates[0]);
};

export default {
    isWithin3Months,
    workdaysBetween,
    calendarDaysBetween,
    newestTom,
    toDate
};
