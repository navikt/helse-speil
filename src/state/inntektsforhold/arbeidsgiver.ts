import {
    Arbeidsgiver,
    BeregnetPeriodeFragment,
    GhostPeriodeFragment,
    Hendelse,
    Periode,
    PersonFragment,
} from '@io/graphql';
import {
    finnNteEllerNyesteBehandling,
    finnPeriodeTilGodkjenning,
    useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning,
} from '@state/inntektsforhold/inntektsforhold';
import { useInntektOgRefusjon } from '@state/overstyring';
import { useActivePeriod } from '@state/periode';
import { Refusjonsopplysning } from '@typer/overstyring';
import { ActivePeriod, DateString } from '@typer/shared';
import { isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';

export const usePeriodForSkjæringstidspunktForArbeidsgiver = (
    person: PersonFragment,
    skjæringstidspunkt: DateString | null,
    organisasjonsnummer: string,
): ActivePeriod | null => {
    const aktivPeriode = useActivePeriod(person);
    const arbeidsgiver = finnArbeidsgiverMedOrganisasjonsnummer(person, organisasjonsnummer);
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning(person);

    if (!skjæringstidspunkt || aktivPeriode == null || arbeidsgiver == null) return null;

    const forrigeEllerNyesteBehandling = finnNteEllerNyesteBehandling(aktivPeriode, arbeidsgiver);

    const arbeidsgiverEierForrigeEllerNyesteBehandling = arbeidsgiver?.behandlinger.some(
        (g) => g.id === forrigeEllerNyesteBehandling?.id,
    );

    const arbeidsgiverGhostPerioder =
        arbeidsgiver?.ghostPerioder.filter((it) => it.skjaeringstidspunkt === skjæringstidspunkt) ?? [];

    const arbeidsgiverPerioder = arbeidsgiverEierForrigeEllerNyesteBehandling
        ? (forrigeEllerNyesteBehandling?.perioder.filter((it) => it.skjaeringstidspunkt === skjæringstidspunkt) ?? [])
        : [];
    if (arbeidsgiverPerioder.length === 0 && arbeidsgiverGhostPerioder.length === 0) {
        return null;
    }
    const arbeidsgiverBeregnedePerioder: BeregnetPeriodeFragment[] = arbeidsgiverPerioder.filter((it) =>
        isBeregnetPeriode(it),
    ) as BeregnetPeriodeFragment[];

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
        .pop() ?? null) as ActivePeriod | null;
    const nyestePeriodePåSkjæringstidspunkt = (overstyrbareArbeidsgiverPerioder?.pop() ?? null) as ActivePeriod | null;

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

export const erPeriodeIFørsteBehandling = (person: PersonFragment, period: Periode): boolean =>
    !!person.arbeidsgivere.find((arbeidsgiver: Arbeidsgiver): Periode | undefined =>
        arbeidsgiver.behandlinger[0]?.perioder.find((it) => it.id === period.id),
    );

/**
 * Returnerer alle unike hendelser av type 'INNTEKTSMELDING' for en gitt arbeidsgiver.
 *
 * Bakgrunn:
 *  - Samme hendelse (identisk id) kan forekomme flere ganger fordi perioder i ulike behandlinger
 *    refererer til de samme hendelsesobjektene, men som distinkte JS-objekter.
 *  - Kan ikke gå via Set fordi like hendelser er distinkte objekter - det knepet funker bare på primitiver.
 *
 * Strategi:
 *  1. Samler alle hendelser fra alle perioder i alle behandlinger.
 *  2. Dedupliserer ved å legge dem i en Map keyed på hendelsens `id`.
 *  3. Filtrerer ned til kun hendelser av typen 'INNTEKTSMELDING'.
 *
 * @param arbeidsgiver Arbeidsgiver som kan inneholde behandlinger med perioder og hendelser.
 * @returns Liste av unike 'INNTEKTSMELDING'-hendelser (kan være tom liste).
 */
export const dedupliserteInntektsmeldingHendelser = (arbeidsgiver: Arbeidsgiver | null): Hendelse[] => {
    if (!arbeidsgiver) return [];

    const hendelser = new Map<string, Hendelse>();
    arbeidsgiver.behandlinger
        .flatMap((g) => g.perioder.flatMap((p) => p.hendelser))
        .forEach((h) => {
            hendelser.set(h.id, h);
        });
    const hendelserDeduplisert = [...hendelser.values()];

    return hendelserDeduplisert.filter((h) => h.type === 'INNTEKTSMELDING');
};

export const finnArbeidsgiverForGhostPeriode = (
    person: PersonFragment,
    periode: GhostPeriodeFragment,
): Arbeidsgiver | undefined =>
    finnAlleArbeidsgivere(person).find((arbeidsgiver) => arbeidsgiver.ghostPerioder.find((p) => p.id === periode.id));

export const finnAlleArbeidsgivere = (person?: PersonFragment | null): Arbeidsgiver[] =>
    person?.arbeidsgivere.filter((arbeidsgiver) => arbeidsgiver.organisasjonsnummer !== 'SELVSTENDIG') ?? [];

export const finnArbeidsgiverMedOrganisasjonsnummer = (
    person: PersonFragment,
    organisasjonsnummer: string,
): Arbeidsgiver | null =>
    finnAlleArbeidsgivere(person).find((it) => it.organisasjonsnummer === organisasjonsnummer) ?? null;

export const useLokaltMånedsbeløp = (organisasjonsnummer: string, skjæringstidspunkt: string): number | null => {
    const lokaleInntektoverstyringer = useInntektOgRefusjon();

    if (lokaleInntektoverstyringer.skjæringstidspunkt !== skjæringstidspunkt) return null;

    return (
        lokaleInntektoverstyringer.arbeidsgivere.filter((it) => it.organisasjonsnummer === organisasjonsnummer)?.[0]
            ?.månedligInntekt ?? null
    );
};
