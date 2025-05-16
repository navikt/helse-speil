import { z } from 'zod';

import { DatePeriod } from '@typer/shared';
import { erGyldigNorskDato, erIPeriode, norskDatoTilIsoDato, perioderOverlapper } from '@utils/date';

export type StansAutomatiskBehandlingSchema = z.infer<typeof stansAutomatiskBehandlingSchema>;
export const stansAutomatiskBehandlingSchema = z.object({
    begrunnelse: z
        .string()
        .min(1, { message: 'Fyll inn begrunnelse.' })
        .max(1000, { message: 'Begrunnelsen kan maks være 1000 tegn.' }),
});

export type TilkommenInntektSchema = z.infer<ReturnType<typeof lagTilkommenInntektSchema>>;

export const lagTilkommenInntektSchema = (
    sykefraværstilfelleperioder: DatePeriod[],
    andreTilkomneInntektPerioder: Map<string, DatePeriod[]>,
    organisasjonEksisterer: () => boolean,
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
                .string()
                .min(1, { message: 'Organisasjonsnummer er påkrevd' })
                .refine((value) => !isNaN(Number(value)), 'Organisasjonsnummer må være et tall')
                .refine((value) => value.length === 9, 'Organisasjonsnummer må være 9 siffer')
                .refine(validerKontrollsiffer, 'Organisasjonsnummer må ha gyldig kontrollsiffer')
                .refine(organisasjonEksisterer, 'Organisasjon må eksistere i enhetsregisteret'),
            fom: z
                .string()
                .min(1, { message: 'Fra og med-dato er påkrevd' })
                .refine((value) => erGyldigNorskDato(value), 'Fra og med-datoen er ikke en gyldig norsk dato'),
            tom: z
                .string()
                .min(1, { message: 'Til og med-dato er påkrevd' })
                .refine((value) => erGyldigNorskDato(value), 'Til og med-datoen er ikke en gyldig norsk dato'),
            periodebeløp: z.coerce.number().nonnegative('Inntekt for perioden må være et positivt tall'),
            notat: z.string().min(1, { message: 'Notat til beslutter er påkrevd' }),
        })
        .refine(({ fom, tom }) => norskDatoTilIsoDato(fom) <= norskDatoTilIsoDato(tom), {
            message: 'Fra og med-dato må være før eller lik til og med-dato',
            path: ['fom'],
        })
        .superRefine(({ fom, tom }, ctx) => {
            const fomIso = norskDatoTilIsoDato(fom);
            const tomIso = norskDatoTilIsoDato(tom);
            const sykefraværstilfelleperiode = sykefraværstilfelleperioder.find(
                (sykefraværstilfelleperiode) =>
                    erIPeriode(fomIso, sykefraværstilfelleperiode) && erIPeriode(tomIso, sykefraværstilfelleperiode),
            );
            if (sykefraværstilfelleperiode === undefined) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['fom'],
                    message: 'Oppgitt periode må være innenfor et sykefraværstilfelle',
                });
            } else if (fomIso === sykefraværstilfelleperiode.fom) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['fom'],
                    message: 'Fra og med-dato må være etter skjæringstidspunktet',
                });
            }
        })
        .refine(
            ({ organisasjonsnummer, fom, tom }) => {
                const periode: DatePeriod = { fom: norskDatoTilIsoDato(fom), tom: norskDatoTilIsoDato(tom) };
                return !andreTilkomneInntektPerioder
                    .get(organisasjonsnummer)
                    ?.some((annenPeriode) => perioderOverlapper(periode, annenPeriode));
            },
            {
                message: 'Oppgitt periode overlapper med en annen periode for arbeidsgiveren',
                path: ['fom'],
            },
        );
};
