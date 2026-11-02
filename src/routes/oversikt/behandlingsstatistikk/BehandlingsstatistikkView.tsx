import React, { ReactElement } from 'react';

import { useGetBehandlingsstatistikk } from '@io/rest/generated/behandlingsstatistikk/behandlingsstatistikk';
import { cn } from '@utils/tw';

import { BehandlingsstatistikkError } from './BehandlingsstatistikkError';
import { BehandlingsstatistikkSkeleton } from './BehandlingsstatistikkSkeleton';
import { BehandlingsstatistikkTable } from './BehandlingsstatistikkTable';
import { useShowStatistikk } from './state';

import styles from './BehandlingsstatistikkView.module.css';

export const BehandlingsstatistikkView = (): ReactElement => {
    const show = useShowStatistikk();

    const { isLoading, error, data } = useGetBehandlingsstatistikk();

    return (
        <div
            className={cn(
                'grid transition-[grid-template-columns] duration-200 ease-in-out motion-reduce:transition-none',
                show ? 'grid-cols-[1fr]' : 'grid-cols-[0fr]',
            )}
        >
            <div className="min-w-0 overflow-hidden">
                <div
                    className={styles.Behandlingsstatistikk}
                    role="region"
                    aria-labelledby="behandlingsstatistikk-toggle"
                >
                    {data && <BehandlingsstatistikkTable behandlingsstatistikk={data} />}
                    {error && <BehandlingsstatistikkError />}
                    {isLoading && <BehandlingsstatistikkSkeleton />}
                </div>
            </div>
        </div>
    );
};
