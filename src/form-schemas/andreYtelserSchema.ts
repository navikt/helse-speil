import { z } from 'zod/v4';

import { ApiGraderteAndreYtelser } from '@io/rest/generated/spesialist.schemas';
import { DatePeriod } from '@typer/shared';
import { erGyldigNorskDato, erIPeriode, norskDatoTilIsoDato, tilDatoer } from '@utils/date';

export const ANNEN_YTELSE_OPTIONS = [
    'Foreldrepenger',
    'Svangerskapspenger',
    'Pleiepenger',
    'Omsorgspenger',
    'Opplæringspenger',
] as const;

/** Verdiene skjemafeltene har mens de fylles ut — `grad` kan være tom her. */
export type AndreYtelserSkjemaInput = z.input<ReturnType<typeof lagAndreYtelserSchema>>;

/** Ferdig validerte verdier fra `handleSubmit` — `grad` er garantert satt. */
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
            grad: z
                .number({ error: 'Velg grad' })
                .int({ error: 'Grad må være et heltall' })
                .min(1, { error: 'Grad må være minst 1' })
                .max(99, { error: 'Grad må være 99 eller lavere' })
                .optional(),
        })
        .refine(({ fom, tom }) => norskDatoTilIsoDato(fom) <= norskDatoTilIsoDato(tom), {
            error: 'Fra og med-dato må være før eller lik til og med-dato',
            path: ['fom'],
        })
        .check((ctx) => {
            if (ctx.value.grad == null) {
                ctx.issues.push({
                    code: 'custom',
                    message: 'Velg grad',
                    path: ['grad'],
                    input: ctx.value.grad,
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
        })
        // Feltet starter tomt i skjemaet, men sjekken over avviser innsending uten grad.
        // Transformen løfter den garantien opp i typen, slik at koden nedstrøms slipper å gjenta den.
        .transform((periode) => ({ ...periode, grad: periode.grad as number }));

export const lagAndreYtelserSchema = (
    sykefraværstilfelleperioder: DatePeriod[],
    alleGraderteAndreYtelser: ApiGraderteAndreYtelser[],
    gjeldendeAndreYtelserId?: string,
) =>
    z
        .object({
            ytelse: z.enum(ANNEN_YTELSE_OPTIONS, { message: 'Gyldig ytelse er påkrevd' }),
            perioder: z.array(lagAndreYtelserPeriodeSchema(sykefraværstilfelleperioder)).min(1),
            notat: z.string().min(1, { error: 'Notat til beslutter er påkrevd' }),
        })
        .check((ctx) => {
            const gradPerDag = new Map<string, number>();
            const leggTilGrad = (fomIso: string, tomIso: string, grad: number | null | undefined) => {
                tilDatoer({ fom: fomIso, tom: tomIso }).forEach((dato) => {
                    gradPerDag.set(dato, (gradPerDag.get(dato) ?? 0) + (grad ?? 0));
                });
            };

            alleGraderteAndreYtelser
                .filter((ytelse) => !ytelse.fjernet && ytelse.andreYtelserId !== gjeldendeAndreYtelserId)
                .flatMap((ytelse) => ytelse.perioder)
                .forEach((periode) => leggTilGrad(periode.fom, periode.tom, periode.grad));

            ctx.value.perioder.forEach(({ fom, tom, grad }) => {
                leggTilGrad(norskDatoTilIsoDato(fom), norskDatoTilIsoDato(tom), grad);
            });

            const overstigerHundreProsent = Array.from(gradPerDag.values()).some((totalGrad) => totalGrad > 100);
            if (overstigerHundreProsent) {
                ctx.issues.push({
                    code: 'custom',
                    message: 'Samlet gradering for perioden kan ikke overstige 100 %',
                    path: ['perioder'],
                    input: ctx.value.perioder,
                });
            }
        });
