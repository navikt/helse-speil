import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Infolinje } from './Infolinje';
import { mappetVedtaksperiode } from 'test-data';
import { Vedtaksperiode } from 'internal-types';
import dayjs from 'dayjs';
import { anonymiserPersonState } from '../../../state/person';
import { RecoilRoot } from 'recoil';

const enVedtaksperiode = mappetVedtaksperiode(dayjs('2020-01-01'), dayjs('2020-01-31'));

describe('Infolinje', () => {
    test('viser fom og tom', () => {
        render(
            <RecoilRoot initializeState={({ set }) => set(anonymiserPersonState, false)}>
                <Infolinje vedtaksperiode={enVedtaksperiode} />
            </RecoilRoot>
        );
        expect(screen.getByText('01.01.20 - 31.01.20')).toBeVisible();
    });
    test('viser skjæringstidspunkt', () => {
        render(
            <RecoilRoot initializeState={({ set }) => set(anonymiserPersonState, false)}>
                <Infolinje vedtaksperiode={enVedtaksperiode} />
            </RecoilRoot>
        );
        expect(screen.getByText('01.01.20', { exact: true })).toBeVisible();
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

        render(
            <RecoilRoot initializeState={({ set }) => set(anonymiserPersonState, false)}>
                <Infolinje vedtaksperiode={over67} />
            </RecoilRoot>
        );
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
        render(
            <RecoilRoot initializeState={({ set }) => set(anonymiserPersonState, false)}>
                <Infolinje vedtaksperiode={under67} />
            </RecoilRoot>
        );
        expect(screen.queryByText('§ 8-51')).toBeNull();
    });
});
