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

export const GrunnForOppfylt = {
    INNVILGET_SØKNAD: 'INNVILGET_SØKNAD',
    MEDLEM: 'MEDLEM',
    HELSEINSTITUSJON: 'HELSEINSTITUSJON',
    YRKESSKADE: 'YRKESSKADE',
    OPPHOLD_I_GODKJENT_OMRÅDE: 'OPPHOLD_I_GODKJENT_OMRÅDE',
} as const;
export type GrunnForOppfylt = (typeof GrunnForOppfylt)[keyof typeof GrunnForOppfylt];

export const GrunnForIkkeOppfylt = {
    SØKNAD_AVSLÅTT: 'SØKNAD_AVSLÅTT',
    IKKE_SØKT: 'IKKE_SØKT',
} as const;
export type GrunnForIkkeOppfylt = (typeof GrunnForIkkeOppfylt)[keyof typeof GrunnForIkkeOppfylt];

/** Brukes av mocken for historikkvisningen fra sp-avslagsdager. */
export const unntakAndreLeddLabels: Record<ApiUnntakAndreLedd, string> = {
    [ApiUnntakAndreLedd.MEDLEM_ETTER_2_5_2_6_2_8]: 'Medlem etter §§ 2-5, 2-6 eller 2-8',
    [ApiUnntakAndreLedd.INNLAGT_I_HELSEINSTITUSJON]: 'Innlagt i helseinstitusjon',
    [ApiUnntakAndreLedd.INGEN]: 'Nei',
};

const jaNei = z.enum([JaNei.JA, JaNei.NEI]);

export type OppholdskravSchema = z.infer<typeof oppholdskravSkjema>;

// Alle svar er valgfrie i objektet og påkrevd i check, så alle feilene i skjemaet vises samtidig.
// Grunnen for utfallet som ikke er valgt, blir liggende i skjemaet, men valideres og sendes ikke.
export const oppholdskravSkjema = z
    .object({
        dager: z.array(z.string()).min(1, { error: 'Velg minst én dag' }),
        eøsBorger: jaNei.optional(),
        oppfyllerOppholdskravet: jaNei.optional(),
        grunnForOppfylt: z.enum(GrunnForOppfylt).optional(),
        grunnForIkkeOppfylt: z.enum(GrunnForIkkeOppfylt).optional(),
        ...begrunnelseOgJournalpostFelter,
        // sp-avslagsdager avviser en begrunnelse med bare mellomrom
        fritekstbegrunnelse: z.string().trim().min(1, { error: 'Fyll inn begrunnelse' }),
    })
    .check((ctx) => {
        const svar = ctx.value;
        påkrevd(ctx, 'eøsBorger', 'Svar ja eller nei');
        påkrevd(ctx, 'oppfyllerOppholdskravet', 'Svar ja eller nei');
        if (svar.oppfyllerOppholdskravet === JaNei.JA) påkrevd(ctx, 'grunnForOppfylt', 'Velg begrunnelse');
        if (svar.oppfyllerOppholdskravet === JaNei.NEI) påkrevd(ctx, 'grunnForIkkeOppfylt', 'Velg begrunnelse');
        sjekkJournalpost(ctx);
    });

export function oppholdskravDefaultValues(dager: string[]): Partial<OppholdskravSchema> {
    return { dager, ...begrunnelseOgJournalpostDefaultValues };
}

export function tilOppholdskravRequest(
    svar: OppholdskravSchema,
    behandlingId: string,
): ApiOppholdskravvurderingRequest {
    return {
        behandlingId,
        dager: svar.dager,
        eøsBorger: svar.eøsBorger === JaNei.JA,
        ...tilLedd(svar),
        fritekstbegrunnelse: svar.fritekstbegrunnelse,
        journalpostId: journalpostIderTilRequest(svar),
    };
}

type Ledd = Pick<
    ApiOppholdskravvurderingRequest,
    'oppholdIGodkjentOmråde' | 'unntakAndreLedd' | 'godkjentOppholdInntilFireUker'
>;

const ikkeOppfylt: Ledd = {
    oppholdIGodkjentOmråde: false,
    unntakAndreLedd: ApiUnntakAndreLedd.INGEN,
    godkjentOppholdInntilFireUker: false,
};

/**
 * Svarene i skjemaet gjøres om til leddene i § 8-9 som sp-avslagsdager vurderer: første ledd (opphold i godkjent
 * område), unntakene i andre ledd og godkjent opphold etter tredje ledd.
 * Innvilget søknad og godkjent yrkesskade er begge godkjent opphold etter tredje ledd.
 */
const leddForOppfylt: Record<GrunnForOppfylt, Ledd> = {
    [GrunnForOppfylt.OPPHOLD_I_GODKJENT_OMRÅDE]: {
        oppholdIGodkjentOmråde: true,
        unntakAndreLedd: null,
        godkjentOppholdInntilFireUker: null,
    },
    [GrunnForOppfylt.MEDLEM]: {
        oppholdIGodkjentOmråde: false,
        unntakAndreLedd: ApiUnntakAndreLedd.MEDLEM_ETTER_2_5_2_6_2_8,
        godkjentOppholdInntilFireUker: null,
    },
    [GrunnForOppfylt.HELSEINSTITUSJON]: {
        oppholdIGodkjentOmråde: false,
        unntakAndreLedd: ApiUnntakAndreLedd.INNLAGT_I_HELSEINSTITUSJON,
        godkjentOppholdInntilFireUker: null,
    },
    [GrunnForOppfylt.INNVILGET_SØKNAD]: {
        oppholdIGodkjentOmråde: false,
        unntakAndreLedd: ApiUnntakAndreLedd.INGEN,
        godkjentOppholdInntilFireUker: true,
    },
    [GrunnForOppfylt.YRKESSKADE]: {
        oppholdIGodkjentOmråde: false,
        unntakAndreLedd: ApiUnntakAndreLedd.INGEN,
        godkjentOppholdInntilFireUker: true,
    },
};

function tilLedd(svar: OppholdskravSchema): Ledd {
    if (svar.oppfyllerOppholdskravet === JaNei.NEI) return ikkeOppfylt;
    if (svar.grunnForOppfylt === undefined) throw new Error('Skjemaet er validert, så grunnen for oppfylt finnes');
    return leddForOppfylt[svar.grunnForOppfylt];
}

function påkrevd(
    ctx: z.core.ParsePayload<OppholdskravSchema>,
    felt: 'eøsBorger' | 'oppfyllerOppholdskravet' | 'grunnForOppfylt' | 'grunnForIkkeOppfylt',
    message: string,
) {
    if (ctx.value[felt] !== undefined) return;
    ctx.issues.push({ code: 'custom', message, path: [felt], input: ctx.value[felt] });
}
