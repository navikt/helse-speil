import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Infolinje } from './Infolinje';
import { mappetVedtaksperiode } from '../../../../test/data/vedtaksperiode';
import { Vedtaksperiode } from 'internal-types';
import dayjs from 'dayjs';

const enVedtaksperiode = mappetVedtaksperiode(dayjs('2020-01-01'), dayjs('2020-01-31'));

describe('Infolinje', () => {
    test('viser fom og tom', () => {
        render(<Infolinje vedtaksperiode={enVedtaksperiode} />);
        expect(screen.getByText('01.01.2020 - 31.01.2020')).toBeVisible();
    });
    test('viser skjæringstidspunkt', () => {
        render(<Infolinje vedtaksperiode={enVedtaksperiode} />);
        expect(screen.getByText('01.01.2020', { exact: true })).toBeVisible();
    });
    test('viser paragraf 8-51 ved alder 67 eller over', () => {
        const over67 = {
            ...enVedtaksperiode,
            vilkår: {
                ...enVedtaksperiode.vilkår,
                alder: {
                    alderSisteSykedag: 67,
                },
            },
        } as Vedtaksperiode;

        render(<Infolinje vedtaksperiode={over67} />);
        expect(screen.getByText('§ 8-51')).toBeVisible();
    });
    test('viser ikke paragraf 8-51 ved alder 66 eller under', () => {
        const under67 = {
            ...enVedtaksperiode,
            vilkår: {
                ...enVedtaksperiode.vilkår,
                alder: {
                    alderSisteSykedag: 66,
                },
            },
        } as Vedtaksperiode;
        render(<Infolinje vedtaksperiode={under67} />);
        expect(screen.queryByText('§ 8-51')).toBeNull();
    });
});
