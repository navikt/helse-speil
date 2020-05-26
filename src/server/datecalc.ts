'use strict';

import dayjs, { Dayjs } from 'dayjs';

const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const isoWeek = require('dayjs/plugin/isoWeek');
dayjs.extend(isSameOrAfter);
dayjs.extend(isoWeek);

const isWithin3Months = (oldest: string | Date, newest: string | Date): boolean => {
    return dayjs(oldest)
        .add(4, 'month')
        .date(0)
        .hour(23)
        .minute(59)
        .second(59)
        .millisecond(999)
        .isSameOrAfter(dayjs(newest));
};

const calendarDaysBetween = (firstDate: string | Dayjs, lastDate: string | Dayjs): number => {
    return Math.abs(dayjs(lastDate).diff(dayjs(firstDate), 'day')) + 1;
};

const workdaysBetween = (firstDate: string | Dayjs, lastDate: string | Dayjs) => {
    const first = dayjs(firstDate);
    const last = dayjs(lastDate);

    let tempDate = first.clone();
    let numberOfDays = 0;
    while (tempDate <= last) {
        if (tempDate.isoWeekday() <= 5) {
            numberOfDays++;
        }
        tempDate = tempDate.add(1, 'day');
    }
    return numberOfDays;
};

const toDate = (dateString?: string): Date | null => (dateString ? new Date(dateString) : null);

const newestTom = (items: { tom: string }[]) => newestDate(items.map((obj) => obj.tom));

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
    toDate,
};
