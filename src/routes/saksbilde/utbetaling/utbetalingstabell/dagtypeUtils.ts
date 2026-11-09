import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import { erHelgDagtype } from './helgUtils';
import { visningstekstForGradertAnnenYtelse } from './utbetalingstabelldager';

const erTypeSomIkkeSkalDekoreres = (tabelldag: Utbetalingstabelldag): boolean =>
    tabelldag.erAGP && ['SykNav', 'Egenmelding'].includes(tabelldag.dag.speilDagtype);

export const dekorerTekst = (tabelldag?: Utbetalingstabelldag): string | null => {
    if (!tabelldag) {
        return null;
    }

    const visningstekst = tabelldag.dag.visningstekst;
    const speilDagtype = tabelldag.dag.speilDagtype;

    if (tabelldag.erAvvist || tabelldag.erForeldet) {
        return `${visningstekst} (Avslått)`;
    } else if (erTypeSomIkkeSkalDekoreres(tabelldag)) {
        return visningstekst;
    } else if (tabelldag.erVentetid) {
        if (tabelldag.dag.speilDagtype == 'SykNav') {
            return `${visningstekst} (Forsikring)`;
        } else {
            return `${visningstekst} (Ventetid)`;
        }
    } else if (tabelldag.erAGP) {
        return `${visningstekst} (AGP)`;
    } else if (speilDagtype === 'FriskHelg') {
        return `${visningstekst} (Frisk)`;
    } else if (speilDagtype === 'SykHelg') {
        return `${visningstekst} (Syk)`;
    } else if (speilDagtype === 'Feriehelg') {
        return `${visningstekst} (Ferie)`;
    } else {
        return visningstekst;
    }
};

export const dekorerTekstOverstyrtDag = (tabelldag?: Utbetalingstabelldag): string | null => {
    if (!tabelldag) {
        return null;
    }
    const visningstekst = erHelgDagtype(tabelldag.dag.speilDagtype) ? 'Helg' : tabelldag.dag.visningstekst;

    if (erTypeSomIkkeSkalDekoreres(tabelldag)) {
        return visningstekst;
    } else if (tabelldag.erAGP) {
        return `${visningstekst} (AGP)`;
    } else if (tabelldag.erVentetid) {
        if (tabelldag.dag.speilDagtype == 'SykNav') {
            return `${visningstekst} (Forsikring)`;
        } else {
            return `${visningstekst} (Ventetid)`;
        }
    } else if (tabelldag.erForeldet) {
        return `${visningstekst} (Foreldet)`;
    } else {
        return visningstekst;
    }
};

export function lagEndringstekst(
    tabelldag: Utbetalingstabelldag,
    endretDag?: Utbetalingstabelldag,
): string | undefined {
    if (!endretDag) return undefined;
    if (endretDag.gradertAnnenYtelse) {
        const ytelser = Object.keys(endretDag.gradertAnnenYtelse.andreYtelserGrader).map((ytelse) =>
            visningstekstForGradertAnnenYtelse(ytelse).toLocaleLowerCase(),
        );
        return `Endret til gradert ${ytelser.join(', ')}`;
    }
    if (tabelldag.dag.speilDagtype !== endretDag.dag.speilDagtype) return `Endret fra ${tabelldag.dag.visningstekst}`;
    if (tabelldag.grad === endretDag.grad)
        return 'Ny dag. Endringene vil oppdateres og kalkuleres etter du har trykket på ferdig';
    return undefined;
}
