import dayjs from 'dayjs';
import * as R from 'remeda';
import { z } from 'zod/v4';

import { DateString } from '@typer/shared';
import { Utbetalingstabelldag, Utbetalingstabelldagtype } from '@typer/utbetalingstabell';
import { ISO_DATOFORMAT } from '@utils/date';

const sorterEtterDato = (a: Utbetalingstabelldag, b: Utbetalingstabelldag): number => dayjs(a.dato).diff(dayjs(b.dato));

/*
 * Feilkodene brukes som `path` på Zod-issues, og fungerer som nøkler i react-hook-forms
 * `formState.errors`. Samlet ett sted for å unngå skrivefeil når de refereres fra tester.
 */
export const overstyringFeilkoder = {
    arbeidsdag: 'arbeidsdagerKanIkkeOverstyres',
    arbeidIkkeGjenopptatt: 'kanIkkeOverstyreTilArbeidIkkeGjenopptatt',
    andreYtelser: 'kanIkkeOverstyreTilAnnenYtelse',
    sykNav: 'kanIkkeOverstyreTilSykNav',
    egenmelding: 'kanIkkeOverstyreTilEgenmelding',
} as const;

type OverstyringFeilkode = (typeof overstyringFeilkoder)[keyof typeof overstyringFeilkoder];

const leggTilFeil = (ctx: z.RefinementCtx, feilkode: OverstyringFeilkode, message: string): void => {
    ctx.addIssue({
        code: 'custom',
        path: [feilkode],
        message,
    });
};

/*
 * Rapporterer én issue dersom ikke alle dagene i `dager` er gyldige ifølge `erGyldig`. Brukes av
 * de fem forretningsregel-sjekkene under, som alle følger samme mønster: filtrer ut de overstyrte
 * dagene av en gitt type, og sjekk at samtlige oppfyller reglene for å kunne overstyres til den typen.
 */
const sjekkAtAlleErGyldige = (
    dager: Utbetalingstabelldag[],
    erGyldig: (dag: Utbetalingstabelldag) => boolean,
    ctx: z.RefinementCtx,
    feilkode: OverstyringFeilkode,
    message: string,
): void => {
    const gyldigeDager = dager.filter(erGyldig);

    if (gyldigeDager.length !== dager.length) {
        leggTilFeil(ctx, feilkode, message);
    }
};

const finnDagerISluttenAvPerioden = (
    dager: Utbetalingstabelldag[],
    sluttenAvPerioden: DateString,
): Utbetalingstabelldag[] => {
    return dager.find((dag) => dag.dato === sluttenAvPerioden)
        ? [...dager].reverse().reduce((latest: Utbetalingstabelldag[], periode) => {
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
        ? (R.first(Array.from(alleDager.values()).filter((it) => it.dag.visningstekst !== førsteOverstyrteDagtype))
              ?.dato ?? '')
        : '';
    const sluttenAvPerioden = sisteOverstyrteDagtype
        ? (R.last(Array.from(alleDager.values()).filter((it) => it.dag.visningstekst !== sisteOverstyrteDagtype))
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
    const alleOverstyrteDager = Array.from(overstyrteDager.values());
    const overstyrtTilArbeidsdager = alleOverstyrteDager
        .filter((overstyrtDag) => overstyrtDag.dag.speilDagtype === 'Arbeid')
        .sort(sorterEtterDato);

    if (overstyrtTilArbeidsdager.length === 0) {
        return;
    }

    const { sluttenAvPerioden } = getStartOgSluttAvPerioden(
        alleDager,
        undefined,
        R.last(alleOverstyrteDager)?.dag.speilDagtype,
    );

    const dagerISluttenAvPerioden = finnDagerISluttenAvPerioden(overstyrtTilArbeidsdager, sluttenAvPerioden);

    sjekkAtAlleErGyldige(
        overstyrtTilArbeidsdager,
        (dag) =>
            dag.erAGP ||
            dag.erNyDag ||
            !['Syk', 'SykHelg', 'Ferie'].includes(dag.fraType ?? '') ||
            dagerISluttenAvPerioden.includes(dag),
        ctx,
        overstyringFeilkoder.arbeidsdag,
        erSelvstendig
            ? 'Du kan ikke overstyre fra Syk til Arbeid for denne/disse dagen(e). Du kan foreløpig kun overstyre til Arbeid i slutten av søknadsperioden'
            : 'Du kan ikke overstyre Syk eller Ferie til Arbeidsdag. Arbeidsdag kan legges til i forkant av perioden, i slutten av perioden, eller endres i arbeidsgiverperioden',
    );
};

const sjekkArbeidIkkeGjenopptatt = (overstyrteDager: Map<string, Utbetalingstabelldag>, ctx: z.RefinementCtx): void => {
    sjekkAtAlleErGyldige(
        Array.from(overstyrteDager.values()),
        (dag) => !(dag.dag.speilDagtype === 'ArbeidIkkeGjenopptatt' && dag.kilde.type !== 'SAKSBEHANDLER'),
        ctx,
        overstyringFeilkoder.arbeidIkkeGjenopptatt,
        'Du kan ikke overstyre til arbeid ikke gjenopptatt. Du kan bare overstyre til arbeid ikke gjenopptatt på dager som allerede er overstyrt av saksbehandler eller så kan arbeid ikke gjenopptatt legges til som en ny dag i starten av perioden.',
    );
};

const sjekkAndreYtelser = (
    overstyrteDager: Map<string, Utbetalingstabelldag>,
    alleDager: Map<string, Utbetalingstabelldag>,
    ctx: z.RefinementCtx,
): void => {
    const alleOverstyrteDager = Array.from(overstyrteDager.values());
    const overstyrtTilAnnenYtelsesdag = alleOverstyrteDager
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
        .sort(sorterEtterDato);

    if (overstyrtTilAnnenYtelsesdag.length === 0) {
        return;
    }

    const { sluttenAvPerioden, startenAvPerioden } = getStartOgSluttAvPerioden(
        alleDager,
        R.first(alleOverstyrteDager)?.dag.speilDagtype,
        R.last(alleOverstyrteDager)?.dag.speilDagtype,
    );

    const dagerISluttenAvPerioden = finnDagerISluttenAvPerioden(overstyrtTilAnnenYtelsesdag, sluttenAvPerioden);
    const dagerIStartenAvPerioden = finnDagerIStartenAvPerioden(overstyrtTilAnnenYtelsesdag, startenAvPerioden);

    sjekkAtAlleErGyldige(
        overstyrtTilAnnenYtelsesdag,
        (dag) => dag.erNyDag || dagerISluttenAvPerioden.includes(dag) || dagerIStartenAvPerioden.includes(dag),
        ctx,
        overstyringFeilkoder.andreYtelser,
        'Andre ytelser kan legges til i forkant av perioden, i starten av perioden eller i slutten av perioden',
    );
};

const sjekkSykNav = (overstyrteDager: Map<string, Utbetalingstabelldag>, ctx: z.RefinementCtx): void => {
    const overstyrtTilSykNav = Array.from(overstyrteDager.values())
        .filter((overstyrtDag) => overstyrtDag.dag.speilDagtype === 'SykNav')
        .sort(sorterEtterDato);

    if (overstyrtTilSykNav.length === 0) {
        return;
    }

    sjekkAtAlleErGyldige(
        overstyrtTilSykNav,
        (dag) => Boolean(dag.erAGP || dag.erNyDag),
        ctx,
        overstyringFeilkoder.sykNav,
        'Syk (Nav) kan kun overstyres i arbeidsgiverperioden eller legges til som en ny dag.',
    );
};

const sjekkEgenmelding = (
    overstyrteDager: Map<string, Utbetalingstabelldag>,
    alleDager: Map<string, Utbetalingstabelldag>,
    ctx: z.RefinementCtx,
): void => {
    const overstyrtTilEgenmelding = Array.from(overstyrteDager.values())
        .filter((overstyrtDag) => overstyrtDag.dag.speilDagtype === 'Egenmelding')
        .sort(sorterEtterDato);

    if (overstyrtTilEgenmelding.length === 0) {
        return;
    }

    const førsteDagMedAgp = Array.from(alleDager.values())
        .sort(sorterEtterDato)
        .find((dag) => dag.erAGP && dag.dag.speilDagtype === 'Syk')?.dato;

    sjekkAtAlleErGyldige(
        overstyrtTilEgenmelding,
        (dag) =>
            dag.erAGP || dag.erNyDag || (førsteDagMedAgp !== undefined && dayjs(dag.dato).isBefore(førsteDagMedAgp)),
        ctx,
        overstyringFeilkoder.egenmelding,
        'Egenmelding kan kun overstyres i eller før arbeidsgiverperioden eller legges til som en ny dag.',
    );
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
