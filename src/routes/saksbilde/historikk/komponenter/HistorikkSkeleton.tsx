import React, { ReactElement } from 'react';

import { HStack, VStack } from '@navikt/ds-react';

import { LoadingShimmer } from '@components/LoadingShimmer';

import skeletonStyles from './HistorikkSkeleton.module.scss';
import hendelseStyles from './Historikkhendelse.module.scss';

export const HistorikkSkeleton = (): ReactElement => {
    return (
        <HStack className={skeletonStyles.historikkskeletonwrapper}>
            <div className={skeletonStyles.historikkskeleton}>
                <ul>
                    <div>HISTORIKK</div>
                    <HistorikkhendelseSkeleton enLinje />
                    <HistorikkhendelseSkeleton />
                    <HistorikkhendelseSkeleton />
                </ul>
            </div>
            <VStack gap="space-24" className={skeletonStyles.historikkskeletonmeny}>
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
        <li className={hendelseStyles.hendelse}>
            <div className={hendelseStyles.iconContainer}>
                <LoadingShimmer style={{ height: 20, marginBottom: 4 }} />
            </div>
            <div className={hendelseStyles.content}>
                <LoadingShimmer style={{ height: 20, marginBottom: 4 }} />
                {!enLinje && <LoadingShimmer style={{ height: 20, width: 74, marginBottom: 4 }} />}
                {!enLinje && <LoadingShimmer style={{ height: 20, width: 120 }} />}
            </div>
        </li>
    );
};
