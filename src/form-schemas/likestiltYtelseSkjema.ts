import z from 'zod/v4';

import {
    begrunnelseOgJournalpostDefaultValues,
    begrunnelseOgJournalpostFelter,
    journalpostIderTilRequest,
    sjekkJournalpost,
} from '@form-schemas/opptjeningSkjema';
import {
    ApiLikestiltYtelse,
    ApiManuellLikestiltYtelseVurderingRequest,
} from '@io/rest/generated/vilkarsproving.schemas';

export const JaNei = {
    JA: 'JA',
    NEI: 'NEI',
} as const;

type JaNei = (typeof JaNei)[keyof typeof JaNei];

export const likestiltYtelseLabels: Record<ApiLikestiltYtelse, string> = {
    [ApiLikestiltYtelse.DAGPENGER]: 'Dagpenger',
    [ApiLikestiltYtelse.SYKEPENGER]: 'Sykepenger',
    [ApiLikestiltYtelse.KAPITTEL_9]: 'Pleie-, omsorgs- eller opplæringspenger',
    [ApiLikestiltYtelse.FORELDREPENGER]: 'Foreldrepenger',
    [ApiLikestiltYtelse.SVANGERSKAPSPENGER]: 'Svangerskapspenger',
};

export const likestiltYtelseKapittel: Record<ApiLikestiltYtelse, number> = {
    [ApiLikestiltYtelse.DAGPENGER]: 4,
    [ApiLikestiltYtelse.SYKEPENGER]: 8,
    [ApiLikestiltYtelse.KAPITTEL_9]: 9,
    [ApiLikestiltYtelse.FORELDREPENGER]: 14,
    [ApiLikestiltYtelse.SVANGERSKAPSPENGER]: 14,
};

const jaNei = z.enum([JaNei.JA, JaNei.NEI], { error: 'Svar ja eller nei' });

export type LikestiltYtelseSchema = z.infer<typeof likestiltYtelseSkjema>;

// Svar på spørsmål som ikke vises blir liggende i skjemaet, men valideres ikke og sendes ikke med
export const likestiltYtelseSkjema = z
    .object({
        sammenlagtMinst4Uker: jaNei,
        ytelser: z.array(z.enum(ApiLikestiltYtelse)),
        foreldrepengerOpptjentPåAap: jaNei.optional(),
        yrkesaktivMinst4UkerFørUttak: jaNei.optional(),
        ...begrunnelseOgJournalpostFelter,
    })
    .check((ctx) => {
        const svar = ctx.value;
        const aktuelle = aktuelleSpørsmål(svar);
        if (aktuelle.ytelser && svar.ytelser.length === 0) {
            ctx.issues.push({
                code: 'custom',
                message: 'Velg minst én ytelse',
                path: ['ytelser'],
                input: svar.ytelser,
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

export const likestiltYtelseDefaultValues: Partial<LikestiltYtelseSchema> = {
    sammenlagtMinst4Uker: undefined,
    ytelser: [],
    foreldrepengerOpptjentPåAap: undefined,
    yrkesaktivMinst4UkerFørUttak: undefined,
    ...begrunnelseOgJournalpostDefaultValues,
};

type Svar = Partial<
    Pick<
        LikestiltYtelseSchema,
        'sammenlagtMinst4Uker' | 'ytelser' | 'foreldrepengerOpptjentPåAap' | 'yrkesaktivMinst4UkerFørUttak'
    >
>;

/**
 * Hvilke spørsmål som skal vises og besvares, gitt svarene over. Samme regler som backend validerer etter:
 * ytelser bare ved «Ja» på sammenlagt, AAP-spørsmålet bare når foreldrepenger er valgt, og yrkesaktivitet før
 * uttak bare når foreldrepengene er opptjent på AAP.
 */
export function aktuelleSpørsmål(svar: Svar) {
    const ytelser = svar.sammenlagtMinst4Uker === JaNei.JA;
    const foreldrepengerOpptjentPåAap = ytelser && (svar.ytelser ?? []).includes(ApiLikestiltYtelse.FORELDREPENGER);
    const yrkesaktivMinst4UkerFørUttak = foreldrepengerOpptjentPåAap && svar.foreldrepengerOpptjentPåAap === JaNei.JA;
    return { ytelser, foreldrepengerOpptjentPåAap, yrkesaktivMinst4UkerFørUttak };
}

/** Svarene gir ikke oppfylt etter § 8-2 andre ledd (scenario D og E i kodeverket). */
export function girIkkeOppfylt(svar: Svar): boolean {
    if (svar.sammenlagtMinst4Uker === JaNei.NEI) return true;
    return aktuelleSpørsmål(svar).yrkesaktivMinst4UkerFørUttak && svar.yrkesaktivMinst4UkerFørUttak === JaNei.NEI;
}

/** Alle aktuelle spørsmål er besvart, og svarene gir oppfylt etter § 8-2 andre ledd. */
export function girOppfylt(svar: Svar): boolean {
    const aktuelle = aktuelleSpørsmål(svar);
    if (!aktuelle.ytelser || (svar.ytelser ?? []).length === 0) return false;
    if (!aktuelle.foreldrepengerOpptjentPåAap) return true;
    if (svar.foreldrepengerOpptjentPåAap === JaNei.NEI) return true;
    return aktuelle.yrkesaktivMinst4UkerFørUttak && svar.yrkesaktivMinst4UkerFørUttak === JaNei.JA;
}

export function tilLikestiltYtelseRequest(
    svar: LikestiltYtelseSchema,
    skjæringstidspunkt: string,
): ApiManuellLikestiltYtelseVurderingRequest {
    const aktuelle = aktuelleSpørsmål(svar);
    return {
        skjæringstidspunkt,
        sammenlagtMinst4Uker: svar.sammenlagtMinst4Uker === JaNei.JA,
        ytelser: aktuelle.ytelser ? svar.ytelser : [],
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
