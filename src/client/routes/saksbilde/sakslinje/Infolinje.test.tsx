import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import { Vedtaksperiode } from 'internal-types';
import React from 'react';
import { RecoilRoot } from 'recoil';
import { mappetVedtaksperiode } from 'test-data';

import { persondataSkalAnonymiseres } from '../../../state/person';

import { Infolinje } from './Infolinje';

const enVedtaksperiode = mappetVedtaksperiode(dayjs('2020-01-01'), dayjs('2020-01-31'));

describe('Infolinje', () => {
    test('viser fom og tom', () => {
        render(
            <RecoilRoot initializeState={({ set }) => set(persondataSkalAnonymiseres, false)}>
                <Infolinje
                    arbeidsgivernavn={enVedtaksperiode.arbeidsgivernavn}
                    arbeidsgiverOrgnr={enVedtaksperiode.inntektsgrunnlag.organisasjonsnummer}
                    fom={enVedtaksperiode.fom}
                    tom={enVedtaksperiode.tom}
                    skjæringstidspunkt={enVedtaksperiode.vilkår?.dagerIgjen.skjæringstidspunkt}
                    maksdato={enVedtaksperiode.vilkår?.dagerIgjen.maksdato}
                    over67År={(enVedtaksperiode.vilkår?.alder.alderSisteSykedag ?? 0) >= 67}
                />
            </RecoilRoot>
        );
        expect(screen.getByText('01.01.20 - 31.01.20')).toBeVisible();
    });
    test('viser skjæringstidspunkt', () => {
        render(
            <RecoilRoot initializeState={({ set }) => set(persondataSkalAnonymiseres, false)}>
                <Infolinje
                    arbeidsgivernavn={enVedtaksperiode.arbeidsgivernavn}
                    arbeidsgiverOrgnr={enVedtaksperiode.inntektsgrunnlag.organisasjonsnummer}
                    fom={enVedtaksperiode.fom}
                    tom={enVedtaksperiode.tom}
                    skjæringstidspunkt={enVedtaksperiode.vilkår?.dagerIgjen.skjæringstidspunkt}
                    maksdato={enVedtaksperiode.vilkår?.dagerIgjen.maksdato}
                    over67År={(enVedtaksperiode.vilkår?.alder.alderSisteSykedag ?? 0) >= 67}
                />
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
            <RecoilRoot initializeState={({ set }) => set(persondataSkalAnonymiseres, false)}>
                <Infolinje
                    arbeidsgivernavn={over67.arbeidsgivernavn}
                    arbeidsgiverOrgnr={over67.inntektsgrunnlag.organisasjonsnummer}
                    fom={over67.fom}
                    tom={over67.tom}
                    skjæringstidspunkt={over67.vilkår?.dagerIgjen.skjæringstidspunkt}
                    maksdato={over67.vilkår?.dagerIgjen.maksdato}
                    over67År={(over67.vilkår?.alder.alderSisteSykedag ?? 0) >= 67}
                />
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
            <RecoilRoot initializeState={({ set }) => set(persondataSkalAnonymiseres, false)}>
                <Infolinje
                    arbeidsgivernavn={under67.arbeidsgivernavn}
                    arbeidsgiverOrgnr={under67.inntektsgrunnlag.organisasjonsnummer}
                    fom={under67.fom}
                    tom={under67.tom}
                    skjæringstidspunkt={under67.vilkår?.dagerIgjen.skjæringstidspunkt}
                    maksdato={under67.vilkår?.dagerIgjen.maksdato}
                    over67År={(under67.vilkår?.alder.alderSisteSykedag ?? 0) >= 67}
                />
            </RecoilRoot>
        );
        expect(screen.queryByText('§ 8-51')).toBeNull();
    });
});
