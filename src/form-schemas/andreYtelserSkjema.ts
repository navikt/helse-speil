import { z } from 'zod/v4';

import { andreYtelser } from '@saksbilde/leggTilPeriode/andreytelser/AndreYtelserSkjema';
import { DatePeriod } from '@typer/shared';
import { erGyldigNorskDato, erIPeriode, norskDatoTilIsoDato } from '@utils/date';

export type AndreYtelserFormFields = z.infer<ReturnType<typeof lagAndreYtelserSchema>>;

export const lagAndreYtelserSchema = (sykefraværstilfelleperioder: DatePeriod[]) => {
    return z
        .object({
            ytelse: z.enum(andreYtelser, { message: 'Gyldig ytelse er påkrevd' }),
            fom: z
                .string()
                .min(1, { error: 'Fra og med-dato er påkrevd' })
                .refine((value) => erGyldigNorskDato(value), 'Fra og med-datoen er ikke en gyldig norsk dato'),
            tom: z
                .string()
                .min(1, { error: 'Til og med-dato er påkrevd' })
                .refine((value) => erGyldigNorskDato(value), 'Til og med-datoen er ikke en gyldig norsk dato'),
            notat: z.string().min(1, { error: 'Notat til beslutter er påkrevd' }),
            grad: z
                .number({
                    error: 'Periodebeløp må være et tall',
                })
                .min(1, 'Grad må være minst 1')
                .max(100, 'Grad må være 100 eller lavere'),
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
