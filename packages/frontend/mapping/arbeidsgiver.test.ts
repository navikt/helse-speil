import { NORSK_DATOFORMAT } from '../utils/date';

import { umappetArbeidsgiver } from '../test/data/arbeidsgiver';
import { umappetInntektsgrunnlag } from '../test/data/inntektsgrunnlag';
import { umappetPerson } from '../test/data/person';
import { umappetVedtaksperiode } from '../test/data/vedtaksperiode';
import { ArbeidsgiverBuilder } from './arbeidsgiver';
import dayjs from 'dayjs';

describe('ArbeidsgiverBuilder', () => {
    test('markerer siste vedtaksperiode som nyeste', () => {
        const arbeidsgiverMedToVedtaksperioder = umappetArbeidsgiver([
            umappetVedtaksperiode({
                fom: '2021-01-01',
                tom: '2021-01-10',
            }),
            umappetVedtaksperiode({
                fom: '2021-01-11',
                tom: '2021-01-20',
            }),
        ]);
        const person = umappetPerson();
        const { arbeidsgiver } = new ArbeidsgiverBuilder()
            .addPerson(person)
            .addArbeidsgiver(arbeidsgiverMedToVedtaksperioder)
            .addInntektsgrunnlag([umappetInntektsgrunnlag()])
            .build();

        expect(arbeidsgiver?.vedtaksperioder?.[0].erNyeste).toBeTruthy();
        expect(arbeidsgiver?.vedtaksperioder?.[1].erNyeste).toBeFalsy();
        expect(arbeidsgiver?.vedtaksperioder?.[0].fom.format(NORSK_DATOFORMAT)).toEqual('11.01.2021');
    });

    test('mapper arbeidsgiver som mangler ghostperioder riktig', () => {
        const arbeidsgiverMedToVedtaksperioder = umappetArbeidsgiver(
            [
                umappetVedtaksperiode({
                    fom: '2021-01-01',
                    tom: '2021-01-10',
                }),
                umappetVedtaksperiode({
                    fom: '2021-01-11',
                    tom: '2021-01-20',
                }),
            ],
            [],
            undefined,
            undefined
        );
        const person = umappetPerson();
        const { arbeidsgiver } = new ArbeidsgiverBuilder()
            .addPerson(person)
            .addArbeidsgiver(arbeidsgiverMedToVedtaksperioder)
            .addInntektsgrunnlag([umappetInntektsgrunnlag()])
            .build();

        expect(arbeidsgiver?.tidslinjeperioderUtenSykefravær).toEqual([]);
    });

    test('mapper arbeidsgiver med ghostperioder riktig', () => {
        const arbeidsgiverMedToVedtaksperioder = umappetArbeidsgiver(
            [
                umappetVedtaksperiode({
                    fom: '2021-01-01',
                    tom: '2021-01-10',
                }),
                umappetVedtaksperiode({
                    fom: '2021-01-11',
                    tom: '2021-01-20',
                }),
            ],
            [],
            undefined,
            [
                { fom: '2018-01-01', tom: '2018-01-10' },
                { fom: '2018-01-01', tom: '2018-01-10' },
            ]
        );
        const person = umappetPerson();
        const { arbeidsgiver } = new ArbeidsgiverBuilder()
            .addPerson(person)
            .addArbeidsgiver(arbeidsgiverMedToVedtaksperioder)
            .addInntektsgrunnlag([umappetInntektsgrunnlag()])
            .build();

        expect(arbeidsgiver?.tidslinjeperioderUtenSykefravær).toEqual([
            { fom: dayjs('2018-01-01'), tom: dayjs('2018-01-10'), tilstand: 'utenSykefravær' },
            { fom: dayjs('2018-01-01'), tom: dayjs('2018-01-10'), tilstand: 'utenSykefravær' },
        ]);
    });
});
