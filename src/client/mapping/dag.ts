import {
    EksternSykdomsdag,
    SpleisSykdomsdagkilde,
    SpleisSykdomsdagkildeType,
    SpleisSykdomsdagtype,
    SpleisUtbetalingsdag,
    SpleisUtbetalingsdagtype,
    SpleisVilkår,
} from 'external-types';
import { Alder, Dagtype, Kildetype, Sykdomsdag, Utbetalingsdag } from 'internal-types';

import { somDato } from './vedtaksperiode';

export const utbetalingstidslinjedag = (dag: SpleisUtbetalingsdagtype): Dagtype => {
    switch (dag) {
        case SpleisUtbetalingsdagtype.ARBEIDSGIVERPERIODE:
            return Dagtype.Arbeidsgiverperiode;
        case SpleisUtbetalingsdagtype.NAVDAG:
            return Dagtype.Syk;
        case SpleisUtbetalingsdagtype.HELGEDAG:
        case SpleisUtbetalingsdagtype.NAVHELG:
            return Dagtype.Helg;
        case SpleisUtbetalingsdagtype.FERIEDAG:
            return Dagtype.Ferie;
        case SpleisUtbetalingsdagtype.UKJENTDAG:
            return Dagtype.Ubestemt;
        case SpleisUtbetalingsdagtype.ARBEIDSDAG:
            return Dagtype.Arbeidsdag;
        case SpleisUtbetalingsdagtype.AVVISTDAG:
            return Dagtype.Avvist;
        case SpleisUtbetalingsdagtype.FORELDETDAG:
            return Dagtype.Foreldet;
    }
};

export const sykdomstidslinjedag = (dag: SpleisSykdomsdagtype): Dagtype => {
    switch (dag) {
        case SpleisSykdomsdagtype.SYKEDAG_SØKNAD:
        case SpleisSykdomsdagtype.SYKEDAG_SYKMELDING:
        case SpleisSykdomsdagtype.SYKEDAG:
            return Dagtype.Syk;
        case SpleisSykdomsdagtype.PERMISJONSDAG:
        case SpleisSykdomsdagtype.PERMISJONSDAG_SØKNAD:
            return Dagtype.Permisjon;
        case SpleisSykdomsdagtype.FERIEDAG_INNTEKTSMELDING:
        case SpleisSykdomsdagtype.FERIEDAG_SØKNAD:
        case SpleisSykdomsdagtype.FERIEDAG:
            return Dagtype.Ferie;
        case SpleisSykdomsdagtype.UTENLANDSDAG:
        case SpleisSykdomsdagtype.UBESTEMTDAG:
        case SpleisSykdomsdagtype.STUDIEDAG:
            return Dagtype.Ubestemt;
        case SpleisSykdomsdagtype.IMPLISITT_DAG:
        case SpleisSykdomsdagtype.ARBEIDSDAG:
        case SpleisSykdomsdagtype.ARBEIDSDAG_SØKNAD:
        case SpleisSykdomsdagtype.ARBEIDSDAG_INNTEKTSMELDING:
            return Dagtype.Arbeidsdag;
        case SpleisSykdomsdagtype.SYK_HELGEDAG:
        case SpleisSykdomsdagtype.FRISK_HELGEDAG:
        case SpleisSykdomsdagtype.SYK_HELGEDAG_SYKMELDING:
        case SpleisSykdomsdagtype.SYK_HELGEDAG_SØKNAD:
        case SpleisSykdomsdagtype.FRISK_HELGEDAG_INNTEKTSMELDING:
        case SpleisSykdomsdagtype.FRISK_HELGEDAG_SØKNAD:
            return Dagtype.Helg;
        case SpleisSykdomsdagtype.ARBEIDSGIVERDAG:
        case SpleisSykdomsdagtype.EGENMELDINGSDAG_INNTEKTSMELDING:
        case SpleisSykdomsdagtype.EGENMELDINGSDAG_SØKNAD:
            return Dagtype.Egenmelding;
        case SpleisSykdomsdagtype.FORELDET_SYKEDAG:
            return Dagtype.Foreldet;
        case SpleisSykdomsdagtype.ANNULLERT_DAG:
            return Dagtype.Annullert;
    }
};

const hendelseTypeGammel = (type: SpleisSykdomsdagtype): Kildetype | undefined => {
    switch (type) {
        case SpleisSykdomsdagtype.ARBEIDSDAG_INNTEKTSMELDING:
        case SpleisSykdomsdagtype.EGENMELDINGSDAG_INNTEKTSMELDING:
        case SpleisSykdomsdagtype.FERIEDAG_INNTEKTSMELDING:
        case SpleisSykdomsdagtype.FRISK_HELGEDAG_INNTEKTSMELDING:
            return Kildetype.Inntektsmelding;
        case SpleisSykdomsdagtype.ARBEIDSDAG_SØKNAD:
        case SpleisSykdomsdagtype.EGENMELDINGSDAG_SØKNAD:
        case SpleisSykdomsdagtype.FERIEDAG_SØKNAD:
        case SpleisSykdomsdagtype.FRISK_HELGEDAG_SØKNAD:
        case SpleisSykdomsdagtype.PERMISJONSDAG_SØKNAD:
        case SpleisSykdomsdagtype.SYKEDAG_SØKNAD:
        case SpleisSykdomsdagtype.SYK_HELGEDAG_SØKNAD:
        case SpleisSykdomsdagtype.STUDIEDAG:
        case SpleisSykdomsdagtype.UTENLANDSDAG:
            return Kildetype.Søknad;
        case SpleisSykdomsdagtype.SYK_HELGEDAG_SYKMELDING:
        case SpleisSykdomsdagtype.SYKEDAG_SYKMELDING:
            return Kildetype.Sykmelding;
        case SpleisSykdomsdagtype.ANNULLERT_DAG:
            return Kildetype.Saksbehandler;
        case SpleisSykdomsdagtype.FORELDET_SYKEDAG:
        case SpleisSykdomsdagtype.UBESTEMTDAG:
        case SpleisSykdomsdagtype.IMPLISITT_DAG:
            return undefined;

        // For å slippe typescript-warning om ufullstendig code path defineres de nye typene også
        case SpleisSykdomsdagtype.ARBEIDSDAG:
        case SpleisSykdomsdagtype.ARBEIDSGIVERDAG:
        case SpleisSykdomsdagtype.FERIEDAG:
        case SpleisSykdomsdagtype.FRISK_HELGEDAG:
        case SpleisSykdomsdagtype.PERMISJONSDAG:
        case SpleisSykdomsdagtype.SYKEDAG:
        case SpleisSykdomsdagtype.SYK_HELGEDAG:
            return undefined;
    }
};

const hendelseType = (kilde: SpleisSykdomsdagkilde | undefined): Kildetype | undefined => {
    switch (kilde?.type) {
        case SpleisSykdomsdagkildeType.SAKSBEHANDLER:
            return Kildetype.Saksbehandler;
        case SpleisSykdomsdagkildeType.INNTEKTSMELDING:
            return Kildetype.Inntektsmelding;
        case SpleisSykdomsdagkildeType.SØKNAD:
            return Kildetype.Søknad;
        case SpleisSykdomsdagkildeType.SYKMELDING:
            return Kildetype.Sykmelding;
        default:
            return undefined;
    }
};

const somHeltall = (value?: number) => value && +value.toFixed(0);

export const mapSykdomstidslinje = (sykdomstidslinje: EksternSykdomsdag[]): Sykdomsdag[] =>
    sykdomstidslinje.map((dag) => ({
        type: sykdomstidslinjedag(dag.type),
        dato: somDato(dag.dagen),
        gradering: somHeltall(dag.grad),
        kilde: dag.kilde ? hendelseType(dag.kilde) : hendelseTypeGammel(dag.type),
        kildeId: dag.kilde?.kildeId ?? undefined,
    }));

const getAvvistÅrsak = (begrunnelse: string, vilkår?: SpleisVilkår) =>
    vilkår
        ? {
              tekst: begrunnelse,
              paragraf: vilkår.alder.alderSisteSykedag >= 67 ? '8-51' : undefined,
          }
        : { tekst: begrunnelse };

const getAvvistÅrsaker = (begrunnelse: string, erOver67SisteSykedag: boolean) => ({
    tekst: begrunnelse,
    paragraf: erOver67SisteSykedag ? '8-51' : undefined,
});

export const mapTidslinjeMedAldersvilkår = (utbetalingstidslinje: Utbetalingsdag[], vilkår?: Alder) => {
    const erOver67SisteSykedag = (vilkår?.alderSisteSykedag ?? 0) >= 67;
    return utbetalingstidslinje.map((dag) => ({
        ...dag,
        avvistÅrsaker: dag.avvistÅrsaker?.map(({ tekst }) => getAvvistÅrsaker(tekst, erOver67SisteSykedag)),
    }));
};

export const mapUtbetalingsdag = (vilkår?: SpleisVilkår) => (dag: SpleisUtbetalingsdag): Utbetalingsdag => ({
    type: utbetalingstidslinjedag(dag.type as SpleisUtbetalingsdagtype),
    dato: somDato(dag.dato),
    gradering: somHeltall(dag.grad),
    totalGradering: somHeltall(dag.totalGrad),
    utbetaling: dag.utbetaling,
    avvistÅrsaker: dag.begrunnelser?.map((begrunnelse) => getAvvistÅrsak(begrunnelse, vilkår)),
});

export const mapUtbetalingstidslinje = (
    utbetalingstidslinje: SpleisUtbetalingsdag[],
    vilkår?: SpleisVilkår
): Utbetalingsdag[] => utbetalingstidslinje.map(mapUtbetalingsdag(vilkår));
