import {
    ApiArbeidsgiver,
    ApiGhostPeriode,
    ApiHendelse,
    ApiPeriode,
    ApiSaksbildePerson,
} from '@io/rest/generated/spesialist.schemas';
import { finnAlleInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { useInntektOgRefusjon } from '@state/overstyring';
import { Refusjonsopplysning } from '@typer/overstyring';
import { DateString } from '@typer/shared';

/**
 * Sjekker om arbeidsgiveren har en periode med det oppgitte skjæringstidspunktet i siste behandling.
 *
 * Kallstedene bruker dette til å avgjøre om et arbeidsforhold er «uten sykdom». Den slutningen holder
 * bare for arbeidsgivere som allerede er i inntektsgrunnlaget for skjæringstidspunktet, altså de som
 * ligger i vilkårsgrunnlagets inntektsliste. Vi ser på perioder i stedet for ghost-objekter fordi Spleis
 * ikke alltid lager en ghost-periode, for eksempel når dagtypen er helg.
 */
export const harSykefraværMedSkjæringstidspunkt = (
    arbeidsgiver: ApiArbeidsgiver | null,
    skjæringstidspunkt: DateString,
): boolean =>
    !!arbeidsgiver?.behandlinger[0]?.perioder.some((periode) => periode.skjaeringstidspunkt === skjæringstidspunkt);

/**
 * Perioder ligger nyeste først, så den første treffer på skjæringstidspunktet er den siste i sykefraværstilfellet.
 */
export const finnSistePeriodeForSkjæringstidspunkt = (
    arbeidsgiver: ApiArbeidsgiver | null,
    skjæringstidspunkt: DateString,
): ApiPeriode | null =>
    arbeidsgiver?.behandlinger[0]?.perioder.find((it) => it.skjaeringstidspunkt === skjæringstidspunkt) ?? null;

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

export const erPeriodeIFørsteBehandling = (person: ApiSaksbildePerson, period: ApiPeriode): boolean =>
    !!finnAlleInntektsforhold(person).find((inntektsforhold) =>
        inntektsforhold.behandlinger[0]?.perioder.find((it) => it.id === period.id),
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
export const dedupliserteInntektsmeldingHendelser = (arbeidsgiver: ApiArbeidsgiver | null): ApiHendelse[] => {
    if (!arbeidsgiver) return [];

    const hendelser = new Map<string, ApiHendelse>();
    arbeidsgiver.behandlinger
        .flatMap((g) => g.perioder.flatMap((p) => p.hendelser))
        .forEach((h) => {
            hendelser.set(h.id, h);
        });
    const hendelserDeduplisert = [...hendelser.values()];

    return hendelserDeduplisert.filter((h) => h.hendelsetype === 'INNTEKTSMELDING');
};

export const finnArbeidsgiverForGhostPeriode = (
    person: ApiSaksbildePerson,
    periode: ApiGhostPeriode,
): ApiArbeidsgiver | undefined =>
    finnAlleArbeidsgivere(person).find((arbeidsgiver) => arbeidsgiver.ghostPerioder.find((p) => p.id === periode.id));

export const finnAlleArbeidsgivere = (person?: ApiSaksbildePerson | null): ApiArbeidsgiver[] =>
    person?.arbeidsgivere.filter((arbeidsgiver) => arbeidsgiver.organisasjonsnummer !== 'SELVSTENDIG') ?? [];

export const finnArbeidsgiverMedOrganisasjonsnummer = (
    person: ApiSaksbildePerson,
    organisasjonsnummer: string,
): ApiArbeidsgiver | null =>
    finnAlleArbeidsgivere(person).find((it) => it.organisasjonsnummer === organisasjonsnummer) ?? null;

export const useLokaltMånedsbeløp = (organisasjonsnummer: string, skjæringstidspunkt: string): number | null => {
    const lokaleInntektoverstyringer = useInntektOgRefusjon();

    if (lokaleInntektoverstyringer.skjæringstidspunkt !== skjæringstidspunkt) return null;

    return (
        lokaleInntektoverstyringer.arbeidsgivere.filter((it) => it.organisasjonsnummer === organisasjonsnummer)?.[0]
            ?.månedligInntekt ?? null
    );
};
