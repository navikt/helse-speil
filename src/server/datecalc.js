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

module.exports = {
    isWithin3Months: isWithin3Months
};
