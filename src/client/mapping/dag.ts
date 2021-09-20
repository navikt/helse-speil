import {
    EksternSykdomsdag,
    SpleisSykdomsdagkilde,
    SpleisSykdomsdagkildeType,
    SpleisSykdomsdagtype,
    SpleisUtbetalingsdag,
    SpleisUtbetalingsdagtype,
    SpleisVilkår,
} from 'external-types';

import { somDato } from './vedtaksperiode';

export const utbetalingstidslinjedag = (dag: SpleisUtbetalingsdagtype): Dag['type'] => {
    switch (dag) {
        case SpleisUtbetalingsdagtype.ARBEIDSGIVERPERIODE:
            return 'Arbeidsgiverperiode';
        case SpleisUtbetalingsdagtype.NAVDAG:
            return 'Syk';
        case SpleisUtbetalingsdagtype.HELGEDAG:
        case SpleisUtbetalingsdagtype.NAVHELG:
            return 'Helg';
        case SpleisUtbetalingsdagtype.FERIEDAG:
            return 'Ferie';
        case SpleisUtbetalingsdagtype.UKJENTDAG:
            return 'Ubestemt';
        case SpleisUtbetalingsdagtype.ARBEIDSDAG:
            return 'Arbeidsdag';
        case SpleisUtbetalingsdagtype.AVVISTDAG:
            return 'Avslått';
        case SpleisUtbetalingsdagtype.FORELDETDAG:
            return 'Foreldet';
    }
};

export const sykdomstidslinjedag = (dag: SpleisSykdomsdagtype): Dag['type'] => {
    switch (dag) {
        case SpleisSykdomsdagtype.SYKEDAG_SØKNAD:
        case SpleisSykdomsdagtype.SYKEDAG_SYKMELDING:
        case SpleisSykdomsdagtype.SYKEDAG:
            return 'Syk';
        case SpleisSykdomsdagtype.PERMISJONSDAG:
        case SpleisSykdomsdagtype.PERMISJONSDAG_SØKNAD:
            return 'Permisjon';
        case SpleisSykdomsdagtype.FERIEDAG_INNTEKTSMELDING:
        case SpleisSykdomsdagtype.FERIEDAG_SØKNAD:
        case SpleisSykdomsdagtype.FERIEDAG:
            return 'Ferie';
        case SpleisSykdomsdagtype.UTENLANDSDAG:
        case SpleisSykdomsdagtype.UBESTEMTDAG:
        case SpleisSykdomsdagtype.STUDIEDAG:
            return 'Ubestemt';
        case SpleisSykdomsdagtype.IMPLISITT_DAG:
        case SpleisSykdomsdagtype.ARBEIDSDAG:
        case SpleisSykdomsdagtype.ARBEIDSDAG_SØKNAD:
        case SpleisSykdomsdagtype.ARBEIDSDAG_INNTEKTSMELDING:
            return 'Arbeidsdag';
        case SpleisSykdomsdagtype.SYK_HELGEDAG:
        case SpleisSykdomsdagtype.FRISK_HELGEDAG:
        case SpleisSykdomsdagtype.SYK_HELGEDAG_SYKMELDING:
        case SpleisSykdomsdagtype.SYK_HELGEDAG_SØKNAD:
        case SpleisSykdomsdagtype.FRISK_HELGEDAG_INNTEKTSMELDING:
        case SpleisSykdomsdagtype.FRISK_HELGEDAG_SØKNAD:
            return 'Helg';
        case SpleisSykdomsdagtype.ARBEIDSGIVERDAG:
        case SpleisSykdomsdagtype.EGENMELDINGSDAG_INNTEKTSMELDING:
        case SpleisSykdomsdagtype.EGENMELDINGSDAG_SØKNAD:
            return 'Egenmelding';
        case SpleisSykdomsdagtype.FORELDET_SYKEDAG:
            return 'Foreldet';
        case SpleisSykdomsdagtype.ANNULLERT_DAG:
            return 'Annullert';
    }
};

const hendelseTypeGammel = (type: SpleisSykdomsdagtype): Sykdomsdag['kilde'] | undefined => {
    switch (type) {
        case SpleisSykdomsdagtype.ARBEIDSDAG_INNTEKTSMELDING:
        case SpleisSykdomsdagtype.EGENMELDINGSDAG_INNTEKTSMELDING:
        case SpleisSykdomsdagtype.FERIEDAG_INNTEKTSMELDING:
        case SpleisSykdomsdagtype.FRISK_HELGEDAG_INNTEKTSMELDING:
            return 'Inntektsmelding';
        case SpleisSykdomsdagtype.ARBEIDSDAG_SØKNAD:
        case SpleisSykdomsdagtype.EGENMELDINGSDAG_SØKNAD:
        case SpleisSykdomsdagtype.FERIEDAG_SØKNAD:
        case SpleisSykdomsdagtype.FRISK_HELGEDAG_SØKNAD:
        case SpleisSykdomsdagtype.PERMISJONSDAG_SØKNAD:
        case SpleisSykdomsdagtype.SYKEDAG_SØKNAD:
        case SpleisSykdomsdagtype.SYK_HELGEDAG_SØKNAD:
        case SpleisSykdomsdagtype.STUDIEDAG:
        case SpleisSykdomsdagtype.UTENLANDSDAG:
            return 'Søknad';
        case SpleisSykdomsdagtype.SYK_HELGEDAG_SYKMELDING:
        case SpleisSykdomsdagtype.SYKEDAG_SYKMELDING:
            return 'Sykmelding';
        case SpleisSykdomsdagtype.ANNULLERT_DAG:
            return 'Saksbehandler';
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

const hendelseType = (kilde: SpleisSykdomsdagkilde | undefined): Sykdomsdag['kilde'] | undefined => {
    switch (kilde?.type) {
        case SpleisSykdomsdagkildeType.SAKSBEHANDLER:
            return 'Saksbehandler';
        case SpleisSykdomsdagkildeType.INNTEKTSMELDING:
            return 'Inntektsmelding';
        case SpleisSykdomsdagkildeType.SØKNAD:
            return 'Søknad';
        case SpleisSykdomsdagkildeType.SYKMELDING:
            return 'Sykmelding';
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

const getAvvistÅrsaker = (begrunnelse: Avvisning['tekst'], erOver67SisteSykedag: boolean) => ({
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

export const mapUtbetalingsdag =
    (vilkår?: SpleisVilkår) =>
    (dag: SpleisUtbetalingsdag): Utbetalingsdag => ({
        type: utbetalingstidslinjedag(dag.type as SpleisUtbetalingsdagtype),
        dato: somDato(dag.dato),
        gradering: somHeltall(dag.grad),
        totalGradering: somHeltall(dag.totalGrad),
        utbetaling: dag.utbetaling,
        avvistÅrsaker: dag.begrunnelser?.map((begrunnelse) => getAvvistÅrsak(begrunnelse, vilkår)) as Avvisning[],
    });

export const mapUtbetalingstidslinje = (
    utbetalingstidslinje: SpleisUtbetalingsdag[],
    vilkår?: SpleisVilkår
): Utbetalingsdag[] => utbetalingstidslinje.map(mapUtbetalingsdag(vilkår));
