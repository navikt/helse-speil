import dayjs from 'dayjs';
import * as R from 'remeda';
import { z } from 'zod/v4';

import { DateString } from '@typer/shared';
import { Utbetalingstabelldag, Utbetalingstabelldagtype } from '@typer/utbetalingstabell';
import { ISO_DATOFORMAT } from '@utils/date';

const finnDagerISluttenAvPerioden = (
    dager: Utbetalingstabelldag[],
    sluttenAvPerioden: DateString,
): Utbetalingstabelldag[] => {
    return dager.find((dag) => dag.dato === sluttenAvPerioden)
        ? dager.reverse().reduce((latest: Utbetalingstabelldag[], periode) => {
              return dayjs(
                  latest[latest.length - 1]?.dato ??
                      dayjs(sluttenAvPerioden, ISO_DATOFORMAT).add(1, 'days').format(ISO_DATOFORMAT),
              )
                  .subtract(1, 'days')
                  .format(ISO_DATOFORMAT) === periode.dato || periode.dato === sluttenAvPerioden
                  ? [...latest, periode]
                  : [...latest];
          }, [])
        : [];
};

const finnDagerIStartenAvPerioden = (
    dager: Utbetalingstabelldag[],
    startenAvPerioden: DateString,
): Utbetalingstabelldag[] => {
    return dager.find((dag) => dag.dato === startenAvPerioden)
        ? dager.reduce((newest: Utbetalingstabelldag[], periode) => {
              return dayjs(
                  newest[newest.length - 1]?.dato ??
                      dayjs(startenAvPerioden, ISO_DATOFORMAT).subtract(1, 'days').format(ISO_DATOFORMAT),
              )
                  .add(1, 'days')
                  .format(ISO_DATOFORMAT) === periode.dato || periode.dato === startenAvPerioden
                  ? [...newest, periode]
                  : [...newest];
          }, [])
        : [];
};

type StartOgSluttAvPerioden = {
    startenAvPerioden: DateString;
    sluttenAvPerioden: DateString;
};

const getStartOgSluttAvPerioden = (
    alleDager: Map<string, Utbetalingstabelldag>,
    førsteOverstyrteDagtype?: Utbetalingstabelldagtype,
    sisteOverstyrteDagtype?: Utbetalingstabelldagtype,
): StartOgSluttAvPerioden => {
    // TODO: ikke sjekk mot visningstekst
    const startenAvPerioden = førsteOverstyrteDagtype
        ? (R.first([...Array.from(alleDager.values())].filter((it) => it.dag.visningstekst !== førsteOverstyrteDagtype))
              ?.dato ?? '')
        : '';
    const sluttenAvPerioden = sisteOverstyrteDagtype
        ? (R.last([...Array.from(alleDager.values())].filter((it) => it.dag.visningstekst !== sisteOverstyrteDagtype))
              ?.dato ?? '')
        : '';

    return { startenAvPerioden, sluttenAvPerioden };
};

const sjekkArbeidsdager = (
    overstyrteDager: Map<string, Utbetalingstabelldag>,
    alleDager: Map<string, Utbetalingstabelldag>,
    erSelvstendig: boolean,
    ctx: z.RefinementCtx,
): void => {
    const overstyrtTilArbeidsdager = Array.from(overstyrteDager.values())
        .filter((overstyrtDag) => overstyrtDag.dag.speilDagtype === 'Arbeid')
        .sort((a, b) => dayjs(a.dato).diff(dayjs(b.dato)));

    if (overstyrtTilArbeidsdager.length === 0) {
        return;
    }

    const { sluttenAvPerioden } = getStartOgSluttAvPerioden(
        alleDager,
        undefined,
        R.last([...Array.from(overstyrteDager.values())])?.dag.speilDagtype,
    );

    const dagerISluttenAvPerioden = finnDagerISluttenAvPerioden(overstyrtTilArbeidsdager, sluttenAvPerioden);

    const dagerSomKanOverstyresTilArbeidsdag: Utbetalingstabelldag[] = overstyrtTilArbeidsdager.filter(
        (dag) =>
            dag.erAGP ||
            dag.erNyDag ||
            !['Syk', 'SykHelg', 'Ferie'].includes(dag?.fraType ?? '') ||
            dagerISluttenAvPerioden.includes(dag),
    );

    if (dagerSomKanOverstyresTilArbeidsdag.length !== overstyrtTilArbeidsdager.length) {
        ctx.addIssue({
            code: 'custom',
            path: ['arbeidsdagerKanIkkeOverstyres'],
            input: undefined,
            message: erSelvstendig
                ? 'Du kan ikke overstyre fra Syk til Arbeid for denne/disse dagen(e). Du kan foreløpig kun overstyre til Arbeid i slutten av søknadsperioden'
                : 'Du kan ikke overstyre Syk eller Ferie til Arbeidsdag. Arbeidsdag kan legges til i forkant av perioden, i slutten av perioden, eller endres i arbeidsgiverperioden',
        });
    }
};

const sjekkArbeidIkkeGjenopptatt = (overstyrteDager: Map<string, Utbetalingstabelldag>, ctx: z.RefinementCtx): void => {
    const overstyrtTilArbeidIkkeGjenopptatt = Array.from(overstyrteDager.values()).filter(
        (overstyrtDag) =>
            overstyrtDag.dag.speilDagtype === 'ArbeidIkkeGjenopptatt' && overstyrtDag.kilde.type !== 'SAKSBEHANDLER',
    );

    if (overstyrtTilArbeidIkkeGjenopptatt.length > 0) {
        ctx.addIssue({
            code: 'custom',
            path: ['kanIkkeOverstyreTilArbeidIkkeGjenopptatt'],
            input: undefined,
            message:
                'Du kan ikke overstyre til arbeid ikke gjenopptatt. Du kan bare overstyre til arbeid ikke gjenopptatt på dager som allerede er overstyrt av saksbehandler eller så kan arbeid ikke gjenopptatt legges til som en ny dag i starten av perioden.',
        });
    }
};

const sjekkAndreYtelser = (
    overstyrteDager: Map<string, Utbetalingstabelldag>,
    alleDager: Map<string, Utbetalingstabelldag>,
    ctx: z.RefinementCtx,
): void => {
    const overstyrtTilAnnenYtelsesdag = Array.from(overstyrteDager.values())
        .filter((overstyrtDag) =>
            [
                'Foreldrepenger',
                'AAP',
                'Dagpenger',
                'Svangerskapspenger',
                'Pleiepenger',
                'Omsorgspenger',
                'Opplæringspenger',
            ].includes(overstyrtDag.dag.speilDagtype),
        )
        .sort((a, b) => dayjs(a.dato).diff(dayjs(b.dato)));

    if (overstyrtTilAnnenYtelsesdag.length === 0) {
        return;
    }

    const { sluttenAvPerioden, startenAvPerioden } = getStartOgSluttAvPerioden(
        alleDager,
        R.first([...Array.from(overstyrteDager.values())])?.dag.speilDagtype,
        R.last([...Array.from(overstyrteDager.values())])?.dag.speilDagtype,
    );

    const dagerISluttenAvPerioden = finnDagerISluttenAvPerioden(overstyrtTilAnnenYtelsesdag, sluttenAvPerioden);
    const dagerIStartenAvPerioden = finnDagerIStartenAvPerioden(overstyrtTilAnnenYtelsesdag, startenAvPerioden);

    const dagerSomKanOverstyresTilAnnenYtelse: Utbetalingstabelldag[] = overstyrtTilAnnenYtelsesdag.filter(
        (dag) => dag.erNyDag || dagerISluttenAvPerioden.includes(dag) || dagerIStartenAvPerioden.includes(dag),
    );

    if (dagerSomKanOverstyresTilAnnenYtelse.length !== overstyrtTilAnnenYtelsesdag.length) {
        ctx.addIssue({
            code: 'custom',
            path: ['kanIkkeOverstyreTilAnnenYtelse'],
            input: undefined,
            message:
                'Andre ytelser kan legges til i forkant av perioden, i starten av perioden eller i slutten av perioden',
        });
    }
};

const sjekkSykNav = (overstyrteDager: Map<string, Utbetalingstabelldag>, ctx: z.RefinementCtx): void => {
    const overstyrtTilSykNav = Array.from(overstyrteDager.values())
        .filter((overstyrtDag) => overstyrtDag.dag.speilDagtype === 'SykNav')
        .sort((a, b) => dayjs(a.dato).diff(dayjs(b.dato)));

    if (overstyrtTilSykNav.length === 0) {
        return;
    }

    const dagerSomKanOverstyresTilSykNav: Utbetalingstabelldag[] = overstyrtTilSykNav.filter(
        (dag) => dag.erAGP || dag.erNyDag,
    );

    if (dagerSomKanOverstyresTilSykNav.length !== overstyrtTilSykNav.length) {
        ctx.addIssue({
            code: 'custom',
            path: ['kanIkkeOverstyreTilSykNav'],
            input: undefined,
            message: 'Syk (Nav) kan kun overstyres i arbeidsgiverperioden eller legges til som en ny dag.',
        });
    }
};

const sjekkEgenmelding = (
    overstyrteDager: Map<string, Utbetalingstabelldag>,
    alleDager: Map<string, Utbetalingstabelldag>,
    ctx: z.RefinementCtx,
): void => {
    const overstyrtTilEgenmelding = Array.from(overstyrteDager.values())
        .filter((overstyrtDag) => overstyrtDag.dag.speilDagtype === 'Egenmelding')
        .sort((a, b) => dayjs(a.dato).diff(dayjs(b.dato)));

    if (overstyrtTilEgenmelding.length === 0) {
        return;
    }

    const førsteDagMedAgp = Array.from(alleDager.values())
        .sort((a, b) => dayjs(a.dato).diff(dayjs(b.dato)))
        .find((dag) => dag.erAGP && dag.dag.speilDagtype === 'Syk')?.dato;

    const dagerSomKanOverstyresTilEgenmelding: Utbetalingstabelldag[] = overstyrtTilEgenmelding.filter((dag) => {
        return dag.erAGP || dag.erNyDag || dayjs(dag.dato).isBefore(førsteDagMedAgp ?? null);
    });

    if (dagerSomKanOverstyresTilEgenmelding.length !== overstyrtTilEgenmelding.length) {
        ctx.addIssue({
            code: 'custom',
            path: ['kanIkkeOverstyreTilEgenmelding'],
            input: undefined,
            message: 'Egenmelding kan kun overstyres i eller før arbeidsgiverperioden eller legges til som en ny dag.',
        });
    }
};

/*
 * I motsetning til den gamle && -kjeden i OverstyringForm kjøres alle sjekkene her uavhengig av
 * hverandre, slik at alle regelbrudd rapporteres som issues samtidig i stedet for å stoppe ved
 * det første.
 */
export const lagOverstyringSchema = (
    overstyrteDager: Map<string, Utbetalingstabelldag>,
    alleDager: Map<string, Utbetalingstabelldag>,
    erSelvstendig: boolean,
) =>
    z
        .object({
            begrunnelse: z.string().min(1, 'Begrunnelse må fylles ut'),
        })
        .superRefine((_data, ctx) => {
            sjekkArbeidsdager(overstyrteDager, alleDager, erSelvstendig, ctx);
            sjekkArbeidIkkeGjenopptatt(overstyrteDager, ctx);
            sjekkAndreYtelser(overstyrteDager, alleDager, ctx);
            sjekkSykNav(overstyrteDager, ctx);
            sjekkEgenmelding(overstyrteDager, alleDager, ctx);
        });

export type OverstyringFormFields = z.infer<ReturnType<typeof lagOverstyringSchema>>;
