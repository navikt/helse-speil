import React, { ReactElement } from 'react';

import { PackageFillIcon } from '@navikt/aksel-icons';
import { Heading } from '@navikt/ds-react';

import styles from './Infotrygdvurdering.module.css';

interface InfotrygdvurderingProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
}

export const Infotrygdvurdering = ({ children, title, ...divProps }: InfotrygdvurderingProps): ReactElement => (
    <div className={styles.container} {...divProps}>
        <div className={styles.iconcontainer}>
            <PackageFillIcon color="white" />
        </div>
        <Heading as="h2" size="xsmall">
            {title}
        </Heading>
        {children}
    </div>
);
