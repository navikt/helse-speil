import { somDato } from './vedtaksperiode';

export const utbetalingstidslinjedag = (dag: ExternalUtbetalingsdagtype): Dag['type'] => {
    switch (dag) {
        case 'ArbeidsgiverperiodeDag':
            return 'Arbeidsgiverperiode';
        case 'NavDag':
            return 'Syk';
        case 'Helgedag':
        case 'NavHelgDag':
            return 'Helg';
        case 'Feriedag':
            return 'Ferie';
        case 'UkjentDag':
            return 'Ubestemt';
        case 'Arbeidsdag':
            return 'Arbeidsdag';
        case 'AvvistDag':
            return 'Avslått';
        case 'ForeldetDag':
            return 'Foreldet';
    }
};

export const sykdomstidslinjedag = (dag: ExternalSykdomsdagtype): Dag['type'] => {
    switch (dag) {
        case 'SYKEDAG_SØKNAD':
        case 'SYKEDAG_SYKMELDING':
        case 'SYKEDAG':
            return 'Syk';
        case 'PERMISJONSDAG':
        case 'PERMISJONSDAG_SØKNAD':
            return 'Permisjon';
        case 'FERIEDAG_INNTEKTSMELDING':
        case 'FERIEDAG_SØKNAD':
        case 'FERIEDAG':
            return 'Ferie';
        case 'UTENLANDSDAG':
        case 'UBESTEMTDAG':
        case 'STUDIEDAG':
            return 'Ubestemt';
        case 'IMPLISITT_DAG':
        case 'ARBEIDSDAG':
        case 'ARBEIDSDAG_SØKNAD':
        case 'ARBEIDSDAG_INNTEKTSMELDING':
            return 'Arbeidsdag';
        case 'SYK_HELGEDAG':
        case 'FRISK_HELGEDAG':
        case 'SYK_HELGEDAG_SYKMELDING':
        case 'SYK_HELGEDAG_SØKNAD':
        case 'FRISK_HELGEDAG_INNTEKTSMELDING':
        case 'FRISK_HELGEDAG_SØKNAD':
            return 'Helg';
        case 'ARBEIDSGIVERDAG':
        case 'EGENMELDINGSDAG_INNTEKTSMELDING':
        case 'EGENMELDINGSDAG_SØKNAD':
            return 'Egenmelding';
        case 'FORELDET_SYKEDAG':
            return 'Foreldet';
        case 'ANNULLERT_DAG':
            return 'Annullert';
    }
};

const hendelseTypeGammel = (type: ExternalSykdomsdagtype): Sykdomsdag['kilde'] | undefined => {
    switch (type) {
        case 'ARBEIDSDAG_INNTEKTSMELDING':
        case 'EGENMELDINGSDAG_INNTEKTSMELDING':
        case 'FERIEDAG_INNTEKTSMELDING':
        case 'FRISK_HELGEDAG_INNTEKTSMELDING':
            return 'Inntektsmelding';
        case 'ARBEIDSDAG_SØKNAD':
        case 'EGENMELDINGSDAG_SØKNAD':
        case 'FERIEDAG_SØKNAD':
        case 'FRISK_HELGEDAG_SØKNAD':
        case 'PERMISJONSDAG_SØKNAD':
        case 'SYKEDAG_SØKNAD':
        case 'SYK_HELGEDAG_SØKNAD':
        case 'STUDIEDAG':
        case 'UTENLANDSDAG':
            return 'Søknad';
        case 'SYK_HELGEDAG_SYKMELDING':
        case 'SYKEDAG_SYKMELDING':
            return 'Sykmelding';
        case 'ANNULLERT_DAG':
            return 'Saksbehandler';
        case 'FORELDET_SYKEDAG':
        case 'UBESTEMTDAG':
        case 'IMPLISITT_DAG':
            return undefined;

        // For å slippe typescript-warning om ufullstendig code path defineres de nye typene også
        case 'ARBEIDSDAG':
        case 'ARBEIDSGIVERDAG':
        case 'FERIEDAG':
        case 'FRISK_HELGEDAG':
        case 'PERMISJONSDAG':
        case 'SYKEDAG':
        case 'SYK_HELGEDAG':
            return undefined;
    }
};

const hendelseType = (kilde: ExternalSykdomsdag['kilde'] | undefined): Sykdomsdag['kilde'] | undefined => {
    switch (kilde?.type) {
        case 'Saksbehandler':
            return 'Saksbehandler';
        case 'Inntektsmelding':
            return 'Inntektsmelding';
        case 'Søknad':
            return 'Søknad';
        case 'Sykmelding':
            return 'Sykmelding';
        default:
            return undefined;
    }
};

const somHeltall = (value?: number) => value && +value.toFixed(0);

export const mapSykdomstidslinje = (sykdomstidslinje: ExternalSykdomsdag[]): Sykdomsdag[] =>
    sykdomstidslinje.map((dag) => ({
        type: sykdomstidslinjedag(dag.type),
        dato: somDato(dag.dagen),
        gradering: somHeltall(dag.grad),
        kilde: dag.kilde ? hendelseType(dag.kilde) : hendelseTypeGammel(dag.type),
        kildeId: dag.kilde?.kildeId ?? undefined,
    }));

const getAvvistÅrsak = (begrunnelse: string, vilkår?: ExternalVedtaksperiode['vilkår']) =>
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
    (vilkår?: ExternalVedtaksperiode['vilkår']) =>
    (dag: ExternalUtbetalingsdag): Utbetalingsdag => ({
        type: utbetalingstidslinjedag(dag.type as ExternalUtbetalingsdagtype),
        dato: somDato(dag.dato),
        gradering: somHeltall(dag.grad),
        totalGradering: somHeltall(dag.totalGrad),
        utbetaling: dag.utbetaling,
        avvistÅrsaker: dag.begrunnelser?.map((begrunnelse) => getAvvistÅrsak(begrunnelse, vilkår)) as Avvisning[],
    });

export const mapUtbetalingstidslinje = (
    utbetalingstidslinje: ExternalUtbetalingsdag[],
    vilkår?: ExternalVedtaksperiode['vilkår']
): Utbetalingsdag[] => utbetalingstidslinje.map(mapUtbetalingsdag(vilkår));
