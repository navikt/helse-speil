import { motion } from 'framer-motion';
import React from 'react';

import { useFetch } from '@hooks/useFetch';
import { fetchBehandlingsstatistikk } from '@io/graphql/fetchBehandlingsstatistikk';

import { BehandlingsstatistikkError } from './BehandlingsstatistikkError';
import { BehandlingsstatistikkSkeleton } from './BehandlingsstatistikkSkeleton';
import { BehandlingsstatistikkTable } from './BehandlingsstatistikkTable';
import { useShowStatistikk } from './state';

import styles from './BehandlingsstatistikkView.module.css';

export const BehandlingsstatistikkView: React.FC = () => {
    const show = useShowStatistikk();

    const { isLoading, value, error } = useFetch(fetchBehandlingsstatistikk);

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
                {value && <BehandlingsstatistikkTable behandlingsstatistikk={value.behandlingsstatistikk} />}
                {error && <BehandlingsstatistikkError />}
                {isLoading && <BehandlingsstatistikkSkeleton />}
            </div>
        </motion.div>
    );
};
