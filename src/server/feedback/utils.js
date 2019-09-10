'use strict';

const moment = require('moment');
const { log } = require('../logging');
const { csvMapper } = require('./feedback-csv-mapper');

const prepareCsvFeedback = (feedback, res) => {
    const csvResponse = csvMapper(feedback);
    const timestamp = moment().format('YYYY-MM-DDTHH.mm.ss');
    res.setHeader('Content-Disposition', `attachment; filename=tilbakemeldinger_${timestamp}.csv`);
    res.setHeader('Content-Type', 'text/csv');
    log(`Mapped CSV file is ${csvResponse.length} characters long.`);
    return csvResponse;
};

const parseDate = dateString => {
    let date = moment(dateString, 'DD.MM.YYYY');
    if (!date.isValid()) {
        date = moment(dateString, 'YYYY-MM-DD');
    }
    if (date.isValid()) {
        log(`Parsed feedback search params '${dateString}' to ${date}.`);
        return date;
    } else {
        console.warn('not a parseable date: ' + dateString);
    }
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
    excludeOlderFeedback,
    isInvalid,
    parseDate,
    prepareCsvFeedback
};
