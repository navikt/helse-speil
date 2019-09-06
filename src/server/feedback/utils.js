const moment = require('moment');
const { log } = require('../logging');

const parseDate = date => {
    return new Promise((resolve, reject) => {
        let fom;
        if (date !== undefined) {
            try {
                fom = convertToMoment(date);
                log(`Parsed feedback search params '${date}' to ${fom}.`);
            } catch (e) {
                console.warn(e.message);
                reject(`Det lot seg ikke gjøre å tolke '${date}' som en dato`);
            }
        }
        resolve(fom);
    });
};

const convertToMoment = dateString => {
    const norwegianMoment = moment(dateString, 'DD.MM.YYYY');
    if (norwegianMoment.isValid()) {
        return norwegianMoment;
    }
    const isoMoment = moment(dateString, 'YYYY-MM-DD');
    if (isoMoment.isValid()) {
        return isoMoment;
    }
    throw new Error('not a parseable date: ' + dateString);
};

const excludeOlderFeedback = (fom, feedback) =>
    feedback.filter(f => moment(f.value.submittedDate || -1).isAfter(fom));

const isInvalid = req => {
    return (
        !req.body.id ||
        !req.body.txt ||
        req.body.id.length === 0 ||
        req.body.id.length > 50 ||
        req.body.txt.length === 0 ||
        req.body.txt.length > 20000
    );
};

module.exports = {
    parseDate,
    convertToMoment,
    excludeOlderFeedback,
    isInvalid
};
