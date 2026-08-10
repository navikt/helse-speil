import { z } from 'zod/v4';

export const ANNEN_YTELSE_OPTIONS = [
    'Foreldrepenger',
    'Svangerskapspenger',
    'Pleiepenger',
    'Omsorgspenger',
    'Opplæringspenger',
] as const;

const andreYtelserPeriodeSchema = z.object({
    fom: z.string().min(1, { error: 'Fra og med-dato er påkrevd' }),
    tom: z.string().min(1, { error: 'Til og med-dato er påkrevd' }),
    grad: z
        .number({ error: 'Grad må være et tall' })
        .int({ error: 'Grad må være et heltall' })
        .min(1, 'Grad må være mellom 1 og 99')
        .max(99, 'Grad må være mellom 1 og 99'),
});

export const andreYtelserSchema = z.object({
    ytelse: z.string().min(1, { error: 'Velg ytelse' }),
    perioder: z.array(andreYtelserPeriodeSchema).min(1),
    notat: z.string().min(1, { error: 'Notat til beslutter er påkrevd' }),
});
export type AndreYtelserSchema = z.infer<typeof andreYtelserSchema>;
