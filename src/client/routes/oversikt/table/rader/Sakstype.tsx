import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Flex } from '../../../../components/Flex';
import { Oppgaveetikett } from '../../../../components/Oppgaveetikett';

import { CellContent } from './CellContent';

const getLabelForType = (type: Periodetype) => {
    switch (type) {
        case 'forlengelse':
        case 'infotrygdforlengelse':
            return 'Forlengelse';
        case 'førstegangsbehandling':
            return 'Førstegang.';
        case 'overgangFraIt':
            return 'Forlengelse IT';
        case 'stikkprøve':
            return 'Stikkprøve';
        case 'riskQa':
            return 'Risk QA';
        case 'revurdering':
            return 'Revurdering';
    }
};

interface SakstypeProps {
    type: Periodetype;
}

export const Sakstype = React.memo(({ type }: SakstypeProps) => (
    <CellContent width={128}>
        <Flex alignItems="center">
            <Oppgaveetikett type={type} />
            <BodyShort style={{ marginLeft: '12px' }}>{getLabelForType(type)}</BodyShort>
        </Flex>
    </CellContent>
));
