import dayjs from 'dayjs';

import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import {
    ArbeidsgiverFragment,
    BeregnetPeriodeFragment,
    Maybe,
    Periode,
    Periodetilstand,
    PersonFragment,
    UberegnetPeriodeFragment,
} from '@io/graphql';
import {
    useArbeidsgiver,
    useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning,
    useErGhostLikEllerFørPeriodeTilGodkjenning,
    usePeriodForSkjæringstidspunkt,
    usePeriodForSkjæringstidspunktForArbeidsgiver,
} from '@state/arbeidsgiver';
import { isForkastet } from '@state/selectors/period';
import { BegrunnelseForOverstyring } from '@typer/overstyring';
import { DateString } from '@typer/shared';
import { isBeregnetPeriode, isGhostPeriode } from '@utils/typeguards';

export const harIngenUtbetaltePerioderFor = (person: PersonFragment, skjæringstidspunkt: DateString): boolean => {
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
                    Periodetilstand.AvventerInntektsopplysninger,
                ].includes(it.periodetilstand),
            ) ?? false
    );
};
export const harPeriodeTilBeslutterFor = (person: PersonFragment, skjæringstidspunkt: DateString): boolean => {
    return (
        (
            person?.arbeidsgivere
                .flatMap((it) => it.generasjoner[0]?.perioder)
                .filter(
                    (it) => isBeregnetPeriode(it) && it.skjaeringstidspunkt === skjæringstidspunkt,
                ) as unknown as Array<BeregnetPeriodeFragment>
        ).some((it) => it.totrinnsvurdering?.erBeslutteroppgave) ?? false
    );
};

export const useGhostInntektKanOverstyres = (
    person: PersonFragment,
    skjæringstidspunkt: DateString,
    organisasjonsnummer: string,
): boolean => {
    const period = usePeriodForSkjæringstidspunktForArbeidsgiver(person, skjæringstidspunkt, organisasjonsnummer);
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning(person);

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
    person: PersonFragment,
    skjæringstidspunkt: DateString,
): Maybe<BeregnetPeriodeFragment> => {
    return (
        (
            person?.arbeidsgivere
                .flatMap((it) => it.generasjoner[0]?.perioder)
                .filter(isBeregnetPeriode) as unknown as Array<BeregnetPeriodeFragment>
        ).find(
            (it) =>
                it.periodetilstand === Periodetilstand.TilGodkjenning && it.skjaeringstidspunkt === skjæringstidspunkt,
        ) ?? null
    );
};

export const useArbeidsforholdKanOverstyres = (
    person: PersonFragment,
    skjæringstidspunkt: DateString,
    organisasjonsnummer: string,
): boolean => {
    const period = usePeriodForSkjæringstidspunktForArbeidsgiver(person, skjæringstidspunkt, organisasjonsnummer);
    const erGhostLikEllerEtterPeriodeTilGodkjenning = useErGhostLikEllerFørPeriodeTilGodkjenning(person);
    const arbeidsgiver = useArbeidsgiver(person, organisasjonsnummer);

    if (!isGhostPeriode(period) || !person || !arbeidsgiver) {
        return false;
    }

    const perioderISisteGen: (BeregnetPeriodeFragment | UberegnetPeriodeFragment)[] =
        person?.arbeidsgivere.flatMap((it) => it.generasjoner[0]?.perioder).filter((periode) => periode != undefined) ??
        [];
    const harBeregnetPeriode = harBeregnetPeriodePåSkjæringstidspunkt(perioderISisteGen, period.skjaeringstidspunkt);
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
        harBeregnetPeriode &&
        erGhostLikEllerEtterPeriodeTilGodkjenning
    );
};

const harBeregnetPeriodePåSkjæringstidspunkt = (perioder: Array<Periode>, skjæringstidspunkt: DateString): boolean =>
    perioder.filter(isBeregnetPeriode).find((it) => it.skjaeringstidspunkt === skjæringstidspunkt) !== undefined;
const harIngenBeregnedePerioder = (arbeidsgiver: ArbeidsgiverFragment, skjæringstidspunkt: DateString): boolean =>
    (
        arbeidsgiver?.generasjoner[0]?.perioder.filter(
            (it) => it.skjaeringstidspunkt === skjæringstidspunkt && isBeregnetPeriode(it),
        ) ?? []
    ).length === 0;

const harIngenEtterfølgendePerioder = (
    arbeidsgiver: ArbeidsgiverFragment,
    skjæringstidspunkt: DateString,
    fom: DateString,
): boolean =>
    (
        arbeidsgiver?.generasjoner[0]?.perioder.filter(
            (it) => it.skjaeringstidspunkt === skjæringstidspunkt && dayjs(it.fom).isSameOrAfter(fom),
        ) ?? []
    ).length === 0;

export const useInntektKanRevurderes = (person: PersonFragment, skjæringstidspunkt: DateString): boolean => {
    const periodeVedSkjæringstidspunkt = usePeriodForSkjæringstidspunkt(skjæringstidspunkt, person);
    const isReadOnlyOppgave = useIsReadOnlyOppgave(person);
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning(person);

    if (!person) return false;

    const harPeriodeTilBeslutter = harPeriodeTilBeslutterFor(person, skjæringstidspunkt);

    return (
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
