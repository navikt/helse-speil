import React, { ReactElement } from 'react';

import { BodyShort, Table } from '@navikt/ds-react';

import { Endringstrekant } from '@components/Endringstrekant';
import { CellContent } from '@saksbilde/table/CellContent';
import { IconAndreYtelser } from '@saksbilde/table/icons/IconAndreYtelser';
import { IconArbeidsdag } from '@saksbilde/table/icons/IconArbeidsdag';
import { IconEgenmelding } from '@saksbilde/table/icons/IconEgenmelding';
import { IconFailure } from '@saksbilde/table/icons/IconFailure';
import { IconFerie } from '@saksbilde/table/icons/IconFerie';
import { IconPermisjon } from '@saksbilde/table/icons/IconPermisjon';
import { IconSyk } from '@saksbilde/table/icons/IconSyk';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import { erHelgDagtype } from './helgUtils';

import styles from './DagtypeCell.module.css';

const getTypeIcon = (tabelldag?: Utbetalingstabelldag): ReactElement | null => {
    if (!tabelldag) return null;

    if (tabelldag.erAvvist || tabelldag.erForeldet) {
        return <IconFailure />;
    }

    switch (tabelldag.dag.speilDagtype) {
        case 'Syk':
        case 'SykNav':
            return <IconSyk />;
        case 'Ferie':
            return <IconFerie />;
        case 'Egenmelding':
            return <IconEgenmelding />;
        case 'Permisjon':
            return <IconPermisjon />;
        case 'Arbeid':
            return <IconArbeidsdag />;
        case 'Foreldrepenger':
        case 'AAP':
        case 'Dagpenger':
        case 'Svangerskapspenger':
        case 'Omsorgspenger':
        case 'Opplæringspenger':
        case 'Pleiepenger':
            return <IconAndreYtelser />;
        case 'Helg':
        case 'Ukjent':
        default:
            return null;
    }
};

const erTypeSomIkkeSkalDekoreres = (tabelldag: Utbetalingstabelldag): boolean =>
    tabelldag.erAGP && ['SykNav', 'Egenmelding'].includes(tabelldag.dag.speilDagtype);

const dekorerTekst = (tabelldag?: Utbetalingstabelldag): string | null => {
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
        return `${visningstekst} (Ventetid)`;
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

const dekorerTekstOverstyrtDag = (tabelldag?: Utbetalingstabelldag): string | null => {
    if (!tabelldag) {
        return null;
    }
    const visningstekst = erHelgDagtype(tabelldag.dag.speilDagtype) ? 'Helg' : tabelldag.dag.visningstekst;

    if (erTypeSomIkkeSkalDekoreres(tabelldag)) {
        return visningstekst;
    } else if (tabelldag.erAGP) {
        return `${visningstekst} (AGP)`;
    } else if (tabelldag.erVentetid) {
        return `${visningstekst} (Ventetid)`;
    } else if (tabelldag.erForeldet) {
        return `${visningstekst} (Foreldet)`;
    } else {
        return visningstekst;
    }
};

interface DagtypeCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    tabelldag: Utbetalingstabelldag;
    overstyrtDag?: Utbetalingstabelldag;
}

export const DagtypeCell = ({ tabelldag, overstyrtDag, ...rest }: DagtypeCellProps): ReactElement => {
    const tekst = dekorerTekstOverstyrtDag(overstyrtDag) ?? dekorerTekst(tabelldag);
    const ikon = getTypeIcon(overstyrtDag) ?? getTypeIcon(tabelldag);
    const dagtypeErOverstyrt = overstyrtDag && tabelldag.dag.speilDagtype !== overstyrtDag.dag.speilDagtype;
    const nyDag =
        overstyrtDag &&
        tabelldag.dag.speilDagtype === overstyrtDag.dag.speilDagtype &&
        tabelldag.grad === overstyrtDag.grad;

    return (
        <Table.DataCell {...rest}>
            {dagtypeErOverstyrt ? (
                <Endringstrekant text={`Endret fra ${tabelldag.dag.visningstekst}`} />
            ) : nyDag ? (
                <Endringstrekant text="Ny dag. Endringene vil oppdateres og kalkuleres etter du har trykket på ferdig" />
            ) : (
                ''
            )}
            <CellContent>
                <div className={styles.container}>{ikon}</div>
                <BodyShort>{tekst}</BodyShort>
            </CellContent>
        </Table.DataCell>
    );
};
