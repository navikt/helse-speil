import { z } from 'zod/v4';

import { DatePeriod } from '@typer/shared';
import { erGyldigNorskDato, erIPeriode, norskDatoTilIsoDato } from '@utils/date';

export type AndreYtelserFormFields = z.infer<ReturnType<typeof lagAndreYtelserSchema>>;

export const lagAndreYtelserSchema = (sykefraværstilfelleperioder: DatePeriod[]) => {
    return z
        .object({
            fom: z
                .string()
                .min(1, { error: 'Fra og med-dato er påkrevd' })
                .refine((value) => erGyldigNorskDato(value), 'Fra og med-datoen er ikke en gyldig norsk dato'),
            tom: z
                .string()
                .min(1, { error: 'Til og med-dato er påkrevd' })
                .refine((value) => erGyldigNorskDato(value), 'Til og med-datoen er ikke en gyldig norsk dato'),
            notat: z.string().min(1, { error: 'Notat til beslutter er påkrevd' }),
            grad: z.nullable(z.number()),
        })
        .superRefine(({ grad }, ctx) => {
            if (grad == null || (grad as unknown) === '') {
                ctx.addIssue({
                    code: 'custom',
                    message: 'Velg grad',
                    input: grad,
                    path: ['grad'],
                });
            } else if (Number.isNaN(grad)) {
                ctx.addIssue({
                    code: 'custom',
                    message: 'Grad må være et tall',
                    input: grad,
                    path: ['grad'],
                });
            } else if (grad < 0) {
                ctx.addIssue({
                    code: 'too_small',
                    message: `Grad må være minst 1`,
                    minimum: 1,
                    origin: 'number',
                    input: grad,
                    path: ['grad'],
                });
            } else if (grad > 100) {
                ctx.addIssue({
                    code: 'too_big',
                    message: 'Grad må være 100 eller lavere',
                    maximum: 100,
                    origin: 'number',
                    input: grad,
                    path: ['grad'],
                });
            }
        })
        .refine(({ fom, tom }) => norskDatoTilIsoDato(fom) <= norskDatoTilIsoDato(tom), {
            error: 'Fra og med-dato må være før eller lik til og med-dato',
            path: ['fom'],
        })

        .check((ctx) => {
            const fomIso = norskDatoTilIsoDato(ctx.value.fom);
            const tomIso = norskDatoTilIsoDato(ctx.value.tom);
            const sykefraværstilfelleperiode = sykefraværstilfelleperioder.find(
                (sykefraværstilfelleperiode) =>
                    erIPeriode(fomIso, sykefraværstilfelleperiode) && erIPeriode(tomIso, sykefraværstilfelleperiode),
            );
            if (sykefraværstilfelleperiode === undefined) {
                ctx.issues.push({
                    code: 'custom',
                    message: 'Oppgitt periode må være innenfor et sykefraværstilfelle',
                    path: ['fom'],
                    input: ctx.value.fom,
                    continue: true,
                });
            }
        });
};
