const dagtyperUtenGradering: Array<Utbetalingstabelldagtype> = [
    'Arbeid',
    'Ferie',
    'Ferie uten sykmelding',
    'Permisjon',
    'Egenmelding',
];
export const kanVelgeGrad = (type?: Utbetalingstabelldagtype) =>
    type && dagtyperUtenGradering.every((dagtype) => dagtype !== type);
