import React, { ReactElement } from 'react';

import { Table, Tooltip } from '@navikt/ds-react';

import { TextWithEllipsis } from '@components/TextWithEllipsis';
import { Maybe } from '@io/graphql';

interface BehandletAvCellProps {
    name?: Maybe<string>;
}

export const BehandletAvCell = ({ name }: BehandletAvCellProps): ReactElement => {
    return (
        <Table.DataCell>
            {name ? (
                <Tooltip content={name}>
                    <span>
                        <TextWithEllipsis style={{ width: 200 }}>{name}</TextWithEllipsis>
                    </span>
                </Tooltip>
            ) : (
                '-'
            )}
        </Table.DataCell>
    );
};
