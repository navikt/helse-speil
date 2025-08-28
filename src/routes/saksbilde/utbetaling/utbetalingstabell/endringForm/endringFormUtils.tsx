import assert from 'assert';

import {
    ArbeidIkkeGjenopptattDag,
    Arbeidsdag,
    Egenmeldingsdag,
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

export const overstyringsdagtyperArbeidstaker: Speildag[] = [
    Sykedag,
    SykedagNav,
    Feriedag,
    ArbeidIkkeGjenopptattDag,
    Egenmeldingsdag,
    Permisjonsdag,
    Arbeidsdag,
];

export const overstyringsdagtyperSelvstendig: Speildag[] = [Sykedag, Arbeidsdag];

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

export const alleTypeendringer: Speildag[] = [...overstyringsdagtyperArbeidstaker, ...typeendringerAndreYtelser];

export const getDagFromType = (type: OverstyrbarDagtype): Speildag => {
    const speilDag = alleTypeendringer.find((dag) => dag.speilDagtype === type);
    assert(speilDag, 'Fant ikke Speildag som matchet OverstyrbarDagtype');
    return speilDag;
};

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
