import styled from '@emotion/styled';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { CellContent } from '../../table/CellContent';
import { IconAnnullert } from '../../table/icons/IconAnnullert';
import { IconArbeidsdag } from '../../table/icons/IconArbeidsdag';
import { IconArbeidsgiverperiode } from '../../table/icons/IconArbeidsgiverperiode';
import { IconEgenmelding } from '../../table/icons/IconEgenmelding';
import { IconFailure } from '../../table/icons/IconFailure';
import { IconFerie } from '../../table/icons/IconFerie';
import { IconPermisjon } from '../../table/icons/IconPermisjon';
import { IconSyk } from '../../table/icons/IconSyk';
import { UtbetalingstabellDag } from './Utbetalingstabell.types';

const IconContainer = styled.div`
    width: 1rem;
    margin-right: 1rem;
    display: flex;
    align-items: center;
    flex-shrink: 0;
`;

const dagtypeIcon = (type: Dag['type']) => {
    switch (type) {
        case 'Syk':
            return <IconSyk />;
        case 'Ferie':
            return <IconFerie />;
        case 'Avslått':
        case 'Foreldet':
            return <IconFailure />;
        case 'Egenmelding':
            return <IconEgenmelding />;
        case 'Arbeidsdag':
            return <IconArbeidsdag />;
        case 'Arbeidsgiverperiode':
            return <IconArbeidsgiverperiode />;
        case 'Annullert':
            return <IconAnnullert />;
        case 'Permisjon':
            return <IconPermisjon />;
        case 'Ubestemt':
        case 'Helg':
        default:
            return null;
    }
};

const textForType = (typeUtbetalingsdag: Dag['type'], typeSykdomsdag: Dag['type']): string => {
    switch (typeUtbetalingsdag) {
        case 'Avslått':
            return `${typeSykdomsdag} (Avslått)`;
        case 'Foreldet':
            return `${typeSykdomsdag} (Foreldet)`;
        case 'Arbeidsgiverperiode':
            return `${typeSykdomsdag} (AGP)`;
        default:
            return typeSykdomsdag;
    }
};

interface DagtypeCellProps extends React.HTMLAttributes<HTMLTableDataCellElement> {
    typeUtbetalingsdag: Dag['type'];
    typeSykdomsdag: Dag['type'];
    overstyrtDag?: UtbetalingstabellDag;
}

export const DagtypeCell: React.FC<DagtypeCellProps> = ({
    typeUtbetalingsdag,
    typeSykdomsdag,
    overstyrtDag,
    ...rest
}) => {
    const text = textForType(typeUtbetalingsdag, overstyrtDag?.type ?? typeSykdomsdag);
    const type = ['Avvist', 'Foreldet'].includes(typeUtbetalingsdag)
        ? typeUtbetalingsdag
        : overstyrtDag?.type ?? typeSykdomsdag;

    return (
        <td {...rest}>
            <CellContent>
                <IconContainer>{dagtypeIcon(type)}</IconContainer>
                <BodyShort>{text}</BodyShort>
            </CellContent>
        </td>
    );
};
