import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Flex } from '../../../../components/Flex';
import { Oppgaveetikett } from '../../../../components/Oppgaveetikett';

import { Cell } from '../Cell';
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
        case 'fortroligAdresse':
            return 'Fortrolig adr.';
        case 'utbetalingTilSykmeldt':
            return 'Utb. sykmeldt';
    }
};

interface SakstypeProps {
    type: Periodetype;
}

export const SakstypeCell = React.memo(({ type }: SakstypeProps) => (
    <Cell>
        <CellContent width={128}>
            <Flex alignItems="center">
                <Oppgaveetikett type={type} />
                <BodyShort style={{ marginLeft: '12px' }}>{getLabelForType(type)}</BodyShort>
            </Flex>
        </CellContent>
    </Cell>
));
