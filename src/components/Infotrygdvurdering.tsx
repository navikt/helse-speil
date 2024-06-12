import React, { ReactElement } from 'react';

import { Heading } from '@navikt/ds-react';

import styles from './Infotrygdvurdering.module.css';

const Icon = (): ReactElement => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.377 0.0625919C7.1326 -0.0208639 6.86741 -0.020864 6.623 0.0625918L0.918551 2.01045L7.00156 4.58403L13.1129 2.0212L7.377 0.0625919ZM14 2.91431L7.5839 5.60493V13.7819L13.2575 11.5678C13.7052 11.3931 14 10.9616 14 10.481V2.91431ZM6.41723 13.7824V5.6036L0 2.88862V10.481C0 10.9616 0.294774 11.3931 0.742534 11.5678L6.41723 13.7824Z"
            fill="#E7E9E9"
        />
    </svg>
);

interface InfotrygdvurderingProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
}

export const Infotrygdvurdering = ({ children, title, ...divProps }: InfotrygdvurderingProps): ReactElement => (
    <div className={styles.container} {...divProps}>
        <div className={styles.iconcontainer}>
            <Icon />
        </div>
        <Heading as="h2" size="xsmall">
            {title}
        </Heading>
        {children}
    </div>
);
