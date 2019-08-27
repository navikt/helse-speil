'use strict';

const datecalc = require('./datecalc');

const moment = require('moment');

test('daysBeforeIsOk', () => {
    const oldest = new Date('2019-06-19T17:19:05.700');
    const newest = new Date('2019-09-25T23:59:59.700');
    expect(datecalc.isWithin3Months(oldest, newest)).toEqual(true);
});

test('lastMillisecondIsOk', () => {
    const oldest = new Date('2019-06-19T17:19:05.700');
    const newest = new Date('2019-09-30T23:59:59.700');
    expect(datecalc.isWithin3Months(oldest, newest)).toEqual(true);
});

test('nextMillisecondIsNotOk', () => {
    const oldest = new Date('2019-06-19T17:19:05.700');
    const newest = new Date('2019-10-01T00:00:00.000');
    expect(datecalc.isWithin3Months(oldest, newest)).toEqual(false);
});

test('newestTom', () => {
    const data = [
        {
            tom: '2018-01-01'
        },
        {
            tom: '2019-12-12'
        }
    ];
    const mapped = datecalc.newestTom(data);
    expect(mapped).toEqual('2019-12-12');
});

describe('calendar days between, includes both dates', () => {
    const fom = '2020-01-01';
    const tom = '2020-02-01';

    test('calculates  days given strings as input', () => {
        expect(datecalc.calendarDaysBetween(fom, tom)).toEqual(32);
    });

    test('calculates  days given moment instances as input', () => {
        let momentFom = moment(fom);
        let momentTom = moment(tom);
        expect(datecalc.calendarDaysBetween(momentFom, momentTom)).toEqual(32);
    });
});

describe('workdays between', () => {
    test('saturday to monday should only count monday', () => {
        let fom = moment('2020-01-04');
        let tom = moment('2020-01-06');
        expect(datecalc.workdaysBetween(fom, tom)).toEqual(1);
    });

    test('friday to sunday should only count friday', () => {
        let fom = moment('2020-01-03');
        let tom = moment('2020-01-05');
        expect(datecalc.workdaysBetween(fom, tom)).toEqual(1);
    });

    test('friday to sunday next week should count friday plus one week', () => {
        let fom = moment('2020-01-03');
        let tom = moment('2020-01-12');
        expect(datecalc.workdaysBetween(fom, tom)).toEqual(6);
    });

    test('one whole leap year', () => {
        let fom = moment('2020-01-01');
        let tom = moment('2020-12-31');
        expect(datecalc.workdaysBetween(fom, tom)).toEqual(366 - 52 * 2);
    });

    test('string input (ISO-8601) is accepted', () => {
        const fom = '2020-01-03';
        const tom = '2020-01-12';
        expect(datecalc.workdaysBetween(fom, tom)).toEqual(
            datecalc.workdaysBetween(moment(fom), moment(tom))
        );
    });
});
