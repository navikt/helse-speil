import dayjs from 'dayjs';
import { z } from 'zod/v4';

import { DatePeriod, DateString } from '@typer/shared';
import { NORSK_DATOFORMAT, erEtter, erFør, norskDatoTilIsoDato, plussEnDag } from '@utils/date';

export type InntektOgRefusjonSchema = z.infer<typeof lagInntektOgRefusjonSchema>;
export const lagInntektOgRefusjonSchema = (sykefraværstilfelle: DatePeriod) =>
    z.object({
        månedsbeløp: z
            .number({
                error: (issue) =>
                    issue.input == null || issue.input === ''
                        ? 'Månedsbeløp er påkrevd'
                        : 'Månedsbeløp må være et tall',
            })
            .positive('Månedsbeløp må være større enn 0'),
        refusjonsperioder: z
            .array(
                z
                    .object({
                        fom: z
                            .string()
                            .refine(
                                (dato) => dayjs(dato, NORSK_DATOFORMAT, true).isValid(),
                                'Dato må være på norsk format (DD.MM.ÅÅÅÅ)',
                            ),
                        tom: z
                            .string()
                            .refine(
                                (dato) => dayjs(dato, NORSK_DATOFORMAT, true).isValid(),
                                'Dato må være på norsk format (DD.MM.ÅÅÅÅ)',
                            ),
                        beløp: z
                            .number({
                                error: (issue) =>
                                    issue.input == null || issue.input === ''
                                        ? 'Månedsbeløp refusjonsbeløp er påkrevd'
                                        : 'Månedlig refusjonsbeløp må være et tall',
                            })
                            .positive('Månedlig refusjonsbeløp må være større eller lik 0'),
                    })
                    .refine(
                        ({ fom, tom }) => {
                            if (tom == null || tom === '') return true;
                            return erFør(norskDatoTilIsoDato(fom), norskDatoTilIsoDato(tom));
                        },
                        {
                            path: ['fom'],
                            error: 'Fra og med dato må være før til og med dato',
                        },
                    ),
            )
            .min(1, 'Det må oppgis minst én refusjonsperiode')
            .refine(
                (perioder) => {
                    const hei = perioder
                        .map((periode) => ({
                            ...periode,
                            fom: norskDatoTilIsoDato(periode.fom),
                            tom: norskDatoTilIsoDato(periode.tom),
                        }))
                        .sort((a, b) => sorter(a.fom, b.fom));
                    return hei.every((periode, index, arr) => {
                        if (index === 0) return true;
                        const forrigePeriode = arr[index - 1];
                        console.log();
                        return forrigePeriode !== undefined && erEtter(periode.fom, forrigePeriode.tom);
                    });
                },
                { error: 'Oppgitte refusjonsperioder må ikke overlappe' },
            )
            .refine(
                (perioder) => {
                    const sortertePerioder = perioder
                        .map((periode) => ({
                            ...periode,
                            fom: norskDatoTilIsoDato(periode.fom),
                            tom: norskDatoTilIsoDato(periode.tom),
                        }))
                        .sort((a, b) => sorter(a.fom, b.fom));

                    const erSammenhengende = sortertePerioder.every((periode, index, arr) => {
                        if (index === 0) return true;
                        const forrigePeriode = arr[index - 1];
                        return forrigePeriode !== undefined && plussEnDag(forrigePeriode.tom) === periode.fom;
                    });

                    const førsteElement = sortertePerioder[0];
                    const sisteElement = sortertePerioder[sortertePerioder.length - 1];

                    const dekkerSykefraværstilfellet1 =
                        førsteElement !== undefined &&
                        sisteElement !== undefined &&
                        førsteElement.fom === norskDatoTilIsoDato(sykefraværstilfelle.fom) &&
                        sisteElement.tom === norskDatoTilIsoDato(sykefraværstilfelle.tom);

                    return erSammenhengende && dekkerSykefraværstilfellet1;
                },
                { error: 'Oppgitte refusjonsperioder må dekke hele sykefraværstilfellet' },
            ),
        begrunnelse: z.enum(
            [
                'Korrigert inntekt i inntektsmelding',
                'Tariffendring i inntektsmelding',
                'Innrapportert feil inntekt til A-ordningen',
                'Endring/opphør av refusjon',
                'Annen kilde til endring',
            ],
            {
                error: (issue) =>
                    issue.input === '' || issue.input == null ? 'Begrunnelse er påkrevd' : 'Ugyldig begrunnelse',
            },
        ),
        notat: z.string('Notat må være en tekst').min(1, 'Notat er påkrevd'),
    });

export const sorter = (datoA: DateString, datoB: DateString): number => {
    if (erFør(datoA, datoB)) return -1;
    if (erEtter(datoA, datoB)) return 1;
    return 0;
};
