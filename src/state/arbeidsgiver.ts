import dayjs from 'dayjs';
import { useMemo } from 'react';

import {
    Arbeidsgiver,
    ArbeidsgiverFragment,
    BeregnetPeriodeFragment,
    Dagoverstyring,
    Generasjon,
    GhostPeriodeFragment,
    Hendelse,
    Maybe,
    PersonFragment,
    SelvstendigNaering,
    UberegnetPeriodeFragment,
} from '@io/graphql';
import { finnArbeidsgiver } from '@state/arbeidsgiverHelpers';
import { useInntektOgRefusjon } from '@state/overstyring';
import { useActivePeriod } from '@state/periode';
import { harBlittUtbetaltTidligere } from '@state/selectors/period';
import { Refusjonsopplysning } from '@typer/overstyring';
import { ActivePeriod, DateString } from '@typer/shared';
import { isBeregnetPeriode, isDagoverstyring, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';

export type Inntektsforhold = Arbeidsgiver | SelvstendigNaering;

export const useAktivtInntektsforhold = (person: Maybe<PersonFragment>): Inntektsforhold | undefined => {
    const aktivPeriode = useActivePeriod(person);
    return finnInntektsforholdForPeriode(person, aktivPeriode);
};

export const finnInntektsforholdForPeriode = (
    person: Maybe<PersonFragment>,
    periode: Maybe<ActivePeriod>,
): Inntektsforhold | undefined => {
    if (!periode || !person) return undefined;
    if (isBeregnetPeriode(periode) || isUberegnetPeriode(periode)) {
        return (
            findSelvstendigWithPeriode(periode, person.selvstendigNaering) ??
            findArbeidsgiverWithPeriode(periode, person.arbeidsgivere) ??
            undefined
        );
    } else if (isGhostPeriode(periode)) {
        return findArbeidsgiverWithGhostPeriode(periode, person.arbeidsgivere) ?? undefined;
    }
    return undefined;
};

export const finnInntektsforholdForPerson = (person: Maybe<PersonFragment>): Inntektsforhold[] => {
    return person?.selvstendigNaering ? [person.selvstendigNaering] : (person?.arbeidsgivere ?? []);
};

export const usePeriodForSkjæringstidspunktForArbeidsgiver = (
    person: PersonFragment,
    skjæringstidspunkt: Maybe<DateString>,
    organisasjonsnummer: string,
): Maybe<ActivePeriod> => {
    const aktivPeriode = useActivePeriod(person);
    const arbeidsgiver = finnArbeidsgiver(person, organisasjonsnummer);
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning(person);

    if (!skjæringstidspunkt || aktivPeriode == null || arbeidsgiver == null) return null;

    const forrigeEllerNyesteGenerasjon = finnNteEllerNyesteGenerasjon(aktivPeriode, arbeidsgiver);

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
    const inntektsforhold = useAktivtInntektsforhold(person);
    if (!aktivPeriode || !inntektsforhold) return false;

    const generasjon = finnNteEllerNyesteGenerasjon(aktivPeriode, inntektsforhold);

    if (!aktivPeriode || generasjon?.id !== inntektsforhold.generasjoner[0]?.id) return false;

    const periodeTilGodkjenning = finnPeriodeTilGodkjenning(person);
    return periodeTilGodkjenning ? dayjs(aktivPeriode.fom).isSameOrBefore(periodeTilGodkjenning?.tom) : true;
};

export const useDagoverstyringer = (
    fom: DateString,
    tom: DateString,
    inntektsforhold?: Maybe<Inntektsforhold>,
): Array<Dagoverstyring> => {
    return useMemo(() => {
        if (!inntektsforhold) return [];

        const start = dayjs(fom);
        const end = dayjs(tom);
        return inntektsforhold.overstyringer.filter(isDagoverstyring).filter((overstyring) =>
            overstyring.dager.some((dag) => {
                const dato = dayjs(dag.dato);
                return dato.isSameOrAfter(start) && dato.isSameOrBefore(end);
            }),
        );
    }, [inntektsforhold, fom, tom]);
};

export const useHarDagOverstyringer = (
    periode: BeregnetPeriodeFragment | UberegnetPeriodeFragment,
    person: PersonFragment,
): boolean => {
    const inntektsforhold = useAktivtInntektsforhold(person);
    const dagendringer = useDagoverstyringer(periode.fom, periode.tom, inntektsforhold);

    if (!inntektsforhold) {
        return false;
    }

    return !harBlittUtbetaltTidligere(periode, inntektsforhold) && (dagendringer?.length ?? 0) > 0;
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

/**
 * Returnerer alle unike hendelser av type 'INNTEKTSMELDING' for en gitt arbeidsgiver.
 *
 * Bakgrunn:
 *  - Samme hendelse (identisk id) kan forekomme flere ganger fordi perioder i ulike generasjoner
 *    refererer til de samme hendelsesobjektene, men som distinkte JS-objekter.
 *  - Kan ikke gå via Set fordi like hendelser er distinkte objekter - det knepet funker bare på primitiver.
 *
 * Strategi:
 *  1. Samler alle hendelser fra alle perioder i alle generasjoner.
 *  2. Dedupliserer ved å legge dem i en Map keyed på hendelsens `id`.
 *  3. Filtrerer ned til kun hendelser av typen 'INNTEKTSMELDING'.
 *
 * @param arbeidsgiver Arbeidsgiver som kan inneholde generasjoner med perioder og hendelser.
 * @returns Liste av unike 'INNTEKTSMELDING'-hendelser (kan være tom liste).
 */
export const dedupliserteInntektsmeldingHendelser = (arbeidsgiver: Maybe<ArbeidsgiverFragment>): Hendelse[] => {
    if (!arbeidsgiver) return [];

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

export const findArbeidsgiverWithGhostPeriode = (
    period: GhostPeriodeFragment,
    arbeidsgivere: Array<ArbeidsgiverFragment>,
): Maybe<ArbeidsgiverFragment> => {
    return (
        arbeidsgivere.find((arbeidsgiver) => arbeidsgiver.ghostPerioder.find((periode) => periode.id === period.id)) ??
        null
    );
};

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

/**
 * Henter forrige (eldre) generasjon relativt til generasjonen som inneholder den oppgitte perioden.
 *
 * Generasjoner er lagret i omvendt kronologisk rekkefølge (indeks 0 = nyeste).
 *
 * @param periode Perioden som identifiserer aktiv generasjon.
 * @param inntektsforhold Arbeidsgiver som eier generasjonene.
 * @returns Forrige generasjon hvis perioden finnes, nyeste hvis ikke, ellers `null`.
 */
export const finnForrigeEllerNyesteGenerasjon = (
    periode: ActivePeriod,
    inntektsforhold: Inntektsforhold,
): Maybe<Generasjon> => finnNteEllerNyesteGenerasjon(periode, inntektsforhold, 1);

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
 * @param inntektsforhold Arbeidsgiver som eier generasjonene.
 * @param n Offset: 0 = aktiv, 1 = forrige (eldre), -1 = neste (nyere), >1 flere steg tilbake, <-1 flere steg frem.
 * @returns Generasjonen bestemt av offset, nyeste hvis aktiv ikke finnes, eller `null`.
 */
const finnNteEllerNyesteGenerasjon = (
    periode: ActivePeriod,
    inntektsforhold: Inntektsforhold,
    n: number = 0,
): Maybe<Generasjon> => {
    const aktivGenerasjonIndex = inntektsforhold.generasjoner.findIndex((g) =>
        g.perioder.some((p) => isBeregnetPeriode(periode) && p.id === periode.id),
    );
    return (
        (aktivGenerasjonIndex < 0
            ? inntektsforhold.generasjoner[0]
            : inntektsforhold.generasjoner[aktivGenerasjonIndex + n]) ?? null
    );
};

/**
 * Finn arbeidsgiveren som eier en gitt periode.
 *
 * @internal
 * @param period Aktiv periode (beregnet eller uberegnet) som skal finnes på arbeidsgiver.
 * @param arbeidsgivere Liste over arbeidsgivere som søkes i.
 * @returns Arbeidsgiver som eier perioden, eller null hvis ingen matcher.
 */
const findArbeidsgiverWithPeriode = (
    period: ActivePeriod,
    arbeidsgivere: Array<ArbeidsgiverFragment>,
): Maybe<ArbeidsgiverFragment> =>
    arbeidsgivere.find((arbeidsgiver) =>
        arbeidsgiver.generasjoner
            .flatMap((generasjon) => generasjon.perioder)
            .find((periode: UberegnetPeriodeFragment | BeregnetPeriodeFragment) => periode.id === period.id),
    ) ?? null;

/**
 * Finn selvstendig næringsdrivende som eier en gitt periode. Om det finnes selvstendig næringsforhold og dette inneholder gitt periode
 *
 * @param periode Aktiv periode som skal finnes på `selvstendig`.
 * @param selvstendig Selvstendig næringsforhold som skal inneholde perioden.
 * @returns `selvstendig` hvis perioden finnes, ellers `null`.
 */
const findSelvstendigWithPeriode = (
    periode: ActivePeriod,
    selvstendig: SelvstendigNaering | null,
): SelvstendigNaering | null =>
    selvstendig?.generasjoner
        .flatMap((generasjon) => generasjon.perioder)
        .some((enPeriode) => enPeriode.id === periode.id)
        ? selvstendig
        : null;
