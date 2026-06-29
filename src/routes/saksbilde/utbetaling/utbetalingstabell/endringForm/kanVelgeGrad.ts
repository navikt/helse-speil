import { Utbetalingstabelldagtype, UtbetalingstabelldagtypeSelvstendig } from '@typer/utbetalingstabell';

const dagtyperUtenGradering: (Utbetalingstabelldagtype | UtbetalingstabelldagtypeSelvstendig)[] = [
    'Arbeid',
    'Ferie',
    'ArbeidIkkeGjenopptatt',
    'Permisjon',
    'Egenmelding',
    'Foreldrepenger',
    'AAP',
    'Dagpenger',
    'Svangerskapspenger',
    'Pleiepenger',
    'Omsorgspenger',
    'Opplæringspenger',
    'MeldingTilNav',
    'AvslattMeldingTilNav',
];
export const kanVelgeGrad = (type?: Utbetalingstabelldagtype) =>
    type && dagtyperUtenGradering.every((dagtype) => dagtype !== type);
