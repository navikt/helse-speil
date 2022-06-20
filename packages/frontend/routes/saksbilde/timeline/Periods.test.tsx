import React from 'react';
import { trimOverlappingPeriods } from './Periods';

describe('trimOverlappingPeriods', () => {
    it('trims periods overlapping fom', () => {
        const toCompare = [{ fom: '2020-01-10', tom: '2020-01-20' }];
        const toTrim = [{ fom: '2020-01-15', tom: '2020-01-25' }];

        expect(trimOverlappingPeriods(toCompare, toTrim)).toEqual([{ fom: '2020-01-21', tom: '2020-01-25' }]);
    });

    it('trims periods overlapping tom', () => {
        const toCompare = [{ fom: '2020-01-10', tom: '2020-01-20' }];
        const toTrim = [{ fom: '2020-01-05', tom: '2020-01-15' }];

        expect(trimOverlappingPeriods(toCompare, toTrim)).toEqual([{ fom: '2020-01-05', tom: '2020-01-09' }]);
    });

    it('filters out periods that are wholly contained', () => {
        const toCompare = [{ fom: '2020-01-10', tom: '2020-01-20' }];
        const toTrim = [{ fom: '2020-01-10', tom: '2020-01-20' }];

        expect(trimOverlappingPeriods(toCompare, toTrim)).toEqual([]);
    });

    it('splits periods that wholly contains another period', () => {
        const toCompare = [{ fom: '2020-01-10', tom: '2020-01-20' }];
        const toTrim = [{ fom: '2020-01-01', tom: '2020-01-30' }];

        expect(trimOverlappingPeriods(toCompare, toTrim)).toEqual([
            { fom: '2020-01-01', tom: '2020-01-09' },
            { fom: '2020-01-21', tom: '2020-01-30' },
        ]);
    });

    it('splits periods that wholly contains another period, same fom', () => {
        const toCompare = [{ fom: '2020-01-10', tom: '2020-01-20' }];
        const toTrim = [{ fom: '2020-01-10', tom: '2020-01-30' }];

        expect(trimOverlappingPeriods(toCompare, toTrim)).toEqual([{ fom: '2020-01-21', tom: '2020-01-30' }]);
    });

    it('splits periods that wholly contains another period, same tom', () => {
        const toCompare = [{ fom: '2020-01-10', tom: '2020-01-20' }];
        const toTrim = [{ fom: '2020-01-01', tom: '2020-01-20' }];

        expect(trimOverlappingPeriods(toCompare, toTrim)).toEqual([{ fom: '2020-01-01', tom: '2020-01-09' }]);
    });

    it('splits periods that wholly contains another period, multiple contained periods', () => {
        const toCompare = [
            { fom: '2020-01-10', tom: '2020-01-19' },
            { fom: '2020-01-20', tom: '2020-01-30' },
        ];
        const toTrim = [{ fom: '2020-01-01', tom: '2020-01-30' }];

        expect(trimOverlappingPeriods(toCompare, toTrim)).toEqual([{ fom: '2020-01-01', tom: '2020-01-09' }]);
    });
});
