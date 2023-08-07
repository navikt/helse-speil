const dagtyperUtenGradering: Array<Utbetalingstabelldagtype> = [
    'Arbeid',
    'Ferie',
    'Ferie uten sykmelding',
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
