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
