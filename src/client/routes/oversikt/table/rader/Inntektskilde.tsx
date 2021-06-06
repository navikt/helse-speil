import { InntektskildeType } from 'internal-types';
import React from 'react';

import { TekstMedEllipsis } from '../../../../components/TekstMedEllipsis';

import { CellContent } from './CellContent';

interface InntektskildeProps {
    type: InntektskildeType;
}

export const Inntektskilde = React.memo(({ type }: InntektskildeProps) => (
    <CellContent width={128}>
        <TekstMedEllipsis>
            {type === InntektskildeType.EnArbeidsgiver ? 'Én arbeidsgiver' : 'Flere arbeidsg.'}
        </TekstMedEllipsis>
    </CellContent>
));
