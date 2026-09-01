import { z } from 'zod/v4';

import { ApiGraderteAndreYtelseType, ApiGraderteAndreYtelser } from '@io/rest/generated/spesialist.schemas';
import { DatePeriod } from '@typer/shared';
import {
    erGyldigNorskDato,
    erIPeriode,
    norskDatoTilIsoDato,
    perioderOverlapper,
    plussEnDag,
    somNorskDato,
    tilDatoer,
} from '@utils/date';

export const ANNEN_YTELSE_OPTIONS = [
    'Foreldrepenger',
    'Svangerskapspenger',
    'Pleiepenger',
    'Omsorgspenger',
    'Opplæringspenger',
] as const;

export type YtelseValg = (typeof ANNEN_YTELSE_OPTIONS)[number];

/** Maks samlet gradering per dag. 100 % eller mer skal overstyres på dagen i stedet. */
const MAKS_SAMLET_GRAD = 99;

/** Antall datoperioder vi lister opp i feilmeldingen før vi forkorter med «m.fl.». */
const MAKS_ANTALL_DATOER_I_FEILMELDING = 5;

/** Slår sammen sammenhengende datoer til perioder, så feilmeldingen blir kort og lesbar. */
const tilSammenhengendePerioder = (isoDatoer: string[]): DatePeriod[] =>
    [...isoDatoer].sort().reduce<DatePeriod[]>((perioder, dato) => {
        const forrige = perioder.at(-1);
        if (forrige !== undefined && plussEnDag(forrige.tom) === dato) {
            forrige.tom = dato;
            return perioder;
        }
        return [...perioder, { fom: dato, tom: dato }];
    }, []);

const somNorskPeriodetekst = ({ fom, tom }: DatePeriod): string =>
    fom === tom ? `${somNorskDato(fom)}` : `${somNorskDato(fom)}–${somNorskDato(tom)}`;

export const ytelseTilApiType: Record<YtelseValg, ApiGraderteAndreYtelseType> = {
    Foreldrepenger: ApiGraderteAndreYtelseType.FORELDREPENGER,
    Svangerskapspenger: ApiGraderteAndreYtelseType.SVANGERSKAPSPENGER,
    Pleiepenger: ApiGraderteAndreYtelseType.PLEIEPENGER,
    Omsorgspenger: ApiGraderteAndreYtelseType.OMSORGSPENGER,
    Opplæringspenger: ApiGraderteAndreYtelseType.OPPLARINGSPENGER,
};

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
                .max(MAKS_SAMLET_GRAD, { error: `Grad må være ${MAKS_SAMLET_GRAD} eller lavere` })
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
            // Overlapp sjekkes før graderingen: to overlappende perioder for samme ytelse gir en misvisende
            // graderingssum, så vi stopper her og lar saksbehandler rette opp overlappet først.
            // Kun perioder med gyldige datoer i riktig rekkefølge sjekkes — resten gir allerede egne feilmeldinger.
            const skjemaperioder = ctx.value.perioder.map((periode) => {
                if (!erGyldigNorskDato(periode.fom) || !erGyldigNorskDato(periode.tom)) return null;
                const datoperiode = { fom: norskDatoTilIsoDato(periode.fom), tom: norskDatoTilIsoDato(periode.tom) };
                return datoperiode.fom <= datoperiode.tom ? datoperiode : null;
            });

            // Fjernede ytelser teller også med her: perioden er fortsatt opptatt selv om ytelsen er fjernet.
            const lagredePerioderForSammeYtelse: DatePeriod[] = alleGraderteAndreYtelser
                .filter(
                    (ytelse) =>
                        ytelse.andreYtelserId !== gjeldendeAndreYtelserId &&
                        ytelse.andreYtelseType === ytelseTilApiType[ctx.value.ytelse],
                )
                .flatMap((ytelse) => ytelse.perioder);

            skjemaperioder.forEach((periode, index) => {
                if (periode === null) return;

                const overlapperAnnenPeriodeISkjemaet = skjemaperioder.some(
                    (annenPeriode, annenIndex) =>
                        annenIndex !== index && annenPeriode !== null && perioderOverlapper(periode, annenPeriode),
                );
                const overlapperLagretPeriode = lagredePerioderForSammeYtelse.some((lagretPeriode) =>
                    perioderOverlapper(periode, lagretPeriode),
                );

                if (overlapperAnnenPeriodeISkjemaet) {
                    ctx.issues.push({
                        code: 'custom',
                        message: 'Perioden overlapper med en annen periode i skjemaet',
                        path: ['perioder', index, 'fom'],
                        input: ctx.value.perioder[index]?.fom,
                    });
                } else if (overlapperLagretPeriode) {
                    ctx.issues.push({
                        code: 'custom',
                        message: 'Perioden overlapper med en lagret periode for samme ytelse',
                        path: ['perioder', index, 'fom'],
                        input: ctx.value.perioder[index]?.fom,
                    });
                }
            });
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

            const datoerOverGrensen = Array.from(gradPerDag.entries())
                .filter(([, totalGrad]) => totalGrad > MAKS_SAMLET_GRAD)
                .map(([dato]) => dato);

            if (datoerOverGrensen.length > 0) {
                const perioderOverGrensen = tilSammenhengendePerioder(datoerOverGrensen);
                const datotekst = perioderOverGrensen
                    .slice(0, MAKS_ANTALL_DATOER_I_FEILMELDING)
                    .map(somNorskPeriodetekst)
                    .join(', ');
                const forkortet = perioderOverGrensen.length > MAKS_ANTALL_DATOER_I_FEILMELDING ? ' m.fl.' : '';

                ctx.issues.push({
                    code: 'custom',
                    message:
                        `Samlet gradering på tvers av alle ytelser kan ikke overstige ${MAKS_SAMLET_GRAD} %. ` +
                        `Grensen overskrides ${datotekst}${forkortet}.`,
                    path: ['perioder'],
                    input: ctx.value.perioder,
                });
            }
        });
