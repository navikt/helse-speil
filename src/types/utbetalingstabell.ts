import { Begrunnelse, Kilde } from '@io/graphql';
import { Speildag } from '@saksbilde/utbetaling/utbetalingstabell/utbetalingstabelldager';
import { Maybe } from '@utils/ts';

import { DateString } from './shared';

export type Utbetalingstabelldagtype =
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
    | 'ArbeidIkkeGjenopptatt'
    | 'Foreldrepenger'
    | 'AAP'
    | 'Dagpenger'
    | 'Svangerskapspenger'
    | 'Pleiepenger'
    | 'Omsorgspenger'
    | 'Opplæringspenger';

export type OverstyringerPrDag = {
    hendelseId: string;
    begrunnelse: string;
    saksbehandler: {
        __typename: 'Saksbehandler';
        ident: Maybe<string>;
        navn: string;
    };
    timestamp: DateString;
    dag: Speildag;
    dato: DateString;
    grad?: Maybe<number>;
    fraGrad?: Maybe<number>;
    ferdigstilt: boolean;
};

export type Utbetalingstabelldag = {
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
