import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Oppgaveetikett } from '@components/Oppgaveetikett';
import { Periodetype } from '@io/graphql';

import { Cell } from '../Cell';
import { CellContent } from './CellContent';

const getLabel = (type: Periodetype) => {
    switch (type) {
        case Periodetype.Forlengelse:
        case Periodetype.Infotrygdforlengelse:
            return 'Forlengelse';
        case Periodetype.Forstegangsbehandling:
            return 'Førstegang.';
        case Periodetype.OvergangFraIt:
            return 'Forlengelse IT';
    }
};

interface PeriodetypeCellProps {
    type: Periodetype;
}

export const PeriodetypeCell: React.FC<PeriodetypeCellProps> = React.memo(({ type }) => {
    return (
        <Cell>
            <CellContent width={130}>
                <Oppgaveetikett type={type} />
                <BodyShort style={{ marginLeft: '12px' }}>{getLabel(type)}</BodyShort>
            </CellContent>
        </Cell>
    );
});
