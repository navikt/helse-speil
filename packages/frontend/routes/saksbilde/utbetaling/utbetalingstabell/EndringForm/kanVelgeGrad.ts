const dagtyperUtenGradering: Array<Utbetalingstabelldagtype> = ['Arbeid', 'Ferie', 'Permisjon', 'Egenmelding'];
export const kanVelgeGrad = (type?: Utbetalingstabelldagtype) =>
    type && dagtyperUtenGradering.every((dagtype) => dagtype !== type);
