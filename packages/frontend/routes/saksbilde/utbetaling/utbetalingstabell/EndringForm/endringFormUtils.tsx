export const typeendringer: Utbetalingstabelldagtype[] = [
    'Syk',
    'Syk (NAV)',
    'Ferie',
    'Ferie uten sykmelding',
    'Egenmelding',
    'Permisjon',
    'Arbeid',
];

export const typeendringerAndreYtelser: Utbetalingstabelldagtype[] = [
    'Foreldrepenger',
    'AAP',
    'Dagpenger',
    'Svangerskapspenger',
    'Pleiepenger',
    'Omsorgspenger',
    'Opplæringspenger',
];

export const alleTypeendringer: Utbetalingstabelldagtype[] = [...typeendringer, ...typeendringerAndreYtelser];

export enum OverstyrbarDagtype {
    Syk = 'Syk',
    SykNAV = 'Syk (NAV)',
    Ferie = 'Ferie',
    Egenmelding = 'Egenmelding',
    Permisjon = 'Permisjon',
    Arbeid = 'Arbeid',
    Foreldrepenger = 'Foreldrepenger',
    AAP = 'AAP',
    Dagpenger = 'Dagpenger',
    Svangerskapspenger = 'Svangerskapspenger',
    Pleiepenger = 'Pleiepenger',
    Omsorgspenger = 'Omsorgspenger',
    Opplæringspenger = 'Opplæringspenger',
}
