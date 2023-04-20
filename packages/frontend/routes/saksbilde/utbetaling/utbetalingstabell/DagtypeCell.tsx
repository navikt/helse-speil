import styled from '@emotion/styled';
import React, { ReactNode } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Endringstrekant } from '@components/Endringstrekant';
import { erUtvikling } from '@utils/featureToggles';

import { CellContent } from '../../table/CellContent';
import { IconArbeidsdag } from '../../table/icons/IconArbeidsdag';
import { IconEgenmelding } from '../../table/icons/IconEgenmelding';
import { IconFailure } from '../../table/icons/IconFailure';
import { IconFerie } from '../../table/icons/IconFerie';
import { IconPermisjon } from '../../table/icons/IconPermisjon';
import { IconSyk } from '../../table/icons/IconSyk';
import { erEksplisittHelg } from './Utbetalingstabell';

const IconContainer = styled.div`
    width: 1rem;
    margin-right: 1rem;
    display: flex;
    align-items: center;
    flex-shrink: 0;
`;

const getTypeIcon = (dag?: UtbetalingstabellDag): ReactNode | null => {
    if (!dag) return null;

    switch (dag.type) {
        case 'Syk':
        case 'Syk (NAV)':
            return <IconSyk />;
        case 'Ferie':
            return <IconFerie />;
        case 'Egenmelding':
            return <IconEgenmelding />;
        case 'Permisjon':
            return <IconPermisjon />;
        case 'Arbeid':
            return <IconArbeidsdag />;
        case 'Avslått':
            return <IconFailure />;
        case 'Helg':
        case 'Ukjent':
        default:
            return null;
    }
};

const getDisplayText = (dag?: UtbetalingstabellDag): string | null => {
    if (!dag) {
        return null;
    }
    const dagtype = erEksplisittHelg(dag.type) ? 'Helg' : dag.type;

    if (dag.erAvvist) {
        return `${dagtype} (Avslått)`;
    } else if (erUtvikling() && dag.erAGP && dagtype === 'Syk (NAV)') {
        return dagtype;
    } else if (dag.erAGP && (typeof dag?.personbeløp === 'number' || typeof dag?.arbeidsgiverbeløp === 'number')) {
        return `${dagtype} (NAV)`;
    } else if (dag.erAGP) {
        return `${dagtype} (AGP)`;
    } else if (dag.erForeldet) {
        return `${dagtype} (Foreldet)`;
    } else {
        return dagtype;
    }
};

const getDisplayTextOverstyrtDag = (dag?: UtbetalingstabellDag): string | null => {
    if (!dag) {
        return null;
    }
    const dagtype = erEksplisittHelg(dag.type) ? 'Helg' : dag.type;

    if (dag.erAGP && dagtype !== 'Syk (NAV)') {
        return `${dagtype} (AGP)`;
    } else if (dag.erForeldet) {
        return `${dagtype} (Foreldet)`;
    } else {
        return dagtype;
    }
};

interface DagtypeCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    dag: UtbetalingstabellDag;
    overstyrtDag?: UtbetalingstabellDag;
}

export const DagtypeCell: React.FC<DagtypeCellProps> = ({ dag, overstyrtDag, ...rest }) => {
    const text = getDisplayTextOverstyrtDag(overstyrtDag) ?? getDisplayText(dag);
    const icon = getTypeIcon(overstyrtDag) ?? getTypeIcon(dag);
    const dagtypeErOverstyrt = overstyrtDag && dag.type !== overstyrtDag.type;

    return (
        <td {...rest}>
            {dagtypeErOverstyrt && <Endringstrekant text={`Endret fra ${dag.type}`} />}
            <CellContent>
                <IconContainer>{icon}</IconContainer>
                <BodyShort>{text}</BodyShort>
            </CellContent>
        </td>
    );
};
