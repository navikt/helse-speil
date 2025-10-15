import { Utbetalingstabelldagtype } from '@typer/utbetalingstabell';

const dagtyperUtenGradering: Utbetalingstabelldagtype[] = [
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
];
export const kanVelgeGrad = (type?: Utbetalingstabelldagtype) =>
    type && dagtyperUtenGradering.every((dagtype) => dagtype !== type);
