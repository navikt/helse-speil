import {
    Arbeidsgiver,
    ArbeidsgiverFragment,
    BeregnetPeriodeFragment,
    GhostPeriodeFragment,
    Hendelse,
    Maybe,
    Periode,
    PersonFragment,
    UberegnetPeriodeFragment,
} from '@io/graphql';
import {
    Inntektsforhold,
    finnAlleInntektsforhold,
    finnNteEllerNyesteGenerasjon,
    finnPeriodeTilGodkjenning,
    useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning,
} from '@state/inntektsforhold/inntektsforhold';
import { useInntektOgRefusjon } from '@state/overstyring';
import { useActivePeriod } from '@state/periode';
import { Refusjonsopplysning } from '@typer/overstyring';
import { ActivePeriod, DateString } from '@typer/shared';
import { isArbeidsgiver, isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';

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

export const erPeriodeIFørsteGenerasjon = (person: PersonFragment, period: Periode): boolean =>
    !!person.arbeidsgivere.find((arbeidsgiver: Arbeidsgiver): Periode | undefined =>
        arbeidsgiver.generasjoner[0]?.perioder.find((it) => it.id === period.id),
    );

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

export const findArbeidsgiverWithGhostPeriode = (
    period: GhostPeriodeFragment,
    inntektsforhold: Array<Inntektsforhold>,
): Maybe<Arbeidsgiver> =>
    inntektsforhold
        .filter(isArbeidsgiver)
        .find((arbeidsgiver) => arbeidsgiver.ghostPerioder.find((periode) => periode.id === period.id)) ?? null;

/**
 * Finn arbeidsgiveren som eier en gitt periode.
 *
 * @internal
 * @param period Aktiv periode (beregnet eller uberegnet) som skal finnes på arbeidsgiver.
 * @param arbeidsgivere Liste over arbeidsgivere som søkes i.
 * @returns Arbeidsgiver som eier perioden, eller null hvis ingen matcher.
 */
export const findArbeidsgiverWithPeriode = (
    period: ActivePeriod,
    arbeidsgivere: Array<ArbeidsgiverFragment>,
): Maybe<ArbeidsgiverFragment> =>
    arbeidsgivere.find((arbeidsgiver) =>
        arbeidsgiver.generasjoner
            .flatMap((generasjon) => generasjon.perioder)
            .find((periode: UberegnetPeriodeFragment | BeregnetPeriodeFragment) => periode.id === period.id),
    ) ?? null;

export const finnArbeidsgiver = (person: PersonFragment, organisasjonsnummer: string): Maybe<Arbeidsgiver> =>
    finnAlleInntektsforhold(person)
        .filter(isArbeidsgiver)
        .find((it) => it.organisasjonsnummer === organisasjonsnummer) ?? null;

export const useLokaltMånedsbeløp = (organisasjonsnummer: string, skjæringstidspunkt: string): Maybe<number> => {
    const lokaleInntektoverstyringer = useInntektOgRefusjon();

    if (lokaleInntektoverstyringer.skjæringstidspunkt !== skjæringstidspunkt) return null;

    return (
        lokaleInntektoverstyringer.arbeidsgivere.filter((it) => it.organisasjonsnummer === organisasjonsnummer)?.[0]
            ?.månedligInntekt ?? null
    );
};
