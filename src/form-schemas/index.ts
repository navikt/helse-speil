import { z } from 'zod/v4';

import { organisasjonsnummerHarRiktigKontrollsiffer } from '@external/sparkel-aareg/useOrganisasjonQuery';
import { DatePeriod } from '@typer/shared';
import { erGyldigNorskDato, erIPeriode, norskDatoTilIsoDato, perioderOverlapper, tilUkedager } from '@utils/date';

export type StansAutomatiskBehandlingSchema = z.infer<typeof stansAutomatiskBehandlingSchema>;
export const stansAutomatiskBehandlingSchema = z.object({
    begrunnelse: z
        .string()
        .min(1, { error: 'Fyll inn begrunnelse.' })
        .max(1000, { error: 'Begrunnelsen kan maks være 1000 tegn.' }),
});

export type TilkommenInntektSchema = z.infer<ReturnType<typeof lagTilkommenInntektSchema>>;

export const lagTilkommenInntektSchema = (
    sykefraværstilfelleperioder: DatePeriod[],
    andreTilkomneInntektPerioder: Map<string, DatePeriod[]>,
    organisasjonEksisterer: () => boolean,
) => {
    return z
        .object({
            organisasjonsnummer: z
                .string()
                .min(1, { error: 'Organisasjonsnummer er påkrevd' })
                .refine((value) => !isNaN(Number(value)), 'Organisasjonsnummer må være et tall')
                .refine((value) => value.length === 9, 'Organisasjonsnummer må være 9 siffer')
                .refine(organisasjonsnummerHarRiktigKontrollsiffer, 'Organisasjonsnummeret er ikke gyldig')
                .refine(organisasjonEksisterer, 'Organisasjon må eksistere i enhetsregisteret'),
            fom: z
                .string()
                .min(1, { error: 'Fra og med-dato er påkrevd' })
                .refine((value) => erGyldigNorskDato(value), 'Fra og med-datoen er ikke en gyldig norsk dato'),
            tom: z
                .string()
                .min(1, { error: 'Til og med-dato er påkrevd' })
                .refine((value) => erGyldigNorskDato(value), 'Til og med-datoen er ikke en gyldig norsk dato'),
            periodebeløp: z
                .number({
                    error: 'Periodebeløp må være et tall',
                })
                .min(1, 'Inntekt for perioden må være minimum 1 kr'),
            notat: z.string().min(1, { error: 'Notat til beslutter er påkrevd' }),
            ekskluderteUkedager: z.iso.date().array(),
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
        })
        .refine(
            ({ organisasjonsnummer, fom, tom }) => {
                const periode: DatePeriod = { fom: norskDatoTilIsoDato(fom), tom: norskDatoTilIsoDato(tom) };
                return !andreTilkomneInntektPerioder
                    .get(organisasjonsnummer)
                    ?.some((annenPeriode) => perioderOverlapper(periode, annenPeriode));
            },
            {
                error: 'Oppgitt periode overlapper med en annen periode for arbeidsgiveren',
                path: ['fom'],
            },
        )
        .refine(
            ({ ekskluderteUkedager, fom, tom }) => {
                const periode: DatePeriod = { fom: norskDatoTilIsoDato(fom), tom: norskDatoTilIsoDato(tom) };
                const ukedager = tilUkedager(periode);
                return ukedager.some((ukedag) => !ekskluderteUkedager.includes(ukedag));
            },
            {
                error: 'Kan ikke velge bort alle dager i perioden',
                path: ['ekskluderteUkedager'],
            },
        );
};
