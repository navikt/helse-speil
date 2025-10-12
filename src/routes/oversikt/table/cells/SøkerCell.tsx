import React, { ReactElement } from 'react';

import { Table, Tooltip } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { Personnavn } from '@io/rest/generated/spesialist.schemas';
import { useIsAnonymous } from '@state/anonymization';
import { capitalizeName } from '@utils/locale';

const getFormattedName = (name: Personnavn): string => {
    const { fornavn, mellomnavn, etternavn } = name;
    return capitalizeName(`${etternavn}, ${fornavn} ${mellomnavn ? `${mellomnavn} ` : ''}`);
};

interface SøkerProps {
    name: Personnavn;
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
