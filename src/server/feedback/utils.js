const moment = require('moment');

const parseDate = date => {
    return new Promise((resolve, reject) => {
        const norwegianMoment = moment(date, 'DD.MM.YYYY');
        if (norwegianMoment.isValid()) {
            resolve(norwegianMoment);
        }
        const isoMoment = moment(date, 'YYYY-MM-DD');
        if (isoMoment.isValid()) {
            resolve(isoMoment);
        }
        reject(`Det lot seg ikke gjøre å tolke '${date}' som en dato`);
    });
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
    excludeOlderFeedback,
    isInvalid
};
