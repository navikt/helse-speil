import z from 'zod/v4';

import {
    ApiBehandlerKategori,
    ApiBehandlerType,
    ApiDialogmeldingStatus,
    ApiFagomrade,
} from '@io/rest/generated/sporhund.schemas';

const fagomradeValues = Object.values(ApiFagomrade) as [ApiFagomrade, ...ApiFagomrade[]];
const kategoriValues = Object.values(ApiBehandlerKategori) as [ApiBehandlerKategori, ...ApiBehandlerKategori[]];
const typeValues = Object.values(ApiBehandlerType) as [ApiBehandlerType, ...ApiBehandlerType[]];

const behandlerSchema = z.object({
    id: z.string().min(1),
    kategori: z.enum(kategoriValues),
    navn: z.object({
        fornavn: z.string(),
        etternavn: z.string(),
        mellomnavn: z.string().nullable().optional(),
    }),
    legekontor: z.object({
        kontor: z.string().nullable().optional(),
        orgnummer: z.string().nullable().optional(),
        adresse: z.string().nullable().optional(),
        postnummer: z.string().nullable().optional(),
        poststed: z.string().nullable().optional(),
    }),
    telefonnummer: z.string().nullable().optional(),
    type: z.enum(typeValues).nullable().optional(),
});

export type NyDialogmeldingSchema = z.infer<typeof nyDialogmeldingSchema>;
export const nyDialogmeldingSchema = z.object({
    behandler: behandlerSchema.refine((val) => val.id.length > 0, { error: 'Velg en behandler' }),
    fagomrade: z.enum(fagomradeValues, { error: 'Velg type' }),
    melding: z.string().min(1, { error: 'Fyll inn melding' }),
});

export const fagomradeLabels: Record<ApiFagomrade, string> = {
    [ApiFagomrade.BESTRIDELSE]: 'Bestridelse',
    [ApiFagomrade.ENKELTSTAENDE_BEHANDLINGSDAGER]: 'Enkeltstående behandlingsdager',
    [ApiFagomrade.TILBAKEDATERING]: 'Tilbakedatering',
    [ApiFagomrade.YRKESSKADE]: 'Yrkesskade',
};

export const statusLabels: Record<ApiDialogmeldingStatus, string> = {
    [ApiDialogmeldingStatus.SENDT]: 'Sendt',
    [ApiDialogmeldingStatus.PURRING_SENDT]: 'Purring sendt',
    [ApiDialogmeldingStatus.MOTTATT]: 'Mottatt',
    [ApiDialogmeldingStatus.FERDIGSTILT]: 'Ferdigstilt',
};
