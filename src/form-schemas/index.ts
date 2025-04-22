import { z } from 'zod';

import { DateString } from '@typer/shared';

export const stansAutomatiskBehandlingSchema = z.object({
    begrunnelse: z
        .string()
        .min(1, { message: 'Fyll inn begrunnelse for stans av automatisk behandling.' })
        .max(1000, { message: 'Begrunnelsen kan maks være 1000 tegn.' }),
});

export const tilkommenInntektSchema = (
    skjæringstidspunkt: DateString,
    eksisterendePerioder: { fom: DateString; tom: DateString }[],
) =>
    z
        .object({
            organisasjonsnummer: z
                .number({
                    required_error: 'Organisasjonsnummer er påkrevd',
                    invalid_type_error: 'Organisasjonsnummer må være et tall',
                })
                .refine((value) => value.toString().length === 9, 'Organisasjonsnummer må være 9 siffer')
                .refine((value) => {
                    const vekttall = [3, 2, 7, 6, 5, 4, 3, 2];
                    const felt = value.toString().split('').map(Number).slice(0, -1);
                    const produkter = felt.map((tall, index) => tall * (vekttall[index] ?? 0));
                    const sum = produkter.reduce((a, b) => a + b, 0);
                    const kontrollsiffer = 11 - (sum % 11);
                    return kontrollsiffer === value % 10;
                }, 'Må være gyldig organisasjonsnummer'),
            fom: z
                .string()
                .date('Datoen er ikke gyldig')
                .refine((value) => value > skjæringstidspunkt, 'Datoen må være etter skjæringstidspunktet'),
            tom: z.string().date('Datoen er ikke gyldig'),
            periodebeløp: z.number().nonnegative('Inntekt for perioden må være et positivt tall'),
        })
        .refine(({ fom, tom }) => fom <= tom, {
            message: 'Periode f.o.m. må være før t.o.m.',
            path: ['fom', 'tom'],
        })
        .refine(({ fom, tom }) => !eksisterendePerioder.some((periode) => periode.fom <= tom && periode.tom >= fom), {
            message: 'Oppgitt periode overlapper med eksisterende perioder',
            path: ['fom', 'tom'],
        });
