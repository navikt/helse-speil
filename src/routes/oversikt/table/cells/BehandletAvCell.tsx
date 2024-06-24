import React, { ReactElement } from 'react';

import { BodyShort, Table, Tooltip } from '@navikt/ds-react';

import { Maybe } from '@io/graphql';

interface BehandletAvCellProps {
    name?: Maybe<string>;
}

export const BehandletAvCell = ({ name }: BehandletAvCellProps): ReactElement => {
    return (
        <Table.DataCell>
            {name ? (
                <Tooltip content={name}>
                    <BodyShort truncate>{name}</BodyShort>
                </Tooltip>
            ) : (
                '-'
            )}
        </Table.DataCell>
    );
};
