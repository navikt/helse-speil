import dayjs from 'dayjs';
// @ts-ignore
import { nanoid } from 'nanoid';

import { BeregnetPeriode, GhostPeriode } from '@io/graphql';
import {
    Inntekter,
    getInntektFraAOrdningen,
    getInntektFraInntektsmelding,
    getInntekter,
    getLatestUtbetalingTimestamp,
    getRequiredVilkårsgrunnlag,
    hasPeriod,
} from '@state/selectors/person';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enArbeidsgiverinntekt } from '@test-data/arbeidsgiverinntekt';
import { enBeregnetPeriode, enGhostPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { enUtbetaling, enVurdering } from '@test-data/utbetaling';
import { etVilkårsgrunnlagFraSpleis } from '@test-data/vilkårsgrunnlag';

describe('getInntektFraAOrdningen', () => {
    it('returnerer inntekt fra AOrdningen for en arbeidsgiver', () => {
        const arbeidsgiver = 'en-arbeidsgiver';
        const inntektFraAOrdningen = enArbeidsgiverinntekt({ arbeidsgiver }).medInntektFraAOrdningen();
        const inntektFraInntektsmelding = enArbeidsgiverinntekt({ arbeidsgiver });
        const vilkårsgrunnlag = etVilkårsgrunnlagFraSpleis().medInntekter([
            inntektFraInntektsmelding,
            inntektFraAOrdningen,
        ]);

        expect(getInntektFraAOrdningen(vilkårsgrunnlag, arbeidsgiver)).toEqual(inntektFraAOrdningen);
    });

    it('returnerer null hvis inntekt fra AOrdningen ikke finnes', () => {
        const arbeidsgiver = 'en-arbeidsgiver';
        const inntektFraInntektsmelding = enArbeidsgiverinntekt({ arbeidsgiver });
        const vilkårsgrunnlag = etVilkårsgrunnlagFraSpleis().medInntekter([inntektFraInntektsmelding]);

        expect(getInntektFraAOrdningen(vilkårsgrunnlag, arbeidsgiver)).toBeNull();
    });
});

describe('getInntektFraInntektsmelding', () => {
    it('returnerer inntekt fra inntektsmelding for en arbeidsgiver', () => {
        const arbeidsgiver = 'en-arbeidsgiver';
        const inntektFraAOrdningen = enArbeidsgiverinntekt({ arbeidsgiver }).medInntektFraAOrdningen();
        const inntektFraInntektsmelding = enArbeidsgiverinntekt({ arbeidsgiver });
        const vilkårsgrunnlag = etVilkårsgrunnlagFraSpleis().medInntekter([
            inntektFraInntektsmelding,
            inntektFraAOrdningen,
        ]);

        expect(getInntektFraInntektsmelding(vilkårsgrunnlag, arbeidsgiver)).toEqual(inntektFraInntektsmelding);
    });

    it('returnerer null hvis inntekt fra inntektsmelding ikke finnes', () => {
        const arbeidsgiver = 'en-arbeidsgiver';
        const inntektFraAOrdningen = enArbeidsgiverinntekt({ arbeidsgiver }).medInntektFraAOrdningen();
        const vilkårsgrunnlag = etVilkårsgrunnlagFraSpleis().medInntekter([inntektFraAOrdningen]);

        expect(getInntektFraInntektsmelding(vilkårsgrunnlag, arbeidsgiver)).toBeNull();
    });
});

describe('getInntekter', () => {
    it('returnerer inntekter fra inntektsmelding og AOrdningen', () => {
        const arbeidsgiver = 'en-arbeidsgiver';
        const inntektFraAOrdningen = enArbeidsgiverinntekt({ arbeidsgiver }).medInntektFraAOrdningen();
        const inntektFraInntektsmelding = enArbeidsgiverinntekt({ arbeidsgiver });
        const vilkårsgrunnlag = etVilkårsgrunnlagFraSpleis().medInntekter([
            inntektFraInntektsmelding,
            inntektFraAOrdningen,
        ]);

        const expected: Inntekter = {
            organisasjonsnummer: arbeidsgiver,
            fraInntektsmelding: inntektFraInntektsmelding,
            fraAOrdningen: inntektFraAOrdningen,
        };

        expect(getInntekter(vilkårsgrunnlag, arbeidsgiver)).toEqual(expected);
    });

    it('kaster exception om inntekt mangler fra både inntektsmeldingen og AOrdningen', () => {
        const arbeidsgiver = 'en-arbeidsgiver';
        const inntektFraInntektsmelding = enArbeidsgiverinntekt({ arbeidsgiver });
        const vilkårsgrunnlagMedInntektFraIM = etVilkårsgrunnlagFraSpleis().medInntekter([inntektFraInntektsmelding]);

        expect(getInntekter(vilkårsgrunnlagMedInntektFraIM, arbeidsgiver)).toEqual({
            organisasjonsnummer: arbeidsgiver,
            fraInntektsmelding: inntektFraInntektsmelding,
            fraAOrdningen: null,
        });

        const inntektFraAOrdningen = enArbeidsgiverinntekt({ arbeidsgiver }).medInntektFraAOrdningen();
        const vilkårsgrunnlagMedInntektFraAO = etVilkårsgrunnlagFraSpleis().medInntekter([inntektFraAOrdningen]);

        expect(getInntekter(vilkårsgrunnlagMedInntektFraAO, arbeidsgiver)).toEqual({
            organisasjonsnummer: arbeidsgiver,
            fraInntektsmelding: null,
            fraAOrdningen: inntektFraAOrdningen,
        });

        const vilkårsgrunnlagUtenInntekter = etVilkårsgrunnlagFraSpleis({ inntekter: [] });
        expect(() => getInntekter(vilkårsgrunnlagUtenInntekter, arbeidsgiver)).toThrow();
    });
});

describe('getRequiredVilkårsgrunnlag', () => {
    it('returnerer vilkårsgrunnlaget for gitt id hvis den finnes', () => {
        const grunnlag = etVilkårsgrunnlagFraSpleis();
        const person = enPerson({ vilkarsgrunnlag: [grunnlag] }) as unknown as FetchedPerson;

        expect(getRequiredVilkårsgrunnlag(person, grunnlag.id)).toEqual(grunnlag);
    });

    it('thrower når vilkårsgrunnlaget ikke finnes', () => {
        const person = enPerson() as unknown as FetchedPerson;

        expect(() => getRequiredVilkårsgrunnlag(person, nanoid())).toThrow();
    });
});

describe('hasPeriod', () => {
    it('returnerer true om personen har en gitt beregnet periode', () => {
        const periode = enBeregnetPeriode() as unknown as BeregnetPeriode;
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]) as unknown as FetchedPerson;

        expect(hasPeriod(person, periode)).toEqual(true);
    });

    it('returnerer false om personen ikke har en gitt beregnet periode', () => {
        const periode = enBeregnetPeriode() as unknown as BeregnetPeriode;
        const person = enPerson() as unknown as FetchedPerson;

        expect(hasPeriod(person, periode)).toEqual(false);
    });

    it('returnerer true om personen har en gitt ghost-periode', () => {
        const periode = enGhostPeriode() as unknown as GhostPeriode;
        const arbeidsgiver = enArbeidsgiver().medGhostPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]) as unknown as FetchedPerson;

        expect(hasPeriod(person, periode)).toEqual(true);
    });

    it('returnerer false om personen ikke har en gitt ghost-periode', () => {
        const periode = enGhostPeriode() as unknown as GhostPeriode;
        const person = enPerson() as unknown as FetchedPerson;

        expect(hasPeriod(person, periode)).toEqual(false);
    });
});

describe('getLatestUtbetalingTimestamp', () => {
    it('returnerer det siste utbetalingstidspunktet for en person', () => {
        const siste = '2022-10-01';
        const arbeidsgiverA = enArbeidsgiver().medPerioder([
            enBeregnetPeriode().medUtbetaling(enUtbetaling({ vurdering: enVurdering({ tidsstempel: '2020-01-01' }) })),
            enBeregnetPeriode().medUtbetaling(enUtbetaling({ vurdering: enVurdering({ tidsstempel: '2018-01-01' }) })),
            enBeregnetPeriode().medUtbetaling(enUtbetaling({ vurdering: enVurdering({ tidsstempel: siste }) })),
            enBeregnetPeriode().medUtbetaling(enUtbetaling({ vurdering: enVurdering({ tidsstempel: '2000-01-01' }) })),
        ]);
        const arbeidsgiverB = enArbeidsgiver().medPerioder([
            enBeregnetPeriode().medUtbetaling(enUtbetaling({ vurdering: enVurdering({ tidsstempel: '2021-01-01' }) })),
            enBeregnetPeriode().medUtbetaling(enUtbetaling({ vurdering: enVurdering({ tidsstempel: '2003-01-01' }) })),
        ]);
        const person = enPerson().medArbeidsgivere([arbeidsgiverB, arbeidsgiverA]) as FetchedPerson;

        expect(getLatestUtbetalingTimestamp(person)).toEqual(dayjs(siste));
    });

    it('returnerer 1970-01-01 dersom personen ikke har noen utbetalte utbetalinger', () => {
        const siste = dayjs('1970-01-01');
        const periodeUtenUtbetaling = enBeregnetPeriode().medUtbetaling(enUtbetaling({ vurdering: null }));
        const arbeidsgiver = enArbeidsgiver().medPerioder([periodeUtenUtbetaling]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]) as FetchedPerson;

        expect(getLatestUtbetalingTimestamp(person)).toEqual(siste);
    });
});
