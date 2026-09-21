import React, { ReactElement } from 'react';

import { BodyShort, Table, Tooltip } from '@navikt/ds-react';

import { ApiPersonnavn } from '@io/rest/generated/spesialist.schemas';
import { capitalizeName } from '@utils/locale';

const getFormattedName = (name: ApiPersonnavn): string => {
    const { fornavn, mellomnavn, etternavn } = name;
    return capitalizeName(`${etternavn}, ${fornavn} ${mellomnavn ? `${mellomnavn} ` : ''}`);
};

interface SøkerProps {
    name: ApiPersonnavn;
}

export const SøkerCell = ({ name }: SøkerProps): ReactElement => {
    const formatertNavn = getFormattedName(name);

    return (
        <Table.DataCell style={{ width: 180 }}>
            <Tooltip content={formatertNavn}>
                <BodyShort truncate data-sensitive style={{ width: 180 }}>
                    {formatertNavn}
                </BodyShort>
            </Tooltip>
        </Table.DataCell>
    );
};
