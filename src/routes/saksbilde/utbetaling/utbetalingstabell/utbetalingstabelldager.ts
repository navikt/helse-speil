import { Sykdomsdagtype, Utbetalingsdagtype } from '@io/graphql';
import { OverstyrtDagtype } from '@io/http';

export type Speildag = {
    speilDagtype: Utbetalingstabelldagtype;
    visningstekst: string;
    overstyrtDagtype: OverstyrtDagtype | undefined;
};

export const Arbeidsdag: Speildag = {
    speilDagtype: 'Arbeid',
    visningstekst: 'Arbeid',
    overstyrtDagtype: 'Arbeidsdag',
};

export const Helgedag: Speildag = {
    speilDagtype: 'Helg',
    visningstekst: 'Helg',
    overstyrtDagtype: 'Helg',
};

export const Navhelgedag: Speildag = {
    speilDagtype: 'SykHelg',
    visningstekst: 'Helg',
    overstyrtDagtype: 'Sykedag',
};

export const FriskHelgedag: Speildag = {
    speilDagtype: 'FriskHelg',
    visningstekst: 'Helg',
    overstyrtDagtype: 'Arbeidsdag',
};

export const Feriedag: Speildag = {
    speilDagtype: 'Ferie',
    visningstekst: 'Ferie',
    overstyrtDagtype: 'Feriedag',
};

export const Feriehelgedag: Speildag = {
    speilDagtype: 'Feriehelg',
    visningstekst: 'Helg',
    overstyrtDagtype: 'Feriedag',
};

export const Permisjonsdag: Speildag = {
    speilDagtype: 'Permisjon',
    visningstekst: 'Permisjon',
    overstyrtDagtype: 'Permisjonsdag',
};

export const Egenmeldingsdag: Speildag = {
    speilDagtype: 'Egenmelding',
    visningstekst: 'Egenmelding',
    overstyrtDagtype: 'Egenmeldingsdag',
};

export const Sykedag: Speildag = {
    speilDagtype: 'Syk',
    visningstekst: 'Syk',
    overstyrtDagtype: 'Sykedag',
};

export const SykedagNav: Speildag = {
    speilDagtype: 'SykNav',
    visningstekst: 'Syk (NAV)',
    overstyrtDagtype: 'SykedagNav',
};

export const AAPdag: Speildag = {
    speilDagtype: 'AAP',
    visningstekst: 'AAP',
    overstyrtDagtype: 'AAPdag',
};

export const Foreldrepengerdag: Speildag = {
    speilDagtype: 'Foreldrepenger',
    visningstekst: 'Foreldrepenger',
    overstyrtDagtype: 'Foreldrepengerdag',
};

export const Dagpengerdag: Speildag = {
    speilDagtype: 'Dagpenger',
    visningstekst: 'Dagpenger',
    overstyrtDagtype: 'Dagpengerdag',
};

export const Svangerskapspengerdag: Speildag = {
    speilDagtype: 'Svangerskapspenger',
    visningstekst: 'Svangerskapspenger',
    overstyrtDagtype: 'Svangerskapspengerdag',
};

export const Pleiepengerdag: Speildag = {
    speilDagtype: 'Pleiepenger',
    visningstekst: 'Pleiepenger',
    overstyrtDagtype: 'Pleiepengerdag',
};

export const Omsorgspengerdag: Speildag = {
    speilDagtype: 'Omsorgspenger',
    visningstekst: 'Omsorgspenger',
    overstyrtDagtype: 'Omsorgspengerdag',
};

export const Opplæringspengerdag: Speildag = {
    speilDagtype: 'Opplæringspenger',
    visningstekst: 'Opplæringspenger',
    overstyrtDagtype: 'Opplaringspengerdag',
};

export const ArbeidIkkeGjenopptattDag: Speildag = {
    speilDagtype: 'ArbeidIkkeGjenopptatt',
    visningstekst: 'Arbeid ikke gjenopptatt',
    overstyrtDagtype: 'ArbeidIkkeGjenopptattDag',
};

export const Avslåttdag: Speildag = {
    speilDagtype: 'Avslått',
    visningstekst: 'Avslått',
    overstyrtDagtype: 'Avvistdag',
};

export const Ukjentdag: Speildag = {
    speilDagtype: 'Ukjent',
    visningstekst: 'Ukjent',
    overstyrtDagtype: undefined,
};

export const AvvistEllerForeldetDag = (
    sykdomsdagtype: Sykdomsdagtype,
    utbetalingsdagtype: Utbetalingsdagtype,
): Speildag => {
    return {
        speilDagtype: 'Avslått',
        visningstekst: getSpeildag(sykdomsdagtype, utbetalingsdagtype).visningstekst,
        overstyrtDagtype: 'Avvistdag',
    };
};

export const getSpeildag = (sykdomsdagtype: Sykdomsdagtype, utbetalingsdagtype: Utbetalingsdagtype): Speildag => {
    switch (sykdomsdagtype) {
        case Sykdomsdagtype.AndreYtelserAap:
            return AAPdag;
        case Sykdomsdagtype.AndreYtelserDagpenger:
            return Dagpengerdag;
        case Sykdomsdagtype.AndreYtelserForeldrepenger:
            return Foreldrepengerdag;
        case Sykdomsdagtype.AndreYtelserOmsorgspenger:
            return Omsorgspengerdag;
        case Sykdomsdagtype.AndreYtelserOpplaringspenger:
            return Opplæringspengerdag;
        case Sykdomsdagtype.AndreYtelserPleiepenger:
            return Pleiepengerdag;
        case Sykdomsdagtype.AndreYtelserSvangerskapspenger:
            return Svangerskapspengerdag;
        case Sykdomsdagtype.Arbeidikkegjenopptattdag:
            return ArbeidIkkeGjenopptattDag;
        case Sykdomsdagtype.Arbeidsdag:
            return utbetalingsdagtype === Utbetalingsdagtype.Helgedag ? Helgedag : Arbeidsdag;
        case Sykdomsdagtype.Feriedag:
            return utbetalingsdagtype === Utbetalingsdagtype.Helgedag ? Feriehelgedag : Feriedag;
        case Sykdomsdagtype.Permisjonsdag:
            return Permisjonsdag;
        case Sykdomsdagtype.Arbeidsgiverdag: // Spleis bruker bare "Arbeidsgiverdag" om egenmeldingsdager
            return Egenmeldingsdag;
        case Sykdomsdagtype.SykedagNav:
            return SykedagNav;
        case Sykdomsdagtype.Sykedag:
        case Sykdomsdagtype.ForeldetSykedag:
            return Sykedag;
        case Sykdomsdagtype.SykHelgedag:
            return Navhelgedag;
        case Sykdomsdagtype.FriskHelgedag:
            return FriskHelgedag;
        case Sykdomsdagtype.Avslatt:
            return Avslåttdag;
        case Sykdomsdagtype.Ubestemtdag:
        default:
            return utbetalingsdagtype === Utbetalingsdagtype.Helgedag ? Helgedag : Ukjentdag;
    }
};
