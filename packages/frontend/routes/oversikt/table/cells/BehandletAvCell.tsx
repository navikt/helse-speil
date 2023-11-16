import React from 'react';

import { Table, Tooltip } from '@navikt/ds-react';

import { TextWithEllipsis } from '@components/TextWithEllipsis';
import { slimOppgavetabell } from '@utils/featureToggles';

interface BehandletAvCellProps {
    name?: Maybe<string>;
}

export const BehandletAvCell = ({ name }: BehandletAvCellProps) => {
    return (
        <Table.DataCell>
            {name ? (
                <Tooltip content={name}>
                    <span>
                        <TextWithEllipsis style={{ width: slimOppgavetabell ? 200 : 128 }}>{name}</TextWithEllipsis>
                    </span>
                </Tooltip>
            ) : (
                '-'
            )}
        </Table.DataCell>
    );
};
