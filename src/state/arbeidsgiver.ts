import dayjs from 'dayjs';
import { useMemo } from 'react';

import {
    Arbeidsforholdoverstyring,
    ArbeidsgiverFragment,
    BeregnetPeriodeFragment,
    Dagoverstyring,
    Generasjon,
    GhostPeriodeFragment,
    Hendelse,
    Inntektoverstyring,
    Maybe,
    OverstyringFragment,
    PersonFragment,
    SelvstendigNaering,
    UberegnetPeriodeFragment,
} from '@io/graphql';
import { OverstyringForInntektsforhold } from '@saksbilde/historikk/state';
import { useInntektOgRefusjon } from '@state/overstyring';
import { useActivePeriod } from '@state/periode';
import { harBlittUtbetaltTidligere } from '@state/selectors/period';
import { isGodkjent } from '@state/selectors/utbetaling';
import { Refusjonsopplysning } from '@typer/overstyring';
import { ActivePeriod, DateString } from '@typer/shared';
import { ISO_DATOFORMAT } from '@utils/date';
import {
    isArbeidsforholdoverstyring,
    isBeregnetPeriode,
    isDagoverstyring,
    isGhostPeriode,
    isInntektoverstyring,
    isUberegnetPeriode,
} from '@utils/typeguards';

export const useCurrentArbeidsgiver = (person: Maybe<PersonFragment>): Maybe<ArbeidsgiverFragment> => {
    const activePeriod = useActivePeriod(person);
    return finnArbeidsgiverForPeriode(person?.arbeidsgivere ?? [], activePeriod);
};

export const usePeriodForSkjæringstidspunktForArbeidsgiver = (
    person: PersonFragment,
    skjæringstidspunkt: Maybe<DateString>,
    organisasjonsnummer: string,
): Maybe<ActivePeriod> => {
    const aktivPeriode = useActivePeriod(person);
    const currentArbeidsgiver = useCurrentArbeidsgiver(person);
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning(person);

    if (!skjæringstidspunkt || aktivPeriode == null || currentArbeidsgiver == null) return null;

    const forrigeEllerNyesteGenerasjon = finnNteEllerNyesteGenerasjon(aktivPeriode, currentArbeidsgiver);
    const arbeidsgiver = finnArbeidsgiver(person, organisasjonsnummer);

    const arbeidsgiverEierForrigeEllerNyesteGenerasjon = arbeidsgiver?.generasjoner.some(
        (g) => g.id === forrigeEllerNyesteGenerasjon?.id,
    );

    const arbeidsgiverGhostPerioder =
        arbeidsgiver?.ghostPerioder.filter((it) => it.skjaeringstidspunkt === skjæringstidspunkt) ?? [];

    const arbeidsgiverPerioder = arbeidsgiverEierForrigeEllerNyesteGenerasjon
        ? (forrigeEllerNyesteGenerasjon?.perioder.filter((it) => it.skjaeringstidspunkt === skjæringstidspunkt) ?? [])
        : [];
    if (arbeidsgiverPerioder.length === 0 && arbeidsgiverGhostPerioder.length === 0) {
        return null;
    }
    const arbeidsgiverBeregnedePerioder: Array<BeregnetPeriodeFragment> = arbeidsgiverPerioder.filter((it) =>
        isBeregnetPeriode(it),
    ) as Array<BeregnetPeriodeFragment>;

    if (arbeidsgiverBeregnedePerioder.length === 0 && isGhostPeriode(arbeidsgiverGhostPerioder[0])) {
        return arbeidsgiverGhostPerioder[0] ?? null;
    }

    const periodeTilGodkjenning = finnPeriodeTilGodkjenning(person);
    const harSammeSkjæringstidspunkt = skjæringstidspunkt === periodeTilGodkjenning?.skjaeringstidspunkt;

    const aktivArbeidsgiverHarAktivPeriode = arbeidsgiverBeregnedePerioder.some(
        (it) => it.id === periodeTilGodkjenning?.id,
    );

    if (
        periodeTilGodkjenning &&
        aktivArbeidsgiverHarAktivPeriode &&
        erAktivPeriodeLikEllerFørPeriodeTilGodkjenning &&
        harSammeSkjæringstidspunkt
    )
        return periodeTilGodkjenning as ActivePeriod;

    const overstyrbareArbeidsgiverPerioder = arbeidsgiverPerioder
        .filter((it) => isBeregnetPeriode(it) || isUberegnetPeriode(it))
        .sort((a, b) => new Date(a.fom).getTime() - new Date(b.fom).getTime());
    const nyesteBeregnetPeriodePåSkjæringstidspunkt = (overstyrbareArbeidsgiverPerioder
        ?.filter((it) => isBeregnetPeriode(it))
        .pop() ?? null) as Maybe<ActivePeriod>;
    const nyestePeriodePåSkjæringstidspunkt = (overstyrbareArbeidsgiverPerioder?.pop() ?? null) as Maybe<ActivePeriod>;

    return nyesteBeregnetPeriodePåSkjæringstidspunkt ?? nyestePeriodePåSkjæringstidspunkt;
};

export const useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning = (person: PersonFragment): boolean => {
    const aktivPeriode = useActivePeriod(person);
    const currentArbeidsgiver = useCurrentArbeidsgiver(person);
    if (!aktivPeriode || !currentArbeidsgiver) return false;

    const generasjon = finnNteEllerNyesteGenerasjon(aktivPeriode, currentArbeidsgiver);

    if (!aktivPeriode || generasjon?.id !== currentArbeidsgiver.generasjoner[0]?.id) return false;

    const periodeTilGodkjenning = finnPeriodeTilGodkjenning(person);
    return periodeTilGodkjenning ? dayjs(aktivPeriode.fom).isSameOrBefore(periodeTilGodkjenning?.tom) : true;
};

export const useErGhostLikEllerFørPeriodeTilGodkjenning = (person: PersonFragment): boolean => {
    const aktivPeriode = useActivePeriod(person);
    if (!aktivPeriode) return false;

    const periodeTilGodkjenning = finnPeriodeTilGodkjenning(person);
    return periodeTilGodkjenning
        ? dayjs(aktivPeriode.fom).isSameOrBefore(periodeTilGodkjenning?.skjaeringstidspunkt) ||
              dayjs(aktivPeriode.fom).isSameOrBefore(periodeTilGodkjenning?.fom)
        : true;
};

type UseEndringerForPeriodeResult = {
    inntektsendringer: Inntektoverstyring[];
    arbeidsforholdendringer: Arbeidsforholdoverstyring[];
    dagendringer: Dagoverstyring[];
};

export const useEndringerForPeriode = (
    endringer: Array<OverstyringFragment> | undefined,
    person: PersonFragment,
): UseEndringerForPeriodeResult => {
    const periode = useActivePeriod(person);

    if (!endringer || !periode) {
        return {
            inntektsendringer: [],
            arbeidsforholdendringer: [],
            dagendringer: [],
        };
    }

    if (isGhostPeriode(periode)) {
        const arbeidsforhold = endringer
            .filter((it) => dayjs(periode.skjaeringstidspunkt).isSameOrBefore(it.timestamp))
            .filter(isArbeidsforholdoverstyring);

        const inntekter = endringer
            .filter((it) => dayjs(periode.skjaeringstidspunkt).isSameOrBefore(it.timestamp))
            .filter(isInntektoverstyring);

        return {
            inntektsendringer: inntekter,
            arbeidsforholdendringer: arbeidsforhold,
            dagendringer: [],
        };
    }

    const inntekter = endringer
        .filter((it) => dayjs(periode.skjaeringstidspunkt).isSameOrBefore(it.timestamp))
        .filter(isInntektoverstyring);

    const arbeidsforhold = endringer
        .filter((it) => dayjs((periode as BeregnetPeriodeFragment).skjaeringstidspunkt).isSameOrBefore(it.timestamp))
        .filter(isArbeidsforholdoverstyring);

    const dager = endringer
        .filter((it) => dayjs(periode.skjaeringstidspunkt).isSameOrBefore(it.timestamp))
        .filter(isDagoverstyring);

    return {
        inntektsendringer: inntekter,
        arbeidsforholdendringer: arbeidsforhold,
        dagendringer: dager,
    };
};

export const useDagoverstyringer = (
    fom: DateString,
    tom: DateString,
    arbeidsgiver?: Maybe<ArbeidsgiverFragment>,
): Array<Dagoverstyring> => {
    return useMemo(() => {
        if (!arbeidsgiver) return [];

        const start = dayjs(fom);
        const end = dayjs(tom);
        return arbeidsgiver.overstyringer.filter(isDagoverstyring).filter((overstyring) =>
            overstyring.dager.some((dag) => {
                const dato = dayjs(dag.dato);
                return dato.isSameOrAfter(start) && dato.isSameOrBefore(end);
            }),
        );
    }, [arbeidsgiver, fom, tom]);
};

export const useHarDagOverstyringer = (
    periode: BeregnetPeriodeFragment | UberegnetPeriodeFragment,
    person: PersonFragment,
): boolean => {
    const arbeidsgiver = useCurrentArbeidsgiver(person);
    const dagendringer = useDagoverstyringer(periode.fom, periode.tom, arbeidsgiver);

    if (!arbeidsgiver) {
        return false;
    }

    return !harBlittUtbetaltTidligere(periode, arbeidsgiver) && (dagendringer?.length ?? 0) > 0;
};

export const useLokaleRefusjonsopplysninger = (
    organisasjonsnummer: string,
    skjæringstidspunkt: string,
): Refusjonsopplysning[] => {
    const lokaleInntektoverstyringer = useInntektOgRefusjon();

    if (lokaleInntektoverstyringer.skjæringstidspunkt !== skjæringstidspunkt) return [];

    return (
        lokaleInntektoverstyringer.arbeidsgivere
            .filter((it) => it.organisasjonsnummer === organisasjonsnummer)?.[0]
            ?.refusjonsopplysninger?.map((refusjonsopplysning) => {
                return { ...refusjonsopplysning } as Refusjonsopplysning;
            }) ?? []
    );
};

export const useLokaltMånedsbeløp = (organisasjonsnummer: string, skjæringstidspunkt: string): Maybe<number> => {
    const lokaleInntektoverstyringer = useInntektOgRefusjon();

    if (lokaleInntektoverstyringer.skjæringstidspunkt !== skjæringstidspunkt) return null;

    return (
        lokaleInntektoverstyringer.arbeidsgivere.filter((it) => it.organisasjonsnummer === organisasjonsnummer)?.[0]
            ?.månedligInntekt ?? null
    );
};

export const dedupliserteInntektsmeldingHendelser = (arbeidsgiver: Maybe<ArbeidsgiverFragment>): Hendelse[] => {
    if (!arbeidsgiver) return [];

    // Ja, det er litt rotete kode for å deduplisere hendelser-lista, men
    // tenker det er verdt det siden det ikke er så lett å oppdage at det vil
    // kunne være duplikater i lista.
    // Kan ikke gå via Set fordi like hendelser er distinkte objekter - det
    // knepet funker bare på primitiver.

    const hendelser = new Map<string, Hendelse>();
    arbeidsgiver.generasjoner
        .flatMap((g) => g.perioder.flatMap((p) => p.hendelser))
        .forEach((h) => {
            hendelser.set(h.id, h);
        });
    const hendelserDeduplisert = [...hendelser.values()];

    return hendelserDeduplisert.filter((h) => h.type === 'INNTEKTSMELDING');
};

export const finnPeriodeTilGodkjenning = (person: Maybe<PersonFragment>): Maybe<BeregnetPeriodeFragment> => {
    if (!person) return null;

    return (
        (person.arbeidsgivere
            ?.flatMap((arbeidsgiver) => arbeidsgiver.generasjoner[0]?.perioder)
            .filter(
                (periode) => isBeregnetPeriode(periode) && periode.periodetilstand === 'TilGodkjenning',
            )?.[0] as BeregnetPeriodeFragment) ?? null
    );
};

export const finnArbeidsgiver = (person: PersonFragment, organisasjonsnummer: string): Maybe<ArbeidsgiverFragment> =>
    person.arbeidsgivere.find((it) => it.organisasjonsnummer === organisasjonsnummer) ?? null;

export const harNyereUtbetaltPeriodePåPerson = (period: BeregnetPeriodeFragment, person: PersonFragment): boolean => {
    const nyesteUtbetaltPeriodePåPerson = person.arbeidsgivere
        .flatMap((it) => it.generasjoner[0]?.perioder)
        .filter((periode) => isBeregnetPeriode(periode) && isGodkjent(periode.utbetaling))
        .pop();

    return dayjs(nyesteUtbetaltPeriodePåPerson?.fom, ISO_DATOFORMAT).isAfter(dayjs(period.tom, ISO_DATOFORMAT));
};

export const findArbeidsgiverWithGhostPeriode = (
    period: GhostPeriodeFragment,
    arbeidsgivere: Array<ArbeidsgiverFragment>,
): Maybe<ArbeidsgiverFragment> => {
    return (
        arbeidsgivere.find((arbeidsgiver) => arbeidsgiver.ghostPerioder.find((periode) => periode.id === period.id)) ??
        null
    );
};

export const finnArbeidsgiverForPeriode = (arbeidsgivere: ArbeidsgiverFragment[], periode: ActivePeriod | null) => {
    if (!periode) {
        return null;
    } else if (isBeregnetPeriode(periode) || isUberegnetPeriode(periode)) {
        return findArbeidsgiverWithPeriode(periode, arbeidsgivere);
    } else if (isGhostPeriode(periode)) {
        return findArbeidsgiverWithGhostPeriode(periode, arbeidsgivere);
    }

    return null;
};

const findArbeidsgiverWithPeriode = (
    period: ActivePeriod,
    arbeidsgivere: Array<ArbeidsgiverFragment>,
): Maybe<ArbeidsgiverFragment> => {
    return (
        arbeidsgivere.find((arbeidsgiver) =>
            arbeidsgiver.generasjoner
                .flatMap((generasjon) => generasjon.perioder)
                .filter(
                    (periode): periode is UberegnetPeriodeFragment | BeregnetPeriodeFragment =>
                        isUberegnetPeriode(period) || isBeregnetPeriode(periode),
                )
                .find((periode: UberegnetPeriodeFragment | BeregnetPeriodeFragment) => periode.id === period.id),
        ) ?? null
    );
};

const findSelvstendigWithPeriode = (
    periode: ActivePeriod,
    selvstendig: SelvstendigNaering | null,
): SelvstendigNaering | null =>
    selvstendig?.generasjoner
        .flatMap((generasjon) => generasjon.perioder)
        .some(
            (enPeriode) => isUberegnetPeriode(periode) || (isBeregnetPeriode(enPeriode) && enPeriode.id === periode.id),
        )
        ? selvstendig
        : null;

export const finnGenerasjonerForAktivPeriode = (periode: ActivePeriod, person: PersonFragment): Generasjon[] => {
    const arbeidsgiver = findArbeidsgiverWithPeriode(periode, person.arbeidsgivere);
    const selvstendig = findSelvstendigWithPeriode(periode, person.selvstendigNaering);

    if (arbeidsgiver?.organisasjonsnummer === 'SELVSTENDIG') {
        return selvstendig?.generasjoner ?? [];
    }
    return arbeidsgiver?.generasjoner ?? [];
};

export const finnOverstyringerForAktivInntektsforhold = (aktivPeriode: ActivePeriod, person: Maybe<PersonFragment>) => {
    const arbeidsgiver = findArbeidsgiverWithPeriode(aktivPeriode, person?.arbeidsgivere ?? []);
    const selvstendig = findSelvstendigWithPeriode(aktivPeriode, person?.selvstendigNaering ?? null);

    const arbeidsgiverOverstyringer =
        arbeidsgiver?.organisasjonsnummer === 'SELVSTENDIG' ? [] : (arbeidsgiver?.overstyringer ?? []);
    const selvstendigOverstyringer = selvstendig?.overstyringer ?? [];
    return [...arbeidsgiverOverstyringer, ...selvstendigOverstyringer];
};

export const finnOverstyringerForAlleInntektsforhold = (
    person: Maybe<PersonFragment>,
): OverstyringForInntektsforhold[] => {
    return [
        ...(person?.arbeidsgivere
            // Ignorer selvstendig næring fra arbeidsgiverlisten når vi tar i bruk selvstendig feltet på person. Dette for å unngå duplikater.
            .filter((arbeidsgiver) => arbeidsgiver.organisasjonsnummer !== 'SELVSTENDIG')
            .map((arbeidsgiver) => ({
                navn: arbeidsgiver.navn,
                organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
                overstyringer: arbeidsgiver.overstyringer,
            })) ?? []),
        {
            navn: 'SELVSTENDIG',
            organisasjonsnummer: 'SELVSTENDIG',
            overstyringer: person?.selvstendigNaering?.overstyringer ?? [],
        },
    ];
};

/**
 * Henter forrige (eldre) generasjon relativt til generasjonen som inneholder den oppgitte perioden.
 *
 * Generasjoner er lagret i omvendt kronologisk rekkefølge (indeks 0 = nyeste).
 *
 * Regler:
 * 1. Finn generasjonen som inneholder perioden (matcher `id` i beregnet eller uberegnet perioder).
 * 2. Hvis ingen generasjon inneholder perioden: returner nyeste generasjon (indeks 0), eller `null` hvis ingen finnes.
 * 3. Hvis generasjon finnes: returner neste (eldre) generasjon (`index + 1`), eller `null` hvis den ikke finnes.
 *
 * @param periode Perioden som identifiserer aktiv generasjon.
 * @param arbeidsgiver Arbeidsgiver som eier generasjonene.
 * @returns Forrige generasjon hvis perioden finnes, nyeste hvis ikke, ellers `null`.
 */
export const finnForrigeEllerNyesteGenerasjon = (
    periode: ActivePeriod,
    arbeidsgiver: ArbeidsgiverFragment,
): Maybe<Generasjon> => finnNteEllerNyesteGenerasjon(periode, arbeidsgiver, 1);

/**
 * Henter en generasjon relativt til generasjonen som inneholder den oppgitte perioden.
 *
 * Generasjoner er lagret i omvendt kronologisk rekkefølge (indeks 0 = nyeste).
 *
 * Regler:
 * 1. Finn generasjonen som inneholder perioden (matcher `id` i beregnet eller uberegnet perioder).
 * 2. Hvis ingen generasjon inneholder perioden: returnerer alltid nyeste generasjon (indeks 0), eller `null` hvis ingen finnes (parameter \`n\` ignoreres i dette tilfellet).
 * 3. Hvis generasjon finnes: returner generasjonen med offset \`n\` (aktiv = 0, eldre = 1, nyere = -1 osv.). Faller utenfor indeks -> `null`.
 *
 * @internal
 * @param periode Perioden som identifiserer aktiv generasjon.
 * @param arbeidsgiver Arbeidsgiver som eier generasjonene.
 * @param n Offset: 0 = aktiv, 1 = forrige (eldre), -1 = neste (nyere), >1 flere steg tilbake, <-1 flere steg frem.
 * @returns Generasjonen bestemt av offset, nyeste hvis aktiv ikke finnes, eller `null`.
 */
const finnNteEllerNyesteGenerasjon = (
    periode: ActivePeriod,
    arbeidsgiver: ArbeidsgiverFragment,
    n: number = 0,
): Maybe<Generasjon> => {
    const aktivGenerasjonIndex = arbeidsgiver.generasjoner.findIndex((g) =>
        g.perioder.some((p) => isBeregnetPeriode(periode) && p.id === periode.id),
    );
    return (
        (aktivGenerasjonIndex < 0
            ? arbeidsgiver.generasjoner[0]
            : arbeidsgiver.generasjoner[aktivGenerasjonIndex + n]) ?? null
    );
};
