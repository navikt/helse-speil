import { z } from 'zod/v4';

import { DatePeriod, DateString } from '@typer/shared';
import { erEtter, erFør, plussEnDag } from '@utils/date';

export type InntektOgRefusjonSchema = z.infer<ReturnType<typeof lagInntektOgRefusjonSchema>>;
export const lagInntektOgRefusjonSchema = (sykefraværstilfelle: DatePeriod, begrunnelser: string[]) =>
    z
        .object({
            månedsbeløp: z
                .number({
                    error: (issue) =>
                        issue.input == null || issue.input === ''
                            ? 'Månedsbeløp er påkrevd'
                            : 'Månedsbeløp må være et tall',
                })
                .positive('Månedsbeløp må være større enn 0')
                .max(10000000, 'Systemet håndterer ikke månedsbeløp over 10 millioner'),
            refusjonsperioder: z.array(refusjonsperiodeSchema).min(1, 'Det må oppgis minst én refusjonsperiode'),
            begrunnelse: z.enum(begrunnelser, {
                error: (issue) =>
                    issue.input === '' || issue.input == null ? 'Begrunnelse er påkrevd' : 'Ugyldig begrunnelse',
            }),
            notat: z.string('Notat må være en tekst').min(1, 'Notat er påkrevd'),
        })
        .refine(
            (skjema) => {
                return skjema.refusjonsperioder
                    .sort((a, b) => sorter(a.fom, b.fom))
                    .every((periode, index, arr) => {
                        if (index === 0) return true;
                        const forrigePeriode = arr[index - 1];
                        return forrigePeriode?.tom !== undefined && erEtter(periode.fom, forrigePeriode.tom);
                    });
            },
            { error: 'Oppgitte refusjonsperioder må ikke overlappe' },
        )
        .refine(
            (skjema) =>
                skjema.refusjonsperioder
                    .sort((a, b) => sorter(a.fom, b.fom))
                    .every((periode, index, arr) => {
                        if (index === 0) return true;
                        const forrigePeriode = arr[index - 1];
                        return forrigePeriode?.tom !== undefined && plussEnDag(forrigePeriode.tom) === periode.fom;
                    }),
            { error: 'Oppgitte refusjonsperioder må være sammenhengende' },
        )
        .refine(
            (skjema) => {
                const sortertePerioder = skjema.refusjonsperioder.sort((a, b) => sorter(a.fom, b.fom));

                const førsteFom = sortertePerioder[0]?.fom;
                const sisteTom = sortertePerioder[sortertePerioder.length - 1]?.tom;

                return førsteFom === sykefraværstilfelle.fom && sisteTom === sykefraværstilfelle.tom;
            },
            { error: 'Oppgitte refusjonsperioder må dekke hele sykefraværstilfellet' },
        );

export type RefusjonsperiodeSchema = z.infer<typeof refusjonsperiodeSchema>;
const refusjonsperiodeSchema = z
    .object({
        fom: z.string('Fra og med dato er påkrevd'),
        tom: z.string('Til og med dato er påkrevd').optional(),
        beløp: z
            .number({
                error: (issue) =>
                    issue.input == null || issue.input === ''
                        ? 'Månedsbeløp refusjonsbeløp er påkrevd'
                        : 'Månedlig refusjonsbeløp må være et tall',
            })
            .min(0, 'Månedlig refusjonsbeløp må være større eller lik 0'),
        kilde: z.string(),
    })
    .refine(
        ({ fom, tom }) => {
            if (tom == null || tom === '') return true;
            return erFør(fom, tom);
        },
        {
            path: ['fom'],
            error: 'Fra og med dato må være før til og med dato',
        },
    );

export const sorter = (datoA: DateString, datoB: DateString): number => {
    if (erFør(datoA, datoB)) return -1;
    if (erEtter(datoA, datoB)) return 1;
    return 0;
};
