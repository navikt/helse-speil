import { motion } from 'motion/react';
import React, { ReactElement } from 'react';

import { useQuery } from '@apollo/client';
import { HentBehandlingsstatistikkDocument } from '@io/graphql';

import { BehandlingsstatistikkError } from './BehandlingsstatistikkError';
import { BehandlingsstatistikkSkeleton } from './BehandlingsstatistikkSkeleton';
import { BehandlingsstatistikkTable } from './BehandlingsstatistikkTable';
import { useShowStatistikk } from './state';

import styles from './BehandlingsstatistikkView.module.css';

export const BehandlingsstatistikkView = (): ReactElement => {
    const show = useShowStatistikk();

    const { loading, error, data } = useQuery(HentBehandlingsstatistikkDocument);

    return (
        <motion.div
            key="behandlingsstatistikk"
            initial={{ width: show ? 'max-content' : 0 }}
            animate={{ width: show ? 'max-content' : 0 }}
            transition={{
                type: 'tween',
                duration: 0.2,
                ease: 'easeInOut',
            }}
            style={{ overflow: 'visible' }}
        >
            <div className={styles.Behandlingsstatistikk} role="region" aria-labelledby="behandlingsstatistikk-toggle">
                {data && <BehandlingsstatistikkTable behandlingsstatistikk={data.behandlingsstatistikk} />}
                {error && <BehandlingsstatistikkError />}
                {loading && <BehandlingsstatistikkSkeleton />}
            </div>
        </motion.div>
    );
};
