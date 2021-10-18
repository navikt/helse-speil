import React from 'react';

import { TekstMedEllipsis } from '../../../../components/TekstMedEllipsis';

import { Cell } from '../Cell';
import { CellContent } from './CellContent';

interface InntektskildeProps {
    type: Inntektskilde;
}

export const InntektskildeCell = React.memo(({ type }: InntektskildeProps) => (
    <Cell>
        <CellContent width={128}>
            <TekstMedEllipsis>{type === 'EN_ARBEIDSGIVER' ? 'Én arbeidsgiver' : 'Flere arbeidsg.'}</TekstMedEllipsis>
        </CellContent>
    </Cell>
));
