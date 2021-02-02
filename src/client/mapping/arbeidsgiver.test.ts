import { umappetPerson } from '../../test/data/person';
import { umappetArbeidsgiver } from '../../test/data/arbeidsgiver';
import { ArbeidsgiverBuilder } from './arbeidsgiver';
import { umappetVedtaksperiode } from '../../test/data/vedtaksperiode';
import dayjs from 'dayjs';
import { umappetInntektsgrunnlag } from '../../test/data/inntektsgrunnlag';
import { NORSK_DATOFORMAT } from '../utils/date';

describe('ArbeidsgiverBuilder', () => {
    test('markerer siste vedtaksperiode som nyeste', () => {
        const arbeidsgiverMedToVedtaksperioder = umappetArbeidsgiver([
            umappetVedtaksperiode({
                fom: dayjs('2021-01-01'),
                tom: dayjs('2021-01-10'),
            }),
            umappetVedtaksperiode({
                fom: dayjs('2021-01-11'),
                tom: dayjs('2021-01-20'),
            }),
        ]);
        const person = umappetPerson();
        const { arbeidsgiver } = new ArbeidsgiverBuilder()
            .addPerson(person)
            .addArbeidsgiver(arbeidsgiverMedToVedtaksperioder)
            .addInntektsgrunnlag([umappetInntektsgrunnlag])
            .build();

        expect(arbeidsgiver?.vedtaksperioder?.[0].erNyeste).toBeTruthy();
        expect(arbeidsgiver?.vedtaksperioder?.[1].erNyeste).toBeFalsy();
        expect(arbeidsgiver?.vedtaksperioder?.[0].fom.format(NORSK_DATOFORMAT)).toEqual('11.01.2021');
    });
});
