import styled from '@emotion/styled';
import { Dagtype } from 'internal-types';
import React from 'react';

import { Normaltekst } from 'nav-frontend-typografi';

import { CellContent } from './CellContent';
import { UtbetalingsdagIcon } from './UtbetalingsdagIcon';

const Cell = styled.td``;

const IconContainer = styled.div`
    width: 1rem;
    margin-right: 1rem;
    display: flex;
    align-items: center;
    flex-shrink: 0;
`;

const Text = styled(Normaltekst)`
    min-width: 8rem;
`;

interface UtbetalingsdagCellProps extends React.HTMLAttributes<HTMLTableDataCellElement> {
    typeUtbetalingsdag: Dagtype;
    typeSykdomsdag: Dagtype;
}

export const UtbetalingsdagCell = ({ typeUtbetalingsdag, typeSykdomsdag, ...rest }: UtbetalingsdagCellProps) => {
    const text = (() => {
        switch (typeUtbetalingsdag) {
            case Dagtype.Avvist:
                return `${typeSykdomsdag} (Avvist)`;
            case Dagtype.Foreldet:
                return `${typeSykdomsdag} (Foreldet)`;
            case Dagtype.Arbeidsgiverperiode:
                return `${typeSykdomsdag} (AGP)`;
            default:
                return typeSykdomsdag;
        }
    })();

    return (
        <Cell {...rest}>
            <CellContent>
                <IconContainer>
                    <UtbetalingsdagIcon
                        type={
                            [Dagtype.Avvist, Dagtype.Foreldet].includes(typeUtbetalingsdag)
                                ? typeUtbetalingsdag
                                : typeSykdomsdag
                        }
                    />
                </IconContainer>
                <Text>{text}</Text>
            </CellContent>
        </Cell>
    );
};
