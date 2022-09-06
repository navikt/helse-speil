import React from 'react';
import { motion } from 'framer-motion';

import { useShowStatistikk } from './state';
import { useBehandlingsstatistikk } from './useBehandlingsstatistikk';
import { BehandlingsstatistikkTable } from './BehandlingsstatistikkTable';
import { BehandlingsstatistikkError } from './BehandlingsstatistikkError';
import { BehandlingsstatistikkSkeleton } from './BehandlingsstatistikkSkeleton';

import styles from './BehandlingsstatistikkView.module.css';

export const BehandlingsstatistikkView: React.FC = () => {
    const show = useShowStatistikk();

    const { isLoading, value, error } = useBehandlingsstatistikk();

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
                {value && <BehandlingsstatistikkTable behandlingsstatistikk={value} />}
                {error && <BehandlingsstatistikkError />}
                {isLoading && <BehandlingsstatistikkSkeleton />}
            </div>
        </motion.div>
    );
};
