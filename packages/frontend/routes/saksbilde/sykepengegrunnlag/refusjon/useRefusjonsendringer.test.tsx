import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useRefusjonsendringer } from './useRefusjonsendringer';

import type { Endring, Refusjon } from '@io/graphql';

test('viser innslag etter arbeidsgiverperioder', () => {
    const refusjon: Refusjon = {
        arbeidsgiverperioder: [
            {
                fom: '2020-01-01',
                tom: '2020-01-16',
            },
            {
                fom: '2020-01-20',
                tom: '2020-01-31',
            },
        ],
        endringer: [
            {
                dato: '2020-01-10',
                belop: 31000,
            },
            {
                dato: '2020-01-18',
                belop: 32000,
            },
            {
                dato: '2020-02-10',
                belop: 35000,
            },
        ],
        forsteFravaersdag: '2020-01-01',
        sisteRefusjonsdag: '2020-03-01',
        belop: 30000,
    };

    const expected: Array<Endring> = [
        {
            dato: '2020-02-10',
            belop: 35000,
        },
        {
            dato: '2020-01-18',
            belop: 32000,
        },
        {
            dato: '2020-01-17',
            belop: 31000,
        },
    ];

    const { result } = renderHook<{}, Array<Endring>>(() => useRefusjonsendringer(refusjon));

    expect(result.current).toEqual(expected);
});
