import React, { ReactElement } from 'react';

import { HStack } from '@navikt/ds-react';

import styles from './ÅrsakListe.module.css';

type ÅrsakListeProps = {
    årsaker: string[];
};

export const ÅrsakListe = ({ årsaker }: ÅrsakListeProps): ReactElement => (
    <ul className={styles.list}>
        {årsaker?.map((årsak, index) => (
            <li key={index}>
                <HStack gap="3" align="center" wrap={false}>
                    <span className={styles.prikk}>•</span>
                    {årsak}
                </HStack>
            </li>
        ))}
    </ul>
);
