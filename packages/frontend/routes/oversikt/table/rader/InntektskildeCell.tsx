import React from 'react';

import { TextWithEllipsis } from '@components/TextWithEllipsis';

import { Cell } from '../Cell';
import { CellContent } from './CellContent';

interface InntektskildeProps {
    flereArbeidsgivere: boolean;
}

export const InntektskildeCell = React.memo(({ flereArbeidsgivere }: InntektskildeProps) => (
    <Cell>
        <CellContent width={128}>
            <TextWithEllipsis>{flereArbeidsgivere ? 'Flere arbeidsg.' : 'Én arbeidsgiver'}</TextWithEllipsis>
        </CellContent>
    </Cell>
));
