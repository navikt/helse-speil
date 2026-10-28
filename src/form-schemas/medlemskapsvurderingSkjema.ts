import z from 'zod/v4';

import {
    begrunnelseOgJournalpostDefaultValues,
    begrunnelseOgJournalpostFelter,
    journalpostIderTilRequest,
    sjekkJournalpost,
} from '@form-schemas/begrunnelseOgJournalpostSkjema';
import {
    ApiManuellMedlemskapsstatus,
    ApiManuellVilkårsvurderingRequest,
} from '@io/rest/generated/medlemskap/medlemskap.schemas';

export type MedlemskapsvurderingSchema = z.infer<typeof medlemskapsvurderingSkjema>;

export const medlemskapsvurderingSkjema = z
    .object({
        status: z.enum(ApiManuellMedlemskapsstatus, { error: 'Svar ja eller nei' }),
        ...begrunnelseOgJournalpostFelter,
    })
    .check(sjekkJournalpost);

export const medlemskapsvurderingDefaultValues: Partial<MedlemskapsvurderingSchema> = {
    ...begrunnelseOgJournalpostDefaultValues,
};

export function tilMedlemskapsvurderingRequest(
    svar: MedlemskapsvurderingSchema,
    skjæringstidspunkt: string,
): ApiManuellVilkårsvurderingRequest {
    return {
        skjæringstidspunkt,
        status: svar.status,
        fritekstbegrunnelse: svar.fritekstbegrunnelse,
        journalpostId: journalpostIderTilRequest(svar),
    };
}
