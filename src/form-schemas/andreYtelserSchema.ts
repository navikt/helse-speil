import {z} from 'zod/v4';

import {DatePeriod} from '@typer/shared';
import {erGyldigNorskDato, erIPeriode, norskDatoTilIsoDato} from '@utils/date';

export const ANNEN_YTELSE_OPTIONS = [
    'Foreldrepenger',
    'Svangerskapspenger',
    'Pleiepenger',
    'Omsorgspenger',
    'Opplæringspenger',
] as const;

export type AndreYtelserSchema = z.infer<ReturnType<typeof lagAndreYtelserSchema>>;

const lagAndreYtelserPeriodeSchema = (sykefraværstilfelleperioder: DatePeriod[]) =>
    z
        .object({
            fom: z
                .string()
                .min(1, { error: 'Fra og med-dato er påkrevd' })
                .refine((value) => erGyldigNorskDato(value), 'Fra og med-datoen er ikke en gyldig norsk dato'),
            tom: z
                .string()
                .min(1, { error: 'Til og med-dato er påkrevd' })
                .refine((value) => erGyldigNorskDato(value), 'Til og med-datoen er ikke en gyldig norsk dato'),
            grad: z.number({ error: 'Grad må være et tall' }).optional(),
        })
        .refine(({ fom, tom }) => norskDatoTilIsoDato(fom) <= norskDatoTilIsoDato(tom), {
            error: 'Fra og med-dato må være før eller lik til og med-dato',
            path: ['fom'],
        })
        .check((ctx) => {
            const grad = ctx.value.grad;
            if (grad == null) {
                ctx.issues.push({
                    code: 'custom',
                    message: 'Velg grad',
                    path: ['grad'],
                    input: grad,
                    continue: true,
                });
            } else if (!Number.isInteger(grad)) {
                ctx.issues.push({
                    code: 'custom',
                    message: 'Grad må være et heltall',
                    path: ['grad'],
                    input: grad,
                    continue: true,
                });
            } else if (grad < 1) {
                ctx.issues.push({
                    code: 'too_small',
                    message: 'Grad må være minst 1',
                    minimum: 1,
                    origin: 'number',
                    path: ['grad'],
                    input: grad,
                    continue: true,
                });
            } else if (grad > 100) {
                ctx.issues.push({
                    code: 'too_big',
                    message: 'Grad må være 100 eller lavere',
                    maximum: 100,
                    origin: 'number',
                    path: ['grad'],
                    input: grad,
                    continue: true,
                });
            }

            const fomIso = norskDatoTilIsoDato(ctx.value.fom);
            const tomIso = norskDatoTilIsoDato(ctx.value.tom);
            const sykefraværstilfelleperiode = sykefraværstilfelleperioder.find(
                (periode) => erIPeriode(fomIso, periode) && erIPeriode(tomIso, periode),
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

export const lagAndreYtelserSchema = (sykefraværstilfelleperioder: DatePeriod[]) =>
    z.object({
        ytelse: z.enum(ANNEN_YTELSE_OPTIONS, { message: 'Gyldig ytelse er påkrevd' }),
        perioder: z.array(lagAndreYtelserPeriodeSchema(sykefraværstilfelleperioder)).min(1),
        notat: z.string().min(1, { error: 'Notat til beslutter er påkrevd' }),
    });
