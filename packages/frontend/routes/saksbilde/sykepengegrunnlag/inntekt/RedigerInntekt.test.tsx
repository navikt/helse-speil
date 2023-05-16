// @ts-ignore
import { nanoid } from 'nanoid';

import { Periodetilstand } from '@io/graphql';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enOppgave } from '@test-data/oppgave';
import { enBeregnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { enUtbetaling } from '@test-data/utbetaling';
import { etVilkårsgrunnlagFraInfotrygd, etVilkårsgrunnlagFraSpleis } from '@test-data/vilkårsgrunnlag';

import {
    kanRedigereInntektEllerRefusjon,
    perioderMedSkjæringstidspunktHarMaksÉnFagsystemId,
} from './RedigerInntektOgRefusjon';

describe('perioderMedSkjæringstidspunktHarKunÉnFagsystemId', () => {
    it('returnerer true om alle perioder i siste generasjon hos en arbeidsgiver som deler gitt skjæringstidspunkt har samme fagsystem-ID', () => {
        const skjaeringstidspunkt = '2021-01-02';
        const arbeidsgiverFagsystemId = 'en-fagsystem-id';
        const utbetaling = enUtbetaling({ arbeidsgiverFagsystemId });
        const periodeA = enBeregnetPeriode({ skjaeringstidspunkt }).medUtbetaling(utbetaling);
        const periodeB = enBeregnetPeriode({ skjaeringstidspunkt }).medUtbetaling(utbetaling);
        const arbeidsgiver = enArbeidsgiver().medPerioder([periodeA, periodeB]);

        expect(perioderMedSkjæringstidspunktHarMaksÉnFagsystemId(arbeidsgiver, skjaeringstidspunkt)).toEqual(true);
    });

    it('returnerer false om ikke alle perioder i siste generasjon hos en arbeidsgiver som deler gitt skjæringstidspunkt har samme fagsystem-ID', () => {
        const skjaeringstidspunkt = '2021-01-02';
        const arbeidsgiverFagsystemId = 'en-fagsystem-id';
        const utbetaling = enUtbetaling({ arbeidsgiverFagsystemId });
        const periodeA = enBeregnetPeriode({ skjaeringstidspunkt }).medUtbetaling(utbetaling);
        const periodeB = enBeregnetPeriode({ skjaeringstidspunkt });
        const arbeidsgiver = enArbeidsgiver().medPerioder([periodeA, periodeB]);

        expect(perioderMedSkjæringstidspunktHarMaksÉnFagsystemId(arbeidsgiver, skjaeringstidspunkt)).toEqual(false);
    });
});

describe('kanRedigereInntekt', () => {
    it('returnerer false om perioden er ventende', () => {
        const periode = enBeregnetPeriode({ periodetilstand: Periodetilstand.VenterPaEnAnnenPeriode });
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        expect(kanRedigereInntektEllerRefusjon(person as unknown as FetchedPerson, arbeidsgiver, periode)).toEqual(
            false,
        );
    });

    it('returnerer true selv om vilkårsgrunnlaget ikke er fra spleis', () => {
        const id = nanoid();
        const vilkårsgrunnlag = etVilkårsgrunnlagFraInfotrygd({ id });
        const oppgave = enOppgave();
        const periode = enBeregnetPeriode({
            periodetilstand: Periodetilstand.TilGodkjenning,
            oppgave,
            vilkarsgrunnlagId: id,
        });
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson({ vilkarsgrunnlag: [vilkårsgrunnlag] }).medArbeidsgivere([arbeidsgiver]);

        expect(kanRedigereInntektEllerRefusjon(person as unknown as FetchedPerson, arbeidsgiver, periode)).toEqual(
            true,
        );
    });

    it('returnerer false om perioder med samme skjæringstidspunkt inneholder andre fagsystem-IDer', () => {
        const oppgave = enOppgave();
        const id = nanoid();
        const vilkårsgrunnlag = etVilkårsgrunnlagFraSpleis({ id });
        const periodeA = enBeregnetPeriode({
            periodetilstand: Periodetilstand.TilGodkjenning,
            oppgave,
            vilkarsgrunnlagId: id,
        });
        const periodeB = enBeregnetPeriode({ periodetilstand: Periodetilstand.TilGodkjenning, oppgave }).medUtbetaling(
            enUtbetaling({ arbeidsgiverFagsystemId: nanoid() }),
        );
        const arbeidsgiver = enArbeidsgiver().medPerioder([periodeA, periodeB]);
        const person = enPerson({ vilkarsgrunnlag: [vilkårsgrunnlag] }).medArbeidsgivere([arbeidsgiver]);

        expect(kanRedigereInntektEllerRefusjon(person as unknown as FetchedPerson, arbeidsgiver, periodeA)).toEqual(
            false,
        );
    });
});
