import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { Tag } from '@navikt/ds-react';

import { NORSK_DATOFORMAT } from '@utils/date';

interface DødsdatoTagProps {
    dødsdato?: string | null;
}

export const DødsdatoTag = ({ dødsdato }: DødsdatoTagProps): ReactElement | null => {
    if (!dødsdato) {
        return null;
    }

    return (
        <div data-sensitive>
            <Tag variant="strong" data-color="neutral" size="small">
                Dødsdato {dayjs(dødsdato)?.format(NORSK_DATOFORMAT)}
            </Tag>
        </div>
    );
};
