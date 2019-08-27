'use strict';

const moment = require('moment');

const isWithin3Months = (oldest, newest) => {
    return moment(oldest)
        .add(4, 'month')
        .date(0)
        .hours(23)
        .minutes(59)
        .seconds(59)
        .milliseconds(999)
        .isSameOrAfter(moment(newest));
};

const calendarDaysBetween = (firstDate, lastDate) => {
    return Math.abs(moment(lastDate).diff(moment(firstDate), 'days')) + 1;
};

const workdaysBetween = (firstDate, lastDate) => {
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

const toDate = dateString => {
    return dateString ? new Date(dateString) : null;
};

const newestTom = objs => newestDate(objs.map(obj => obj.tom));

const newestDate = objs => {
    return objs.reduce((max, date) => {
        return toDate(date) > toDate(max) ? date : max;
    }, objs[0]);
};

module.exports = {
    isWithin3Months,
    workdaysBetween,
    calendarDaysBetween,
    newestTom,
    toDate
};
