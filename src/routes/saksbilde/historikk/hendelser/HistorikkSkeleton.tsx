import React, { ReactElement } from 'react';

import { HStack, VStack } from '@navikt/ds-react';

import { LoadingShimmer } from '@components/LoadingShimmer';
import styles from '@saksbilde/historikk/Historikk.module.css';

export const HistorikkSkeleton = (): ReactElement => {
    return (
        <HStack className={styles.historikkskeletonwrapper}>
            <div className={styles.historikkskeleton}>
                <ul>
                    <div>HISTORIKK</div>
                    <HistorikkhendelseSkeleton enLinje />
                    <HistorikkhendelseSkeleton />
                    <HistorikkhendelseSkeleton />
                </ul>
            </div>
            <VStack gap="6" className={styles.historikkskeletonmeny}>
                <LoadingShimmer style={{ borderRadius: '100%', height: 32 }} />
                <LoadingShimmer style={{ borderRadius: '100%', height: 32 }} />
                <LoadingShimmer style={{ borderRadius: '100%', height: 32 }} />
                <LoadingShimmer style={{ borderRadius: '100%', height: 32 }} />
            </VStack>
        </HStack>
    );
};

type HistorikkhendelseSkeletonProps = {
    enLinje?: boolean;
};

const HistorikkhendelseSkeleton = ({ enLinje }: HistorikkhendelseSkeletonProps): ReactElement => {
    return (
        <li className={styles.hendelse}>
            <div className={styles.iconContainer}>
                <LoadingShimmer style={{ height: 20, marginBottom: 4 }} />
            </div>
            <div className={styles.content}>
                <LoadingShimmer style={{ height: 20, marginBottom: 4 }} />
                {!enLinje && <LoadingShimmer style={{ height: 20, width: 74, marginBottom: 4 }} />}
                {!enLinje && <LoadingShimmer style={{ height: 20, width: 120 }} />}
            </div>
        </li>
    );
};
