import React from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import { VStack } from '@navikt/ds-react';

import { Endringstrekant } from '@components/Endringstrekant';
import { Kilde } from '@components/Kilde';
import { Kildetype } from '@io/graphql';

interface RefusjonKildeProps {
    kilde: Kildetype;
    harLokaleOpplysninger?: boolean;
    harEndringer?: boolean;
}

export const RefusjonKilde = ({ kilde, harLokaleOpplysninger = false, harEndringer = false }: RefusjonKildeProps) => (
    <VStack align="center">
        {kilde === Kildetype.Inntektsmelding && <Kilde type={'Inntektsmelding'}>IM</Kilde>}
        {kilde === Kildetype.Saksbehandler &&
            (harLokaleOpplysninger && harEndringer ? (
                <div style={{ position: 'relative', width: '20px' }}>
                    <Endringstrekant />
                </div>
            ) : (
                <Kilde type="Saksbehandler">
                    <PersonPencilFillIcon title="Saksbehandler ikon" height={12} width={12} />
                </Kilde>
            ))}
    </VStack>
);
