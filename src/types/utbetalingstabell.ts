import { ApiBegrunnelse, ApiKilde, ApiVurderingAvLøpendeVilkår } from '@io/rest/generated/spesialist.schemas';
import { Speildag } from '@saksbilde/utbetaling/utbetalingstabell/utbetalingstabelldager';

import { DateString } from './shared';

const andreYtelser = [
    'Foreldrepenger',
    'AAP',
    'Dagpenger',
    'Svangerskapspenger',
    'Pleiepenger',
    'Omsorgspenger',
    'Opplæringspenger',
];

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
    'UtenforEøs',
    ...andreYtelser,
] as const;

export const utbetalingstabelldagtypeSelvstendigValues = [
    'MeldingTilNav',
    'AvslattMeldingTilNav',
    'Syk',
    'Arbeid',
    ...andreYtelser,
] as const;

export type Utbetalingstabelldagtype = (typeof utbetalingstabelldagtypeValues)[number];

export type UtbetalingstabelldagtypeSelvstendig = (typeof utbetalingstabelldagtypeSelvstendigValues)[number];

export type OverstyringerPrDag = {
    vedtaksperiodeId: string;
    hendelseId: string;
    begrunnelse: string;
    saksbehandler: {
        ident?: string | null;
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
    kilde: ApiKilde;
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
    begrunnelser?: ApiBegrunnelse[] | null;
    vurderingerAvLøpendeVilkår?: ApiVurderingAvLøpendeVilkår[];
    erNyDag?: boolean;
    gradertAnnenYtelse?: GradertAnnenYtelse | null;
    fraType?: Utbetalingstabelldagtype;
};

export type AndreYtelserGrader = Record<string, number>;

export type GradertAnnenYtelse = {
    sykdomsgradFørFordeling: number;
    sykdomsgrad: number;
    andreYtelserGrader: AndreYtelserGrader;
    begrunnelse: string;
};
