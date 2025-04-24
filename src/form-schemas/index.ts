import { z } from 'zod';

import { DateString } from '@typer/shared';

export type StansAutomatiskBehandlingSchema = z.infer<typeof stansAutomatiskBehandlingSchema>;
export const stansAutomatiskBehandlingSchema = z.object({
    begrunnelse: z
        .string()
        .min(1, { message: 'Fyll inn begrunnelse.' })
        .max(1000, { message: 'Begrunnelsen kan maks være 1000 tegn.' }),
});

export type TilkommenInntektSchema = z.infer<ReturnType<typeof lagTilkommenInntektSchema>>;

export const lagTilkommenInntektSchema = (
    vedtaksperioder: { fom: DateString; tom: DateString; skjæringstidspunkt: DateString }[],
    eksisterendePerioder: Map<string, { fom: DateString; tom: DateString }[]>,
) => {
    const validerKontrollsiffer = (organisasjonsnummer: string) => {
        const vekttall = [3, 2, 7, 6, 5, 4, 3, 2];
        const felt = organisasjonsnummer.split('').map(Number).slice(0, -1);
        const produkter = felt.map((tall, index) => tall * (vekttall[index] ?? 0));
        const sum = produkter.reduce((a, b) => a + b, 0);
        const kontrollsiffer = 11 - (sum % 11);
        return kontrollsiffer === Number(organisasjonsnummer) % 10;
    };
    return z
        .object({
            organisasjonsnummer: z
                .string({ required_error: 'Organisasjonsnummer er påkrevd' })
                .refine((value) => !isNaN(Number(value)), 'Organisasjonsnummer må være et tall')
                .refine((value) => value.length === 9, 'Organisasjonsnummer må være 9 siffer')
                .refine(validerKontrollsiffer, 'Organisasjonsnummer må ha gyldig kontrollsiffer'),
            fom: z.string().date('Datoen er ikke gyldig'),
            tom: z.string().date('Datoen er ikke gyldig'),
            periodebeløp: z.number().nonnegative('Inntekt for perioden må være et positivt tall'),
            notat: z.string().min(1, { message: 'Notat til beslutter er påkrevd' }),
        })
        .refine(({ fom, tom }) => fom <= tom, {
            message: 'Periode f.o.m. må være før t.o.m.',
            path: ['fom'],
        })
        .refine(
            ({ organisasjonsnummer, fom, tom }) =>
                !eksisterendePerioder
                    .get(organisasjonsnummer)
                    ?.some((eksisterendePeriode) => eksisterendePeriode.fom <= tom && eksisterendePeriode.tom >= fom),
            {
                message: 'Oppgitt periode overlapper med eksisterende perioder',
                path: ['fom'],
            },
        )
        .refine(({ fom }) => vedtaksperioder.some((periode) => fom > periode.skjæringstidspunkt), {
            message: 'Datoen må være etter skjæringstidspunktet',
            path: ['fom'],
        })
        .refine(
            ({ fom, tom }) =>
                vedtaksperioder.some((vedtaksperiode) => fom >= vedtaksperiode.fom && tom <= vedtaksperiode.tom),
            {
                message: 'Oppgitt periode skal være innenfor et sykefraværstilfelle',
                path: ['fom'],
            },
        );
};
