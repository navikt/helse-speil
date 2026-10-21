import { ApiSykdomsdagtype, ApiUtbetalingsdagtype } from '@io/rest/generated/spesialist.schemas';
import { OverstyrtDagtype } from '@typer/overstyring';
import { Utbetalingstabelldagtype } from '@typer/utbetalingstabell';

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

export const MeldingTilNavdag: Speildag = {
    speilDagtype: 'MeldingTilNav',
    visningstekst: 'Melding til Nav',
    overstyrtDagtype: 'MeldingTilNavdag',
};

export const AvslattMeldingTilNavdag: Speildag = {
    speilDagtype: 'AvslattMeldingTilNav',
    visningstekst: 'Melding til Nav',
    overstyrtDagtype: 'AvslattMeldingTilNavdag',
};

export const Sykedag: Speildag = {
    speilDagtype: 'Syk',
    visningstekst: 'Syk',
    overstyrtDagtype: 'Sykedag',
};

export const SykedagNav: Speildag = {
    speilDagtype: 'SykNav',
    visningstekst: 'Syk (Nav)',
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
    sykdomsdagtype: ApiSykdomsdagtype,
    utbetalingsdagtype: ApiUtbetalingsdagtype,
): Speildag => {
    return {
        speilDagtype: 'Avslått',
        visningstekst: getSpeildag(sykdomsdagtype, utbetalingsdagtype).visningstekst,
        overstyrtDagtype: 'Avvistdag',
    };
};

export const getSpeildag = (sykdomsdagtype: ApiSykdomsdagtype, utbetalingsdagtype: ApiUtbetalingsdagtype): Speildag => {
    switch (sykdomsdagtype) {
        case ApiSykdomsdagtype.ANDRE_YTELSER_AAP:
            return AAPdag;
        case ApiSykdomsdagtype.ANDRE_YTELSER_DAGPENGER:
            return Dagpengerdag;
        case ApiSykdomsdagtype.ANDRE_YTELSER_FORELDREPENGER:
            return Foreldrepengerdag;
        case ApiSykdomsdagtype.ANDRE_YTELSER_OMSORGSPENGER:
            return Omsorgspengerdag;
        case ApiSykdomsdagtype.ANDRE_YTELSER_OPPLARINGSPENGER:
            return Opplæringspengerdag;
        case ApiSykdomsdagtype.ANDRE_YTELSER_PLEIEPENGER:
            return Pleiepengerdag;
        case ApiSykdomsdagtype.ANDRE_YTELSER_SVANGERSKAPSPENGER:
            return Svangerskapspengerdag;
        case ApiSykdomsdagtype.ARBEIDIKKEGJENOPPTATTDAG:
            return ArbeidIkkeGjenopptattDag;
        case ApiSykdomsdagtype.ARBEIDSDAG:
            return utbetalingsdagtype === ApiUtbetalingsdagtype.HELGEDAG ? Helgedag : Arbeidsdag;
        case ApiSykdomsdagtype.FERIEDAG:
            return utbetalingsdagtype === ApiUtbetalingsdagtype.HELGEDAG ? Feriehelgedag : Feriedag;
        case ApiSykdomsdagtype.PERMISJONSDAG:
            return Permisjonsdag;
        case ApiSykdomsdagtype.ARBEIDSGIVERDAG: // Spleis bruker bare "Arbeidsgiverdag" om egenmeldingsdager
            return Egenmeldingsdag;
        case ApiSykdomsdagtype.SYKEDAG_NAV:
            return SykedagNav;
        case ApiSykdomsdagtype.SYKEDAG:
        case ApiSykdomsdagtype.FORELDET_SYKEDAG:
            return Sykedag;
        case ApiSykdomsdagtype.SYK_HELGEDAG:
            return Navhelgedag;
        case ApiSykdomsdagtype.FRISK_HELGEDAG:
            return FriskHelgedag;
        case ApiSykdomsdagtype.AVSLATT:
            return Avslåttdag;
        case ApiSykdomsdagtype.MELDINGTILNAVDAG:
            return MeldingTilNavdag;
        case ApiSykdomsdagtype.AVSLATTMELDINGTILNAVDAG:
            return AvslattMeldingTilNavdag;
        case ApiSykdomsdagtype.UBESTEMTDAG:
        default:
            return utbetalingsdagtype === ApiUtbetalingsdagtype.HELGEDAG ? Helgedag : Ukjentdag;
    }
};
