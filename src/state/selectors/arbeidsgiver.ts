import {
    Arbeidsgiver,
    ArbeidsgiverFragment,
    BeregnetPeriodeFragment,
    Generasjon,
    GhostPeriodeFragment,
    Hendelse,
    Maybe,
    Periode,
    PersonFragment,
    SelvstendigNaering,
    UberegnetPeriodeFragment,
} from '@io/graphql';
import { Inntektsforhold } from '@state/arbeidsgiver';
import { ActivePeriod } from '@typer/shared';
import { isArbeidsgiver, isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';

export const finnAlleInntektsforhold = (person: Maybe<PersonFragment>): Inntektsforhold[] => {
    const selvstendig: SelvstendigNaering[] =
        person?.selvstendigNaering != undefined ? [person.selvstendigNaering] : [];
    const arbeidsgivere: Arbeidsgiver[] =
        person?.arbeidsgivere.filter((arbeidsgiver) => arbeidsgiver.organisasjonsnummer !== 'SELVSTENDIG') ?? [];
    return [...selvstendig, ...arbeidsgivere];
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
export const dedupliserteInntektsmeldingHendelser = (arbeidsgiver: Maybe<Arbeidsgiver>): Hendelse[] => {
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
        (finnAlleInntektsforhold(person)
            ?.flatMap((arbeidsgiver) => arbeidsgiver.generasjoner[0]?.perioder)
            .filter(
                (periode) => isBeregnetPeriode(periode) && periode.periodetilstand === 'TilGodkjenning',
            )?.[0] as BeregnetPeriodeFragment) ?? null
    );
};
export const findArbeidsgiverWithGhostPeriode = (
    period: GhostPeriodeFragment,
    inntektsforhold: Array<Inntektsforhold>,
): Maybe<Arbeidsgiver> =>
    inntektsforhold
        .filter(isArbeidsgiver)
        .find((arbeidsgiver) => arbeidsgiver.ghostPerioder.find((periode) => periode.id === period.id)) ?? null;
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
export const finnNteEllerNyesteGenerasjon = (
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

export const erPeriodeIFørsteGenerasjon = (person: PersonFragment, period: Periode): boolean =>
    !!person.arbeidsgivere.find((arbeidsgiver: Arbeidsgiver): Periode | undefined =>
        arbeidsgiver.generasjoner[0]?.perioder.find((it) => it.id === period.id),
    );

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
