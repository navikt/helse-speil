'use strict';

const isWithin3Months = (oldest, newest) => {
    const inThreeMonths = new Date(oldest);
    inThreeMonths.setMonth(inThreeMonths.getMonth() + 3 + 1);
    inThreeMonths.setDate(
        daysInMonth(inThreeMonths.getMonth() + 1, inThreeMonths.getFullYear())
    );
    inThreeMonths.setDate(0);
    inThreeMonths.setHours(23);
    inThreeMonths.setMinutes(59);
    inThreeMonths.setSeconds(59);
    inThreeMonths.setMilliseconds(999);
    return newest.getTime() <= inThreeMonths.getTime();
};

const daysInMonth = (iMonth, iYear) => {
    return new Date(iYear, iMonth, 0).getDate();
};

const daysBetween = (firstDate, lastDate) => {
    const first = new Date(firstDate);
    const last = new Date(lastDate);
    return Math.ceil(
        Math.abs((first.getTime() - last.getTime()) / (24 * 60 * 60 * 1000))
    );
};

const toDate = dateString => {
    return dateString ? new Date(dateString) : null;
};

module.exports = {
    isWithin3Months,
    daysBetween,
    toDate
};
