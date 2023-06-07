type Maybe<T> = import('@io/graphql').Maybe<T>;
type Kilde = import('@io/graphql').Kilde;
type Begrunnelse = import('@io/graphql').Begrunnelse;

declare type Utbetalingstabelldagtype =
    | 'Syk'
    | 'Ferie'
    | 'FriskHelg'
    | 'Feriehelg'
    | 'SykHelg'
    | 'Syk (NAV)'
    | 'Helg'
    | 'Ukjent'
    | 'Egenmelding'
    | 'Permisjon'
    | 'Arbeid'
    | 'Avslått';

type OverstyringerPrDag = {
    hendelseId: string;
    begrunnelse: string;
    saksbehandler: {
        ident?: Maybe<string>;
        navn: string;
    };
    timestamp: DateString;
    type: Utbetalingstabelldagtype;
    dato: DateString;
    grad?: Maybe<number>;
    fraGrad?: Maybe<number>;
    ferdigstilt: boolean;
};

declare type UtbetalingstabellDag = {
    dato: DateString;
    kilde: Kilde;
    type: Utbetalingstabelldagtype;
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
};
