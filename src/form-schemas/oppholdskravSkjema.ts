import z from 'zod/v4';

import {
    begrunnelseOgJournalpostDefaultValues,
    begrunnelseOgJournalpostFelter,
    journalpostIderTilRequest,
    sjekkJournalpost,
} from '@form-schemas/begrunnelseOgJournalpostSkjema';
import { JaNei } from '@form-schemas/opptjeningsvurderingSkjema';
import {
    ApiOppholdskravvurderingRequest,
    ApiUnntakAndreLedd,
} from '@io/rest/generated/avslagsdager/avslagsdager.schemas';

type JaNei = (typeof JaNei)[keyof typeof JaNei];

// Foreløpige tekster. Byttes når skissene for § 8-9 er klare (navikt/sas-issues#98).
export const unntakAndreLeddLabels: Record<ApiUnntakAndreLedd, string> = {
    [ApiUnntakAndreLedd.MEDLEM_ETTER_2_5_2_6_2_8]: 'Medlem etter §§ 2-5, 2-6 eller 2-8',
    [ApiUnntakAndreLedd.INNLAGT_I_HELSEINSTITUSJON]: 'Innlagt i helseinstitusjon',
    [ApiUnntakAndreLedd.INGEN]: 'Nei',
};

const jaNei = z.enum([JaNei.JA, JaNei.NEI]);

export type OppholdskravSchema = z.infer<typeof oppholdskravSkjema>;

// Alle svar er valgfrie i objektet og påkrevd i check, så alle feilene i skjemaet vises samtidig.
// Svar på spørsmål som ikke vises blir liggende i skjemaet, men valideres ikke og sendes som null.
export const oppholdskravSkjema = z
    .object({
        dager: z.array(z.string()).min(1, { error: 'Velg minst én dag' }),
        eøsBorger: jaNei.optional(),
        oppholdIGodkjentOmråde: jaNei.optional(),
        unntakAndreLedd: z.enum(ApiUnntakAndreLedd).optional(),
        godkjentOppholdInntilFireUker: jaNei.optional(),
        ...begrunnelseOgJournalpostFelter,
        // sp-avslagsdager avviser en begrunnelse med bare mellomrom
        fritekstbegrunnelse: z.string().trim().min(1, { error: 'Fyll inn begrunnelse' }),
    })
    .check((ctx) => {
        const svar = ctx.value;
        const aktuelle = aktuelleSpørsmål(svar);
        påkrevd(ctx, 'eøsBorger', 'Svar ja eller nei');
        påkrevd(ctx, 'oppholdIGodkjentOmråde', 'Svar ja eller nei');
        if (aktuelle.unntakAndreLedd) påkrevd(ctx, 'unntakAndreLedd', 'Velg om et av unntakene gjelder');
        if (aktuelle.godkjentOppholdInntilFireUker) påkrevd(ctx, 'godkjentOppholdInntilFireUker', 'Svar ja eller nei');
        sjekkJournalpost(ctx);
    });

export function oppholdskravDefaultValues(dager: string[]): Partial<OppholdskravSchema> {
    return { dager, ...begrunnelseOgJournalpostDefaultValues };
}

type Svar = Partial<
    Pick<
        OppholdskravSchema,
        'eøsBorger' | 'oppholdIGodkjentOmråde' | 'unntakAndreLedd' | 'godkjentOppholdInntilFireUker'
    >
>;

/**
 * Hvilke spørsmål i andre ledd som skal vises og besvares. Samme regler som sp-avslagsdager validerer etter:
 * unntakene bare når første ledd ikke er oppfylt, og godkjent opphold bare når ingen av unntakene gjelder.
 */
export function aktuelleSpørsmål(svar: Svar) {
    const unntakAndreLedd = svar.oppholdIGodkjentOmråde === JaNei.NEI;
    const godkjentOppholdInntilFireUker = unntakAndreLedd && svar.unntakAndreLedd === ApiUnntakAndreLedd.INGEN;
    return { unntakAndreLedd, godkjentOppholdInntilFireUker };
}

/** Alle aktuelle spørsmål er besvart, og svarene gir oppfylt etter § 8-9. */
export function girOppfylt(svar: Svar): boolean {
    return utfall(svar) === 'Oppfylt';
}

/** Alle aktuelle spørsmål er besvart, og svarene gir ikke oppfylt etter § 8-9. */
export function girIkkeOppfylt(svar: Svar): boolean {
    return utfall(svar) === 'IkkeOppfylt';
}

export function tilOppholdskravRequest(
    svar: OppholdskravSchema,
    behandlingId: string,
): ApiOppholdskravvurderingRequest {
    const aktuelle = aktuelleSpørsmål(svar);
    return {
        behandlingId,
        dager: svar.dager,
        eøsBorger: svar.eøsBorger === JaNei.JA,
        oppholdIGodkjentOmråde: svar.oppholdIGodkjentOmråde === JaNei.JA,
        unntakAndreLedd: aktuelle.unntakAndreLedd ? (svar.unntakAndreLedd ?? null) : null,
        godkjentOppholdInntilFireUker: aktuelle.godkjentOppholdInntilFireUker
            ? tilBoolean(svar.godkjentOppholdInntilFireUker)
            : null,
        fritekstbegrunnelse: svar.fritekstbegrunnelse,
        journalpostId: journalpostIderTilRequest(svar),
    };
}

// Samme regler som vilkårsvurderinger() og samletUtfall() i Oppholdskravvurdering i sp-avslagsdager: første ledd og
// unntakene i andre og tredje ledd er alternative grunnlag, så ett oppfylt holder. undefined når et aktuelt spørsmål
// ikke er besvart.
function utfall(svar: Svar): 'Oppfylt' | 'IkkeOppfylt' | undefined {
    if (svar.eøsBorger == null || svar.oppholdIGodkjentOmråde == null) return undefined;
    if (svar.oppholdIGodkjentOmråde === JaNei.JA) return 'Oppfylt';
    switch (svar.unntakAndreLedd) {
        case undefined:
            return undefined;
        case ApiUnntakAndreLedd.MEDLEM_ETTER_2_5_2_6_2_8:
        case ApiUnntakAndreLedd.INNLAGT_I_HELSEINSTITUSJON:
            return 'Oppfylt';
        case ApiUnntakAndreLedd.INGEN:
            if (svar.godkjentOppholdInntilFireUker == null) return undefined;
            return svar.godkjentOppholdInntilFireUker === JaNei.JA ? 'Oppfylt' : 'IkkeOppfylt';
    }
}

function tilBoolean(svar: JaNei | undefined): boolean | null {
    return svar === undefined ? null : svar === JaNei.JA;
}

function påkrevd(ctx: z.core.ParsePayload<OppholdskravSchema>, felt: keyof Svar, message: string) {
    if (ctx.value[felt] !== undefined) return;
    ctx.issues.push({ code: 'custom', message, path: [felt], input: ctx.value[felt] });
}
