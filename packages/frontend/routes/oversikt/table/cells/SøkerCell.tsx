import React from 'react';

import { Table, Tooltip } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import { Personinfo } from '@io/graphql';
import { capitalizeName } from '@utils/locale';

type Name = Pick<Personinfo, 'fornavn' | 'etternavn' | 'mellomnavn'>;

const getFormattedName = (name: Name): string => {
    const { fornavn, mellomnavn, etternavn } = name;
    return capitalizeName(`${etternavn}, ${fornavn} ${mellomnavn ? `${mellomnavn} ` : ''}`);
};

interface SøkerProps {
    name: Name;
}

export const SøkerCell = ({ name }: SøkerProps) => {
    const formatertNavn = getFormattedName(name);

    return (
        <Table.DataCell style={{ width: 180 }}>
            <Tooltip content={formatertNavn}>
                <span>
                    <AnonymizableTextWithEllipsis style={{ width: 180 }}>{formatertNavn}</AnonymizableTextWithEllipsis>
                </span>
            </Tooltip>
        </Table.DataCell>
    );
};
