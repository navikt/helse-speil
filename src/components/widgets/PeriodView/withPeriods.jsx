import React from 'react';
import { toMoments } from './calc';

/* Foreløpig dummydata for testing */

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

        const periods = toMoments(data);

        return <Component periods={periods} {...props} />;
    };
};
