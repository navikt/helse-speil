import React, { ReactElement, ReactNode } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Utbetalingstabelldag } from '@/routes/saksbilde/utbetaling/utbetalingstabell/types';
import { Endringstrekant } from '@components/Endringstrekant';

import { CellContent } from '../../table/CellContent';
import { IconAndreYtelser } from '../../table/icons/IconAndreYtelser';
import { IconArbeidsdag } from '../../table/icons/IconArbeidsdag';
import { IconEgenmelding } from '../../table/icons/IconEgenmelding';
import { IconFailure } from '../../table/icons/IconFailure';
import { IconFerie } from '../../table/icons/IconFerie';
import { IconPermisjon } from '../../table/icons/IconPermisjon';
import { IconSyk } from '../../table/icons/IconSyk';
import { erHelg } from './helgUtils';

import styles from './DagtypeCell.module.css';

const getTypeIcon = (tabelldag?: Utbetalingstabelldag): ReactNode | null => {
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

const erTypeSomIkkeSkalDekoreres = (tabelldag: Utbetalingstabelldag) =>
    tabelldag.erAGP && ['SykNav', 'Egenmelding'].includes(tabelldag.dag.speilDagtype);

const dekorerTekst = (tabelldag?: Utbetalingstabelldag): string | null => {
    if (!tabelldag) {
        return null;
    }

    const visningstekst = tabelldag.dag.visningstekst;
    const speilDagtype = tabelldag.dag.speilDagtype;

    if (tabelldag.erAvvist) {
        return `${visningstekst} (Avslått)`;
    } else if (erTypeSomIkkeSkalDekoreres(tabelldag)) {
        return visningstekst;
    } else if (tabelldag.erAGP) {
        return `${visningstekst} (AGP)`;
    } else if (tabelldag.erForeldet) {
        return `${visningstekst} (Foreldet)`;
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
    const visningstekst = erHelg(tabelldag.dag.speilDagtype) ? 'Helg' : tabelldag.dag.visningstekst;

    if (erTypeSomIkkeSkalDekoreres(tabelldag)) {
        return visningstekst;
    } else if (tabelldag.erAGP) {
        return `${visningstekst} (AGP)`;
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
        <td {...rest}>
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
        </td>
    );
};
