import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Cell } from '../Cell';
import { CellContent } from './CellContent';

import styles from './StatusCell.module.css';

const getFormattedWarningText = (antallVarsler?: number): string =>
    !antallVarsler ? '' : antallVarsler === 1 ? '1 varsel' : `${antallVarsler} varsler`;

interface StatusProps {
    numberOfWarnings: number;
}

export const StatusCell = React.memo(({ numberOfWarnings }: StatusProps) => (
    <Cell>
        <CellContent width={100}>
            <BodyShort className={styles.bold}>{getFormattedWarningText(numberOfWarnings)}</BodyShort>
        </CellContent>
    </Cell>
));
