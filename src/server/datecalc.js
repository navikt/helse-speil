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

const daysBetween = (firstDate, lastDate) => {
    return Math.abs(moment(lastDate).diff(moment(firstDate), 'days'));
};

const toDate = dateString => {
    return dateString ? new Date(dateString) : null;
};

module.exports = {
    isWithin3Months,
    daysBetween,
    toDate
};
