import {
    Arbeidsdag,
    Egenmeldingsdag,
    FerieUtenSykmeldingDag,
    Feriedag,
    Foreldrepengerdag,
    Omsorgspengerdag,
    Opplæringspengerdag,
    Permisjonsdag,
    Pleiepengerdag,
    Speildag,
    Svangerskapspengerdag,
    Sykedag,
    SykedagNav,
} from '../utbetalingstabelldager';

export const typeendringer: Speildag[] = [
    Sykedag,
    SykedagNav,
    Feriedag,
    FerieUtenSykmeldingDag,
    Egenmeldingsdag,
    Permisjonsdag,
    Arbeidsdag,
];

export const typeendringerAndreYtelser: Speildag[] = [
    // Vi ble bedt om å fjerne muligheten for å endre til AAP og Dagpenger til å begynne med.
    // AAPdag,
    // Dagpengerdag,
    Foreldrepengerdag,
    Svangerskapspengerdag,
    Pleiepengerdag,
    Omsorgspengerdag,
    Opplæringspengerdag,
];

export const alleTypeendringer: Speildag[] = [...typeendringer, ...typeendringerAndreYtelser];

export const getDagFromType = (type: OverstyrbarDagtype) => alleTypeendringer.find((dag) => dag.speilDagtype === type);

export enum OverstyrbarDagtype {
    // Vi ble bedt om å fjerne muligheten for å endre til AAP og Dagpenger til å begynne med.
    // AAP = 'AAP',
    // Dagpenger = 'Dagpenger',
    Syk = 'Syk',
    SykNav = 'SykNav',
    Ferie = 'Ferie',
    Egenmelding = 'Egenmelding',
    Permisjon = 'Permisjon',
    Arbeid = 'Arbeid',
    Foreldrepenger = 'Foreldrepenger',
    Svangerskapspenger = 'Svangerskapspenger',
    Pleiepenger = 'Pleiepenger',
    Omsorgspenger = 'Omsorgspenger',
    Opplæringspenger = 'Opplæringspenger',
}
