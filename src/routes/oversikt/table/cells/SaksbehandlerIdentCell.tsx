import React, { ReactElement } from 'react';

import { BodyShort, DataCellProps, Table, Tooltip } from '@navikt/ds-react';

import { Maybe } from '@io/graphql';

interface SaksbehandlerIdentCellProps extends DataCellProps {
    name?: Maybe<string>;
}

export const SaksbehandlerIdentCell = ({ name, ...rest }: SaksbehandlerIdentCellProps): ReactElement => {
    return (
        <Table.DataCell {...rest}>
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
