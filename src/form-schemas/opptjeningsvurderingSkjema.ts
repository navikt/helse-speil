import z from 'zod/v4';

import {
    begrunnelseOgJournalpostDefaultValues,
    begrunnelseOgJournalpostFelter,
    journalpostIderTilRequest,
    sjekkJournalpost,
} from '@form-schemas/begrunnelseOgJournalpostSkjema';
import {
    ApiManuellOpptjeningsvurderingRequest,
    ApiOpptjeningsaktivitet,
} from '@io/rest/generated/vilkarsproving.schemas';

export const JaNei = {
    JA: 'JA',
    NEI: 'NEI',
} as const;

type JaNei = (typeof JaNei)[keyof typeof JaNei];

export const opptjeningsaktivitetLabels: Record<ApiOpptjeningsaktivitet, string> = {
    [ApiOpptjeningsaktivitet.ARBEID]: 'Arbeid',
    [ApiOpptjeningsaktivitet.DAGPENGER]: 'Dagpenger',
    [ApiOpptjeningsaktivitet.SYKEPENGER]: 'Sykepenger',
    [ApiOpptjeningsaktivitet.KAPITTEL_9]: 'Pleie-, omsorgs- eller opplæringspenger',
    [ApiOpptjeningsaktivitet.FORELDREPENGER]: 'Foreldrepenger',
    [ApiOpptjeningsaktivitet.SVANGERSKAPSPENGER]: 'Svangerskapspenger',
};

const likestiltYtelseKapittel: Record<ApiOpptjeningsaktivitet, number | undefined> = {
    [ApiOpptjeningsaktivitet.ARBEID]: undefined,
    [ApiOpptjeningsaktivitet.DAGPENGER]: 4,
    [ApiOpptjeningsaktivitet.SYKEPENGER]: 8,
    [ApiOpptjeningsaktivitet.KAPITTEL_9]: 9,
    [ApiOpptjeningsaktivitet.FORELDREPENGER]: 14,
    [ApiOpptjeningsaktivitet.SVANGERSKAPSPENGER]: 14,
};

// Arbeid først, deretter de likestilte ytelsene i kapittelrekkefølge
export const opptjeningsaktiviteter: ApiOpptjeningsaktivitet[] = Object.values(ApiOpptjeningsaktivitet);

export function opptjeningsaktivitetValg(aktivitet: ApiOpptjeningsaktivitet): string {
    const kapittel = likestiltYtelseKapittel[aktivitet];
    return kapittel === undefined
        ? opptjeningsaktivitetLabels[aktivitet]
        : `${opptjeningsaktivitetLabels[aktivitet]} (kap. ${kapittel})`;
}

const jaNei = z.enum([JaNei.JA, JaNei.NEI], { error: 'Svar ja eller nei' });

export type OpptjeningsvurderingSchema = z.infer<typeof opptjeningsvurderingSkjema>;

// Svar på spørsmål som ikke vises blir liggende i skjemaet, men valideres ikke og sendes ikke med
export const opptjeningsvurderingSkjema = z
    .object({
        minst4Uker: jaNei,
        opptjeningsaktiviteter: z.array(z.enum(ApiOpptjeningsaktivitet)),
        foreldrepengerOpptjentPåAap: jaNei.optional(),
        yrkesaktivMinst4UkerFørUttak: jaNei.optional(),
        ...begrunnelseOgJournalpostFelter,
    })
    .check((ctx) => {
        const svar = ctx.value;
        const aktuelle = aktuelleSpørsmål(svar);
        if (aktuelle.opptjeningsaktiviteter && svar.opptjeningsaktiviteter.length === 0) {
            ctx.issues.push({
                code: 'custom',
                message: 'Velg minst én',
                path: ['opptjeningsaktiviteter'],
                input: svar.opptjeningsaktiviteter,
            });
        }
        if (aktuelle.foreldrepengerOpptjentPåAap && svar.foreldrepengerOpptjentPåAap === undefined) {
            ctx.issues.push({
                code: 'custom',
                message: 'Svar ja eller nei',
                path: ['foreldrepengerOpptjentPåAap'],
                input: svar.foreldrepengerOpptjentPåAap,
            });
        }
        if (aktuelle.yrkesaktivMinst4UkerFørUttak && svar.yrkesaktivMinst4UkerFørUttak === undefined) {
            ctx.issues.push({
                code: 'custom',
                message: 'Svar ja eller nei',
                path: ['yrkesaktivMinst4UkerFørUttak'],
                input: svar.yrkesaktivMinst4UkerFørUttak,
            });
        }
        sjekkJournalpost(ctx);
    });

export const opptjeningsvurderingDefaultValues: Partial<OpptjeningsvurderingSchema> = {
    opptjeningsaktiviteter: [],
    ...begrunnelseOgJournalpostDefaultValues,
};

type Svar = Partial<
    Pick<
        OpptjeningsvurderingSchema,
        'minst4Uker' | 'opptjeningsaktiviteter' | 'foreldrepengerOpptjentPåAap' | 'yrkesaktivMinst4UkerFørUttak'
    >
>;

/**
 * Hvilke spørsmål som skal vises og besvares, gitt svarene over. Samme regler som backend validerer etter:
 * aktiviteter bare ved «Ja» på minst 4 uker, AAP-spørsmålet bare når foreldrepenger er valgt, og yrkesaktivitet
 * før uttak bare når foreldrepengene er opptjent på AAP.
 */
export function aktuelleSpørsmål(svar: Svar) {
    const opptjeningsaktiviteter = svar.minst4Uker === JaNei.JA;
    const foreldrepengerOpptjentPåAap =
        opptjeningsaktiviteter && (svar.opptjeningsaktiviteter ?? []).includes(ApiOpptjeningsaktivitet.FORELDREPENGER);
    const yrkesaktivMinst4UkerFørUttak = foreldrepengerOpptjentPåAap && svar.foreldrepengerOpptjentPåAap === JaNei.JA;
    return { opptjeningsaktiviteter, foreldrepengerOpptjentPåAap, yrkesaktivMinst4UkerFørUttak };
}

/** Svarene gir ikke oppfylt etter § 8-2 (scenario D og E i kodeverket). */
export function girIkkeOppfylt(svar: Svar): boolean {
    if (svar.minst4Uker === JaNei.NEI) return true;
    return aktuelleSpørsmål(svar).yrkesaktivMinst4UkerFørUttak && svar.yrkesaktivMinst4UkerFørUttak === JaNei.NEI;
}

/** Alle aktuelle spørsmål er besvart, og svarene gir oppfylt etter § 8-2 første eller andre ledd. */
export function girOppfylt(svar: Svar): boolean {
    const aktuelle = aktuelleSpørsmål(svar);
    if (!aktuelle.opptjeningsaktiviteter || (svar.opptjeningsaktiviteter ?? []).length === 0) return false;
    if (!aktuelle.foreldrepengerOpptjentPåAap) return true;
    if (svar.foreldrepengerOpptjentPåAap === JaNei.NEI) return true;
    return aktuelle.yrkesaktivMinst4UkerFørUttak && svar.yrkesaktivMinst4UkerFørUttak === JaNei.JA;
}

export function tilOpptjeningsvurderingRequest(
    svar: OpptjeningsvurderingSchema,
    skjæringstidspunkt: string,
): ApiManuellOpptjeningsvurderingRequest {
    const aktuelle = aktuelleSpørsmål(svar);
    return {
        skjæringstidspunkt,
        minst4Uker: svar.minst4Uker === JaNei.JA,
        opptjeningsaktiviteter: aktuelle.opptjeningsaktiviteter ? svar.opptjeningsaktiviteter : [],
        foreldrepengerOpptjentPåAap: aktuelle.foreldrepengerOpptjentPåAap
            ? tilBoolean(svar.foreldrepengerOpptjentPåAap)
            : null,
        yrkesaktivMinst4UkerFørUttak: aktuelle.yrkesaktivMinst4UkerFørUttak
            ? tilBoolean(svar.yrkesaktivMinst4UkerFørUttak)
            : null,
        fritekstbegrunnelse: svar.fritekstbegrunnelse,
        journalpostId: journalpostIderTilRequest(svar),
    };
}

function tilBoolean(svar: JaNei | undefined): boolean | null {
    return svar === undefined ? null : svar === JaNei.JA;
}
