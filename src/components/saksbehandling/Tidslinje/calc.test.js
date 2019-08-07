import { daysBetween, extractDates, toMoments, yearsBetween } from './calc';
import moment from 'moment';

moment.suppressDeprecationWarnings = true;

const data = [
    {
        label: 'Bekk AS',
        periods: [
            {
                startDate: '2018-04-05',
                endDate: '2018-04-22'
            },
            {
                startDate: '2019-04-12',
                endDate: '2019-04-15'
            },
            {
                startDate: '2019-05-10',
                endDate: '2019-06-15'
            }
        ]
    },
    {
        label: 'Universitetet i Oslo',
        periods: [
            {
                startDate: '2018-10-01',
                endDate: '2018-10-10'
            },
            {
                startDate: '2018-11-10',
                endDate: '2018-11-17'
            }
        ]
    },
    {
        label: 'Nav',
        periods: [
            {
                startDate: '2015-02-01',
                endDate: '2015-05-25'
            },
            {
                startDate: '2016-10-01',
                endDate: '2016-10-30'
            },
            {
                startDate: '2017-11-01',
                endDate: '2017-11-25'
            }
        ]
    },
    {
        label: 'Rema 1000',
        periods: [
            {
                startDate: '2015-06-10',
                endDate: '2016-08-13'
            },
            {
                startDate: '2017-05-15',
                endDate: '2017-07-13'
            }
        ]
    }
];

test('toMoments', () => {
    const mappedData = toMoments(data);
    mappedData.forEach(periodData => {
        periodData.periods.forEach(period => {
            expect(period.startDate._isAMomentObject).toBeTruthy();
            expect(period.endDate._isAMomentObject).toBeTruthy();
        });
    });
});

test('daysBetween', () => {
    expect(daysBetween(moment('2019-01-01'), moment('2019-01-10'))).toEqual(9);
    expect(daysBetween(moment('2010-01-20'), moment('2010-02-10'))).toEqual(21);
    expect(daysBetween(moment('denne burde'), moment('ikke fungere'))).toEqual(
        NaN
    );
});

test('yearsBetween', () => {
    const mappedData = toMoments(data);
    const dates = extractDates(mappedData);
    expect(yearsBetween(dates)).toEqual([2016, 2017, 2018, 2019]);

    const newPeriod = {
        startDate: moment('1950-01-01'),
        endDate: moment('2100-01-01')
    };
    dates.push(newPeriod);
    expect(yearsBetween(dates)).toEqual(
        new Array(newPeriod.endDate.year() - newPeriod.startDate.year())
            .fill(newPeriod.startDate.year())
            .map((year, i) => year + i + 1)
    );
});
