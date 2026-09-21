import React, { ReactElement } from 'react';

import { Tag } from '@navikt/ds-react';

import { ApiPersonAdressebeskyttelse } from '@io/rest/generated/spesialist.schemas';

interface AdressebeskyttelseTagProps {
    adressebeskyttelse: ApiPersonAdressebeskyttelse;
}

export const AdressebeskyttelseTag = ({ adressebeskyttelse }: AdressebeskyttelseTagProps): ReactElement | null => {
    if (adressebeskyttelse !== ApiPersonAdressebeskyttelse.FORTROLIG) {
        return null;
    }
    return (
        <div data-sensitive>
            <Tag variant="error" size="small">
                Fortrolig adresse
            </Tag>
        </div>
    );
};
