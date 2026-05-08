import z from 'zod/v4';

import { ApiFagomrade } from '@io/rest/generated/sporhund.schemas';

const fagomradeValues = Object.values(ApiFagomrade) as [ApiFagomrade, ...ApiFagomrade[]];

export type NyDialogmeldingSchema = z.infer<typeof nyDialogmeldingSchema>;
export const nyDialogmeldingSchema = z.object({
    behandlerId: z.string().min(1, { error: 'Velg en behandler' }),
    fagomrade: z.enum(fagomradeValues, { error: 'Velg type' }),
    melding: z.string().min(1, { error: 'Fyll inn melding' }),
});

export const fagomradeLabels: Record<ApiFagomrade, string> = {
    [ApiFagomrade.BESTRIDELSE]: 'Bestridelse',
    [ApiFagomrade.ENKELTSTAENDE_BEHANDLINGSDAGER]: 'Enkeltstående behandlingsdager',
    [ApiFagomrade.TILBAKEDATERING]: 'Tilbakedatering',
    [ApiFagomrade.YRKESSKADE]: 'Yrkesskade',
};
