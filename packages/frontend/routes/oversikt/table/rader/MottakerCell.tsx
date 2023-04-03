import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Mottaker } from '@io/graphql';
import { capitalize } from '@utils/locale';

import { Cell } from '../Cell';
import { CellContent } from './CellContent';

interface MottakerCellProps {
    mottaker?: Maybe<Mottaker>;
}

export const MottakerCell: React.FC<MottakerCellProps> = ({ mottaker }) => {
    return (
        <Cell>
            <CellContent width={130}>
                <BodyShort>{capitalize(mottaker ?? '')}</BodyShort>
            </CellContent>
        </Cell>
    );
};
