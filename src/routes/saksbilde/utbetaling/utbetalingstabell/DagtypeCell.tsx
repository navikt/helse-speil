import React, { ReactElement } from 'react';

import { StarsEuIcon } from '@navikt/aksel-icons';
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

import { dekorerTekst, dekorerTekstOverstyrtDag, lagEndringstekst } from './dagtypeUtils';

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
        case 'UtenforEøs':
            return <StarsEuIcon aria-hidden fontSize="1.25rem" data-testid="utenfor-eøs-ikon" />;
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

interface DagtypeCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    tabelldag: Utbetalingstabelldag;
    overstyrtDag?: Utbetalingstabelldag;
}

export const DagtypeCell = ({ tabelldag, overstyrtDag: endretDag, ...rest }: DagtypeCellProps): ReactElement => {
    // En gradert annen ytelse endrer fordelingen, ikke dagtypen, så cellen viser den opprinnelige dagen
    const fordeling = endretDag?.gradertAnnenYtelse;
    const overstyrtDag = fordeling ? undefined : endretDag;
    const tekst = dekorerTekstOverstyrtDag(overstyrtDag) ?? dekorerTekst(tabelldag);
    const ikon = getTypeIcon(overstyrtDag) ?? getTypeIcon(tabelldag);
    const endringstekst = lagEndringstekst(tabelldag, endretDag);

    return (
        <Table.DataCell {...rest}>
            {endringstekst && <Endringstrekant text={endringstekst} />}
            <CellContent>
                <div className={styles.container}>{ikon}</div>
                <BodyShort>{tekst}</BodyShort>
            </CellContent>
        </Table.DataCell>
    );
};
