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
                <HStack gap="3" align="center">
                    <svg
                        width="0.375rem"
                        height="0.375rem"
                        viewBox="0 0 6 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden
                        focusable={false}
                        role="img"
                    >
                        <rect width="6" height="6" rx="3" fill="currentColor" />
                    </svg>
                    {årsak}
                </HStack>
            </li>
        ))}
    </ul>
);
