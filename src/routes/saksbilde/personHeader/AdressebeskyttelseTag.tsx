import React, { ReactElement } from 'react';

import { Tag } from '@navikt/ds-react';

import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { Adressebeskyttelse } from '@io/graphql';

interface AdressebeskyttelseTagProps {
    adressebeskyttelse: Adressebeskyttelse;
}

export const AdressebeskyttelseTag = ({ adressebeskyttelse }: AdressebeskyttelseTagProps): ReactElement | null => {
    if (adressebeskyttelse !== 'Fortrolig') {
        return null;
    }
    return (
        <AnonymizableContainer>
            <Tag variant="error" size="small">
                {adressebeskyttelse} adresse
            </Tag>
        </AnonymizableContainer>
    );
};
