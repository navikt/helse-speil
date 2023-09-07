type Maybe<T> = import('@io/graphql').Maybe<T>;
type Kilde = import('@io/graphql').Kilde;
type Begrunnelse = import('@io/graphql').Begrunnelse;
type Speildag = import('./utbetalingstabelldager').Speildag;

declare type Utbetalingstabelldagtype =
    | 'Syk'
    | 'Ferie'
    | 'FriskHelg'
    | 'Feriehelg'
    | 'SykHelg'
    | 'SykNav'
    | 'Helg'
    | 'Ukjent'
    | 'Egenmelding'
    | 'Permisjon'
    | 'Arbeid'
    | 'Avslått'
    | 'FerieUtenSykmelding'
    | 'Foreldrepenger'
    | 'AAP'
    | 'Dagpenger'
    | 'Svangerskapspenger'
    | 'Pleiepenger'
    | 'Omsorgspenger'
    | 'Opplæringspenger';

type OverstyringerPrDag = {
    hendelseId: string;
    begrunnelse: string;
    saksbehandler: {
        ident?: Maybe<string>;
        navn: string;
    };
    timestamp: DateString;
    dag: Speildag;
    dato: DateString;
    grad?: Maybe<number>;
    fraGrad?: Maybe<number>;
    ferdigstilt: boolean;
};

declare type Utbetalingstabelldag = {
    dato: DateString;
    kilde: Kilde;
    dag: Speildag;
    erAGP: boolean;
    erAvvist: boolean;
    erForeldet: boolean;
    erMaksdato: boolean;
    grad?: Maybe<number>;
    dagerIgjen?: Maybe<number>;
    overstyringer?: Array<OverstyringerPrDag>;
    totalGradering?: Maybe<number>;
    arbeidsgiverbeløp?: Maybe<number>;
    personbeløp?: Maybe<number>;
    begrunnelser?: Maybe<Array<Begrunnelse>>;
    erHelg?: boolean;
    erNyDag?: boolean;
    fraType?: Utbetalingstabelldagtype;
};
