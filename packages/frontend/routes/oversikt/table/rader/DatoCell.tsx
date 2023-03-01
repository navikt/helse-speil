import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { NORSK_DATOFORMAT, somDato } from '@utils/date';

import { Cell } from '../Cell';
import { CellContent } from './CellContent';

interface DatoProps {
    date: string;
}

export const DatoCell = React.memo(({ date }: DatoProps) => (
    <Cell>
        <CellContent width={100}>
            <BodyShort>{`${somDato(date).format(NORSK_DATOFORMAT)}`}</BodyShort>
        </CellContent>
    </Cell>
));
