import styled from '@emotion/styled';
import { Dagtype } from 'internal-types';
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

const dagtypeIcon = (type: Dagtype) => {
    switch (type) {
        case Dagtype.Syk:
            return <IconSyk />;
        case Dagtype.Ferie:
            return <IconFerie />;
        case Dagtype.Avvist:
        case Dagtype.Foreldet:
            return <IconFailure />;
        case Dagtype.Egenmelding:
            return <IconEgenmelding />;
        case Dagtype.Arbeidsdag:
            return <IconArbeidsdag />;
        case Dagtype.Arbeidsgiverperiode:
            return <IconArbeidsgiverperiode />;
        case Dagtype.Annullert:
            return <IconAnnullert />;
        case Dagtype.Permisjon:
            return <IconPermisjon />;
        case Dagtype.Ubestemt:
        case Dagtype.Helg:
        default:
            return null;
    }
};

const textForType = (typeUtbetalingsdag: Dagtype, typeSykdomsdag: Dagtype): string => {
    switch (typeUtbetalingsdag) {
        case Dagtype.Avvist:
            return `${typeSykdomsdag} (Avslått)`;
        case Dagtype.Foreldet:
            return `${typeSykdomsdag} (Foreldet)`;
        case Dagtype.Arbeidsgiverperiode:
            return `${typeSykdomsdag} (AGP)`;
        default:
            return typeSykdomsdag;
    }
};

interface DagtypeCellProps extends React.HTMLAttributes<HTMLTableDataCellElement> {
    typeUtbetalingsdag: Dagtype;
    typeSykdomsdag: Dagtype;
    overstyrtDag?: UtbetalingstabellDag;
}

export const DagtypeCell: React.FC<DagtypeCellProps> = ({
    typeUtbetalingsdag,
    typeSykdomsdag,
    overstyrtDag,
    ...rest
}) => {
    const text = textForType(typeUtbetalingsdag, overstyrtDag?.type ?? typeSykdomsdag);
    const type = [Dagtype.Avvist, Dagtype.Foreldet].includes(typeUtbetalingsdag)
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
