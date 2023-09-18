import dayjs from 'dayjs';

import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { Arbeidsgiver, BeregnetPeriode, Maybe, Periode, Periodetilstand } from '@io/graphql';
import {
    useArbeidsgiver,
    useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning,
    usePeriodForSkjæringstidspunkt,
    usePeriodForSkjæringstidspunktForArbeidsgiver,
} from '@state/arbeidsgiver';
import { useCurrentPerson } from '@state/person';
import { isForkastet } from '@state/selectors/period';
import { overstyrInntektEnabled } from '@utils/featureToggles';
import { isBeregnetPeriode, isGhostPeriode, isUberegnetVilkarsprovdPeriode } from '@utils/typeguards';

import { BegrunnelseForOverstyring } from '../overstyring/overstyring.types';

export const harIngenUtbetaltePerioderFor = (person: FetchedPerson, skjæringstidspunkt: DateString): boolean => {
    return (
        person?.arbeidsgivere
            .flatMap((it) => it.generasjoner[0]?.perioder)
            .filter(isBeregnetPeriode)
            .filter((it) => it.skjaeringstidspunkt === skjæringstidspunkt)
            .every((it) =>
                [
                    Periodetilstand.TilGodkjenning,
                    Periodetilstand.VenterPaEnAnnenPeriode,
                    Periodetilstand.ForberederGodkjenning,
                    Periodetilstand.ManglerInformasjon,
                ].includes(it.periodetilstand),
            ) ?? false
    );
};
export const harPeriodeTilBeslutterFor = (person: FetchedPerson, skjæringstidspunkt: DateString): boolean => {
    return (
        (
            person?.arbeidsgivere
                .flatMap((it) => it.generasjoner[0]?.perioder)
                .filter(
                    (it) => isBeregnetPeriode(it) && it.skjaeringstidspunkt === skjæringstidspunkt,
                ) as unknown as Array<BeregnetPeriode>
        ).some((it) => it.totrinnsvurdering?.erBeslutteroppgave) ?? false
    );
};

export const useGhostInntektKanOverstyres = (skjæringstidspunkt: DateString, organisasjonsnummer: string): boolean => {
    const person = useCurrentPerson();
    const period = usePeriodForSkjæringstidspunktForArbeidsgiver(skjæringstidspunkt, organisasjonsnummer);
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning();

    if (!isGhostPeriode(period) || !person) {
        return false;
    }

    const periodeTilGodkjenning = maybePeriodeTilGodkjenning(person, period.skjaeringstidspunkt);

    const harUtbetaltePerioder = !harIngenUtbetaltePerioderFor(person, period.skjaeringstidspunkt);

    const harPeriodeTilBeslutter = harPeriodeTilBeslutterFor(person, period.skjaeringstidspunkt);

    return (
        (harUtbetaltePerioder || periodeTilGodkjenning !== null) &&
        !harPeriodeTilBeslutter &&
        erAktivPeriodeLikEllerFørPeriodeTilGodkjenning
    );
};

export const maybePeriodeTilGodkjenning = (
    person: FetchedPerson,
    skjæringstidspunkt: DateString,
): Maybe<BeregnetPeriode> => {
    return (
        (
            person?.arbeidsgivere
                .flatMap((it) => it.generasjoner[0]?.perioder)
                .filter(isBeregnetPeriode) as unknown as Array<BeregnetPeriode>
        ).find(
            (it) =>
                it.periodetilstand === Periodetilstand.TilGodkjenning && it.skjaeringstidspunkt === skjæringstidspunkt,
        ) ?? null
    );
};

export const useArbeidsforholdKanOverstyres = (
    skjæringstidspunkt: DateString,
    organisasjonsnummer: string,
): boolean => {
    const person = useCurrentPerson();
    const period = usePeriodForSkjæringstidspunktForArbeidsgiver(skjæringstidspunkt, organisasjonsnummer);
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning();
    const arbeidsgiver = useArbeidsgiver(organisasjonsnummer);

    if (!isGhostPeriode(period) || !person || !arbeidsgiver) {
        return false;
    }

    const perioderISisteGen = person?.arbeidsgivere.flatMap((it) => it.generasjoner[0]?.perioder);
    const harBeregnetPeriode = harBeregnetPeriodePåSkjæringstidspunkt(perioderISisteGen, period.skjaeringstidspunkt);
    const harPeriodeTilSkjønnsfastsettelse = harPeriodeTilSkjønnsfastsettelsePåSkjæringstidspunkt(
        perioderISisteGen,
        period.skjaeringstidspunkt,
    );
    const harPeriodeTilBeslutter = harPeriodeTilBeslutterFor(person, period.skjaeringstidspunkt);
    const arbeidsgiverHarIngenBeregnedePerioder = harIngenBeregnedePerioder(arbeidsgiver, skjæringstidspunkt);
    const arbeidsgiverHarIngenEtterfølgendePerioder = harIngenEtterfølgendePerioder(
        arbeidsgiver,
        skjæringstidspunkt,
        period.fom,
    );

    return (
        arbeidsgiverHarIngenBeregnedePerioder &&
        arbeidsgiverHarIngenEtterfølgendePerioder &&
        !harPeriodeTilBeslutter &&
        (harBeregnetPeriode || harPeriodeTilSkjønnsfastsettelse) &&
        erAktivPeriodeLikEllerFørPeriodeTilGodkjenning
    );
};

const harBeregnetPeriodePåSkjæringstidspunkt = (perioder: Array<Periode>, skjæringstidspunkt: DateString): boolean =>
    perioder.filter(isBeregnetPeriode).find((it) => it.skjaeringstidspunkt === skjæringstidspunkt) !== undefined;

const harPeriodeTilSkjønnsfastsettelsePåSkjæringstidspunkt = (
    perioder: Array<Periode>,
    skjæringstidspunkt: DateString,
): boolean =>
    perioder
        .filter(
            (it) => isUberegnetVilkarsprovdPeriode(it) && it.periodetilstand === Periodetilstand.TilSkjonnsfastsettelse,
        )
        .find((it) => it.skjaeringstidspunkt === skjæringstidspunkt) !== undefined;

const harIngenBeregnedePerioder = (arbeidsgiver: Arbeidsgiver, skjæringstidspunkt: DateString): boolean =>
    (
        arbeidsgiver?.generasjoner[0]?.perioder.filter(
            (it) => it.skjaeringstidspunkt === skjæringstidspunkt && isBeregnetPeriode(it),
        ) ?? []
    ).length === 0;

const harIngenEtterfølgendePerioder = (
    arbeidsgiver: Arbeidsgiver,
    skjæringstidspunkt: DateString,
    fom: DateString,
): boolean =>
    (
        arbeidsgiver?.generasjoner[0]?.perioder.filter(
            (it) => it.skjaeringstidspunkt === skjæringstidspunkt && dayjs(it.fom).isSameOrAfter(fom),
        ) ?? []
    ).length === 0;

export const useInntektKanRevurderes = (skjæringstidspunkt: DateString): boolean => {
    const person = useCurrentPerson();
    const periodeVedSkjæringstidspunkt = usePeriodForSkjæringstidspunkt(skjæringstidspunkt);
    const isReadOnlyOppgave = useIsReadOnlyOppgave();
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning();

    if (!person) return false;

    const harPeriodeTilBeslutter = harPeriodeTilBeslutterFor(person, skjæringstidspunkt);

    return (
        overstyrInntektEnabled &&
        !isForkastet(periodeVedSkjæringstidspunkt) &&
        !isReadOnlyOppgave &&
        !harPeriodeTilBeslutter &&
        erAktivPeriodeLikEllerFørPeriodeTilGodkjenning
    );
};

export const endreInntektUtenSykefraværBegrunnelser: BegrunnelseForOverstyring[] = [
    {
        id: '0',
        forklaring: 'Arbeidsforhold har vart kortere enn 3 måneder',
        lovhjemmel: {
            paragraf: '8-28',
            ledd: '3',
            bokstav: 'b',
            lovverk: 'folketrygdloven',
            lovverksversjon: '2019-01-01',
        },
    },
    {
        id: '1',
        forklaring: 'Varig lønnsendring',
        lovhjemmel: {
            paragraf: '8-28',
            ledd: '3',
            bokstav: 'c',
            lovverk: 'folketrygdloven',
            lovverksversjon: '2019-01-01',
        },
    },
    {
        id: '2',
        forklaring: 'Innrapportert feil inntekt til A-ordningen',
        lovhjemmel: { paragraf: '8-28', ledd: '5', lovverk: 'folketrygdloven', lovverksversjon: '2019-01-01' },
    },
    {
        id: '3',
        forklaring: 'Annen kilde til endring',
        lovhjemmel: { paragraf: '8-28', lovverk: 'folketrygdloven', lovverksversjon: '2019-01-01' },
    },
];

export const endreInntektMedSykefraværBegrunnelser: BegrunnelseForOverstyring[] = [
    { id: '0', forklaring: 'Korrigert inntekt i inntektsmelding' },
    { id: '1', forklaring: 'Tariffendring i inntektsmelding' },
    { id: '2', forklaring: 'Innrapportert feil inntekt til A-ordningen' },
    { id: '3', forklaring: 'Endring/opphør av refusjon' },
    { id: '4', forklaring: 'Annen kilde til endring' },
];
