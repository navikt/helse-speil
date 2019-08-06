'use strict';

const datecalc = require('./datecalc');

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
    expect(mapped).toEqual(new Date('2019-12-12T00:00:00.000Z'));
});
