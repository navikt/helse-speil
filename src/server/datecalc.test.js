'use strict';

const datecalc = require('./datecalc');

test('daysBeforeIsOk', async () => {
    const oldest = new Date('2019-06-19T17:19:05.700');
    const newest = new Date('2019-09-25T23:59:59.700');
    expect(datecalc.isWithin3Months(oldest, newest)).toEqual(true);
});

test('lastMillisecondIsOk', async () => {
    const oldest = new Date('2019-06-19T17:19:05.700');
    const newest = new Date('2019-09-30T23:59:59.700');
    expect(datecalc.isWithin3Months(oldest, newest)).toEqual(true);
});

test('nextMillisecondIsNotOk', async () => {
    const oldest = new Date('2019-06-19T17:19:05.700');
    const newest = new Date('2019-10-01T00:00:00.000');
    expect(datecalc.isWithin3Months(oldest, newest)).toEqual(false);
});
