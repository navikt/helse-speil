import React from 'react';

import { TekstMedEllipsis } from '../../../../components/TekstMedEllipsis';

import { CellContent } from './CellContent';

interface InntektskildeProps {
    type: Inntektskilde;
}

export const InntektskildeView = React.memo(({ type }: InntektskildeProps) => (
    <CellContent width={128}>
        <TekstMedEllipsis>{type === 'EN_ARBEIDSGIVER' ? 'Én arbeidsgiver' : 'Flere arbeidsg.'}</TekstMedEllipsis>
    </CellContent>
));
