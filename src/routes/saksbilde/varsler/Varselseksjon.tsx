import React, { PropsWithChildren, ReactElement, ReactNode } from 'react';

import { BodyLongWithPreWrap } from '@components/BodyLongWithPreWrap';

import styles from './Varselseksjon.module.css';

type VarselseksjonProps = {
    tittel: ReactNode;
};

export const Varselseksjon = ({ tittel, children }: PropsWithChildren<VarselseksjonProps>): ReactElement => (
    <div className={styles.container}>
        <BodyLongWithPreWrap weight="semibold">{tittel}</BodyLongWithPreWrap>
        <BodyLongWithPreWrap>{children}</BodyLongWithPreWrap>
    </div>
);
