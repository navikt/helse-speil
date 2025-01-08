import React, { ReactElement } from 'react';

import { Table, Tooltip } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { Personinfo } from '@io/graphql';
import { useIsAnonymous } from '@state/anonymization';
import { capitalizeName } from '@utils/locale';

type Name = Pick<Personinfo, 'fornavn' | 'etternavn' | 'mellomnavn'>;

const getFormattedName = (name: Name): string => {
    const { fornavn, mellomnavn, etternavn } = name;
    return capitalizeName(`${etternavn}, ${fornavn} ${mellomnavn ? `${mellomnavn} ` : ''}`);
};

interface SøkerProps {
    name: Name;
}

export const SøkerCell = ({ name }: SøkerProps): ReactElement => {
    const isAnonymous = useIsAnonymous();
    const formatertNavn = getFormattedName(name);

    return (
        <Table.DataCell style={{ width: 180 }}>
            <Tooltip content={isAnonymous ? 'Sykmeldt' : formatertNavn}>
                <span>
                    <AnonymizableTextWithEllipsis style={{ width: 180 }}>{formatertNavn}</AnonymizableTextWithEllipsis>
                </span>
            </Tooltip>
        </Table.DataCell>
    );
};
