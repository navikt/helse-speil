import { Begrunnelse, Kilde } from '@io/graphql';
import { Speildag } from '@saksbilde/utbetaling/utbetalingstabell/utbetalingstabelldager';

import { DateString } from './shared';

export const utbetalingstabelldagtypeValues = [
    'Syk',
    'Ferie',
    'FriskHelg',
    'Feriehelg',
    'SykHelg',
    'SykNav',
    'Helg',
    'Ukjent',
    'Egenmelding',
    'Permisjon',
    'Arbeid',
    'Avslått',
    'ArbeidIkkeGjenopptatt',
    'Foreldrepenger',
    'AAP',
    'Dagpenger',
    'Svangerskapspenger',
    'Pleiepenger',
    'Omsorgspenger',
    'Opplæringspenger',
] as const;

export type Utbetalingstabelldagtype = (typeof utbetalingstabelldagtypeValues)[number];

export type OverstyringerPrDag = {
    vedtaksperiodeId: string;
    hendelseId: string;
    begrunnelse: string;
    saksbehandler: {
        __typename: 'Saksbehandler';
        ident: string | null;
        navn: string;
    };
    timestamp: DateString;
    dag: Speildag;
    dato: DateString;
    grad?: number | null;
    fraGrad?: number | null;
    ferdigstilt: boolean;
};

export type Utbetalingstabelldag = {
    dato: DateString;
    kilde: Kilde;
    dag: Speildag;
    erAGP: boolean;
    erVentetid: boolean;
    erAvvist: boolean;
    erForeldet: boolean;
    erMaksdato: boolean;
    grad?: number | null;
    dagerIgjen?: number | null;
    overstyringer?: OverstyringerPrDag[];
    totalGradering?: number | null;
    arbeidsgiverbeløp?: number | null;
    personbeløp?: number | null;
    begrunnelser?: Begrunnelse[] | null;
    erNyDag?: boolean;
    fraType?: Utbetalingstabelldagtype;
};
