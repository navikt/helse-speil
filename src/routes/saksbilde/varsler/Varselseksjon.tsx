import React, { PropsWithChildren, ReactElement, ReactNode } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { BodyShortWithPreWrap } from '@components/BodyShortWithPreWrap';

import styles from './Varselseksjon.module.css';

type VarselseksjonProps = {
    tittel: ReactNode;
};

export const Varselseksjon = ({ tittel, children }: PropsWithChildren<VarselseksjonProps>): ReactElement => (
    <div className={styles.container}>
        <BodyShort weight="semibold">{tittel}</BodyShort>
        <BodyShortWithPreWrap>{children}</BodyShortWithPreWrap>
    </div>
);
