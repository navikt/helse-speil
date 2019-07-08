/* eslint-disable no-console */
import React from 'react';
import { toMoments } from './calc';
import { toDate } from '../../../utils/date';

/* Foreløpig dummydata for testing */

export const Status = {
    ACCEPTED: 'accepted',
    DENIED: 'denied'
};

const randomStatus = () =>
    Math.floor(Math.random() * Math.floor(10)) < 8
        ? Status.ACCEPTED
        : Status.DENIED;

export const withPeriods = Component => {
    return props => {
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

        const periods = toMoments(data).map(entry => ({
            ...entry,
            periods: entry.periods.map(period => ({
                ...period,
                status: randomStatus(),
                action: () =>
                    console.log(
                        `Clicked ${entry.label} ${toDate(
                            period.startDate
                        )} - ${toDate(period.endDate)}`
                    )
            }))
        }));

        return <Component periods={periods} {...props} />;
    };
};
