import React, { ReactElement } from 'react';

import { Tag } from '@navikt/ds-react';

import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { Adressebeskyttelse } from '@io/graphql';

import styles from './PersonHeader.module.css';

interface AdressebeskyttelseTagProps {
    adressebeskyttelse: Adressebeskyttelse;
}

export const AdressebeskyttelseTag = ({ adressebeskyttelse }: AdressebeskyttelseTagProps): ReactElement | null => {
    if (adressebeskyttelse !== 'Fortrolig') {
        return null;
    }
    return (
        <AnonymizableContainer>
            <Tag variant="error" size="medium" className={styles.Tag}>
                {adressebeskyttelse} adresse
            </Tag>
        </AnonymizableContainer>
    );
};
