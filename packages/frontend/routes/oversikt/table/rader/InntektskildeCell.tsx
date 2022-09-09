import React from 'react';

import { TextWithEllipsis } from '@components/TextWithEllipsis';
import { Inntektstype } from '@io/graphql';

import { Cell } from '../Cell';
import { CellContent } from './CellContent';

interface InntektskildeProps {
    type: Inntektskilde | Inntektstype;
}

export const InntektskildeCell = React.memo(({ type }: InntektskildeProps) => (
    <Cell>
        <CellContent width={128}>
            <TextWithEllipsis>{type === 'EN_ARBEIDSGIVER' ? 'Én arbeidsgiver' : 'Flere arbeidsg.'}</TextWithEllipsis>
        </CellContent>
    </Cell>
));
