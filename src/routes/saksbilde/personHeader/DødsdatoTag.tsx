import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { Tag } from '@navikt/ds-react';

import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { NORSK_DATOFORMAT } from '@utils/date';

interface DødsdatoTagProps {
    dødsdato?: string | null;
}

export const DødsdatoTag = ({ dødsdato }: DødsdatoTagProps): ReactElement | null => {
    if (!dødsdato) {
        return null;
    }

    return (
        <AnonymizableContainer>
            <Tag variant="strong" data-color="neutral" size="small">
                Dødsdato {dayjs(dødsdato)?.format(NORSK_DATOFORMAT)}
            </Tag>
        </AnonymizableContainer>
    );
};
