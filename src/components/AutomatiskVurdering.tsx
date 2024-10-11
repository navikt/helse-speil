import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { CogFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Heading } from '@navikt/ds-react';

import styles from './Vurdering.module.scss';

interface AutomatiskVurderingProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    ident: string;
}

export const AutomatiskVurdering = ({
    children,
    title,
    ident,
    ...divProps
}: AutomatiskVurderingProps): ReactElement => (
    <div className={classNames(styles.container, styles['container__automatisk'])} {...divProps}>
        <div className={styles.ikoncontainer}>
            <CogFillIcon color="white" />
        </div>
        <div className={styles.column}>
            <Heading level="2" size="xsmall">
                {title}
            </Heading>
            <BodyShort size="small" className={styles.details}>
                Behandlet av {ident}
            </BodyShort>
        </div>
        {children}
    </div>
);
