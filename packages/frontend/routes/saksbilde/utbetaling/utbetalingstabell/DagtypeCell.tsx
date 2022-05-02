import styled from '@emotion/styled';
import React, { ReactNode } from 'react';
import { BodyShort } from '@navikt/ds-react';

import { Endringstrekant } from '@components/Endringstrekant';
import { Dagtype, Sykdomsdagtype, Utbetalingsdagtype } from '@io/graphql';

import { CellContent } from '../../table/CellContent';
import { IconArbeidsdag } from '../../table/icons/IconArbeidsdag';
import { IconArbeidsgiverperiode } from '../../table/icons/IconArbeidsgiverperiode';
import { IconEgenmelding } from '../../table/icons/IconEgenmelding';
import { IconFailure } from '../../table/icons/IconFailure';
import { IconFerie } from '../../table/icons/IconFerie';
import { IconPermisjon } from '../../table/icons/IconPermisjon';
import { IconSyk } from '../../table/icons/IconSyk';

const IconContainer = styled.div`
    width: 1rem;
    margin-right: 1rem;
    display: flex;
    align-items: center;
    flex-shrink: 0;
`;

const getTypeIcon = (dag: UtbetalingstabellDag): ReactNode => {
    if (dag.erForeldet || dag.erAvvist) {
        return <IconFailure />;
    }
    if (dag.erAGP) {
        return <IconArbeidsgiverperiode />;
    }

    // Mangler annullert dag
    switch (dag.type) {
        case 'Syk':
            return <IconSyk />;
        case 'Ferie':
            return <IconFerie />;
        case 'Egenmelding':
            return <IconEgenmelding />;
        case 'Permisjon':
            return <IconPermisjon />;
        case 'Arbeid':
            return <IconArbeidsdag />;
        case 'Helg':
        case 'Ukjent':
        default:
            return null;
    }
};

const daytypesAreEqual = (
    utbetalingsdagtype: Utbetalingsdagtype,
    overstyrtDagtype: Utbetalingstabelldagtype
): boolean => {
    switch (utbetalingsdagtype) {
        case Utbetalingsdagtype.Arbeidsdag:
            return overstyrtDagtype === 'Arbeid';
        case Utbetalingsdagtype.Feriedag:
            return overstyrtDagtype === 'Ferie';
        case Utbetalingsdagtype.Navhelgdag:
        case Utbetalingsdagtype.Helgedag:
            return overstyrtDagtype === 'Helg';
        case Utbetalingsdagtype.Navdag:
            return overstyrtDagtype === 'Syk';
        case Utbetalingsdagtype.UkjentDag:
            return overstyrtDagtype === 'Ukjent';
        default:
            return false;
    }
};

const getDisplayTextForUtbetalingsdagtype = (type: Utbetalingsdagtype): string => {
    switch (type) {
        case Utbetalingsdagtype.Arbeidsdag:
            return 'Arbeidsdag';
        case Utbetalingsdagtype.Arbeidsgiverperiodedag:
            return 'Arbeidsgiverperiodedag';
        case Utbetalingsdagtype.AvvistDag:
            return 'Avvist';
        case Utbetalingsdagtype.Feriedag:
            return 'Ferie';
        case Utbetalingsdagtype.ForeldetDag:
            return 'Foreldet';
        case Utbetalingsdagtype.Helgedag:
        case Utbetalingsdagtype.Navhelgdag:
            return 'Helg';
        case Utbetalingsdagtype.Navdag:
            return 'Syk';
        case Utbetalingsdagtype.UkjentDag:
            return 'Ukjent';
    }
};

const getDisplayTextForSykdomsdagtype = (type: Sykdomsdagtype): string => {
    switch (type) {
        case Sykdomsdagtype.Arbeidsdag:
            return 'Arbeidsdag';
        case Sykdomsdagtype.Arbeidsgiverdag:
            return 'Arbeidsgiverdag';
        case Sykdomsdagtype.Avslatt:
            return 'Avvist';
        case Sykdomsdagtype.Feriedag:
            return 'Ferie';
        case Sykdomsdagtype.ForeldetSykedag:
            return 'Foreldet';
        case Sykdomsdagtype.SykHelgedag:
        case Sykdomsdagtype.FriskHelgedag:
            return 'Helg';
        case Sykdomsdagtype.Permisjonsdag:
            return 'Permisjon';
        case Sykdomsdagtype.Sykedag:
            return 'Syk';
        case Sykdomsdagtype.Ubestemtdag:
            return 'Ukjent';
    }
};

const getDisplayText = (dag?: UtbetalingstabellDag): string | null => {
    if (!dag) {
        return null;
    } else if (dag.erAvvist) {
        return `${dag.type} (Avslått)`;
    } else if (dag.erAGP) {
        return `${dag.type} (AGP)`;
    } else if (dag.erForeldet) {
        return `${dag.type} (Foreldet)`;
    } else {
        return dag.type;
    }
};

const getDisplayTextForOverstyrtDagtype = (type: Dagtype): string => {
    switch (type) {
        case Dagtype.Egenmeldingsdag:
            return 'Egenmelding';
        case Dagtype.Feriedag:
            return 'Ferie';
        case Dagtype.Permisjonsdag:
            return 'Permisjon';
        case Dagtype.Sykedag:
            return 'Syk';
    }
};

interface DagtypeCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    dag: UtbetalingstabellDag;
    overstyrtDag?: UtbetalingstabellDag;
}

export const DagtypeCell: React.FC<DagtypeCellProps> = ({ dag, overstyrtDag, ...rest }) => {
    const text = getDisplayText(overstyrtDag) ?? getDisplayText(dag);
    const dagtypeErOverstyrt = overstyrtDag && dag.type !== overstyrtDag.type;

    return (
        <td {...rest}>
            {dagtypeErOverstyrt && <Endringstrekant text={`Endret fra ${dag.type}`} />}
            <CellContent>
                <IconContainer>{getTypeIcon(dag)}</IconContainer>
                <BodyShort>{text}</BodyShort>
            </CellContent>
        </td>
    );
};
