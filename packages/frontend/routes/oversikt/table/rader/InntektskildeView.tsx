import React from 'react';

import { TextWithEllipsis } from '@components/TextWithEllipsis';

import { CellContent } from './CellContent';

interface InntektskildeProps {
    type: Inntektskilde;
}

export const InntektskildeView = React.memo(({ type }: InntektskildeProps) => (
    <CellContent width={128}>
        <TextWithEllipsis>{type === 'EN_ARBEIDSGIVER' ? 'Én arbeidsgiver' : 'Flere arbeidsg.'}</TextWithEllipsis>
    </CellContent>
));
