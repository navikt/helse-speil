import styled from '@emotion/styled';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Cell } from '../Cell';
import { CellContent } from './CellContent';

const getFormattedWarningText = (antallVarsler?: number): string =>
    !antallVarsler ? '' : antallVarsler === 1 ? '1 varsel' : `${antallVarsler} varsler`;

const Text = styled(BodyShort)`
    font-weight: 600;
`;

interface StatusProps {
    numberOfWarnings: number;
}

export const StatusCell = React.memo(({ numberOfWarnings }: StatusProps) => (
    <Cell>
        <CellContent width={100}>
            <Text as="p">{getFormattedWarningText(numberOfWarnings)}</Text>
        </CellContent>
    </Cell>
));
