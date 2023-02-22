import { nanoid } from 'nanoid';

import { Periodetilstand, Utbetalingtype } from '@io/graphql';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enOppgave } from '@test-data/oppgave';
import { enBeregnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { enUtbetaling } from '@test-data/utbetaling';
import { etVilkårsgrunnlagFraInfotrygd, etVilkårsgrunnlagFraSpleis } from '@test-data/vilkårsgrunnlag';

import {
    harVilkårsgrunnlagFraSpleis,
    kanRedigereInntektEllerRefusjon,
    periodeErTilGodkjenningMedOverlappendeAvsluttetPeriode,
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

describe('harVilkårsgrunnlagFraSpleis', () => {
    it('returnerer true om vilkårsgrunnlaget med gitt id kommer fra spleis', () => {
        const id = nanoid();
        const vilkårsgrunnlag = etVilkårsgrunnlagFraSpleis({ id });
        const person = enPerson({ vilkarsgrunnlag: [vilkårsgrunnlag] }) as unknown as FetchedPerson;

        expect(harVilkårsgrunnlagFraSpleis(person, id)).toEqual(true);
    });

    it('returnerer false om vilkårsgrunnlaget med gitt id ikke kommer fra spleis', () => {
        const id = nanoid();
        const vilkårsgrunnlag = etVilkårsgrunnlagFraInfotrygd({ id });
        const person = enPerson({ vilkarsgrunnlag: [vilkårsgrunnlag] }) as unknown as FetchedPerson;

        expect(harVilkårsgrunnlagFraSpleis(person, id)).toEqual(false);
    });
});

describe('periodeErTilGodkjenningMedOverlappendeAvsluttetPeriode', () => {
    it('returnerer false om perioden ikke er til godkjenning', () => {
        const periode = enBeregnetPeriode({ periodetilstand: Periodetilstand.Utbetalt });
        const person = enPerson() as unknown as FetchedPerson;

        expect(periodeErTilGodkjenningMedOverlappendeAvsluttetPeriode(periode, person)).toEqual(false);
    });

    it('returnerer false om utbetalingen til perioden er en revurdering', () => {
        const utbetalingtype = Utbetalingtype.Revurdering;
        const periodetilstand = Periodetilstand.TilGodkjenning;
        const utbetaling = enUtbetaling({ type: utbetalingtype });
        const oppgave = enOppgave();
        const periode = enBeregnetPeriode({ periodetilstand, oppgave }).medUtbetaling(utbetaling);
        const person = enPerson() as unknown as FetchedPerson;

        expect(periodeErTilGodkjenningMedOverlappendeAvsluttetPeriode(periode, person)).toEqual(false);
    });

    it('returnerer false om det ikke finnes overlappende perioder som er avsluttet', () => {
        const oppgave = enOppgave();
        const periode = enBeregnetPeriode({ periodetilstand: Periodetilstand.TilGodkjenning, oppgave });
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]) as unknown as FetchedPerson;

        expect(periodeErTilGodkjenningMedOverlappendeAvsluttetPeriode(periode, person)).toEqual(false);
    });

    it('returnerer true om det finnes overlappende perioder som er avsluttet', () => {
        const oppgave = enOppgave();
        const periodeA = enBeregnetPeriode({ periodetilstand: Periodetilstand.TilGodkjenning, oppgave });
        const periodeB = enBeregnetPeriode({ periodetilstand: Periodetilstand.Utbetalt, vedtaksperiodeId: nanoid() });
        const arbeidsgiver = enArbeidsgiver().medPerioder([periodeA, periodeB]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]) as unknown as FetchedPerson;

        expect(periodeErTilGodkjenningMedOverlappendeAvsluttetPeriode(periodeA, person)).toEqual(true);
    });
});

describe('kanRedigereInntekt', () => {
    it('returnerer false om perioden er ventende', () => {
        const periode = enBeregnetPeriode({ periodetilstand: Periodetilstand.VenterPaEnAnnenPeriode });
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        expect(kanRedigereInntektEllerRefusjon(person as unknown as FetchedPerson, arbeidsgiver, periode)).toEqual(
            false
        );
    });

    it('returnerer false om perioden er til godkjenning med overlappende avsluttet periode', () => {
        const oppgave = enOppgave();
        const periodeA = enBeregnetPeriode({ periodetilstand: Periodetilstand.TilGodkjenning, oppgave });
        const periodeB = enBeregnetPeriode({ periodetilstand: Periodetilstand.Utbetalt });
        const arbeidsgiver = enArbeidsgiver().medPerioder([periodeA, periodeB]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        expect(kanRedigereInntektEllerRefusjon(person as unknown as FetchedPerson, arbeidsgiver, periodeA)).toEqual(
            false
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
            true
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
            enUtbetaling({ arbeidsgiverFagsystemId: nanoid() })
        );
        const arbeidsgiver = enArbeidsgiver().medPerioder([periodeA, periodeB]);
        const person = enPerson({ vilkarsgrunnlag: [vilkårsgrunnlag] }).medArbeidsgivere([arbeidsgiver]);

        expect(kanRedigereInntektEllerRefusjon(person as unknown as FetchedPerson, arbeidsgiver, periodeA)).toEqual(
            false
        );
    });
});
