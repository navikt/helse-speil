import { motion } from 'motion/react';
import React, { ReactElement } from 'react';

import { useQuery as useApolloQuery } from '@apollo/client';
import { Behandlingsstatistikk, HentBehandlingsstatistikkDocument } from '@io/graphql';
import { useGetBehandlingsstatistikk } from '@io/rest/generated/behandlingsstatistikk/behandlingsstatistikk';

import { BehandlingsstatistikkError } from './BehandlingsstatistikkError';
import { BehandlingsstatistikkSkeleton } from './BehandlingsstatistikkSkeleton';
import { BehandlingsstatistikkTable } from './BehandlingsstatistikkTable';
import { useShowStatistikk } from './state';

import styles from './BehandlingsstatistikkView.module.css';

const useBehandlingsstatistikk = () => {
    const gql = useApolloQuery(HentBehandlingsstatistikkDocument);

    const rest = useGetBehandlingsstatistikk({
        query: {
            enabled: gql.error != null, // gjør REST-kallet hvis GraphQL-kallet feilet
        },
    });

    return {
        loading: gql.loading || rest.isLoading,
        error: gql.error && rest.error ? rest.error : undefined,
        data: gql.data ?? (gql.error ? { behandlingsstatistikk: rest.data as Behandlingsstatistikk } : undefined),
    };
};

export const BehandlingsstatistikkView = (): ReactElement => {
    const show = useShowStatistikk();

    const { loading, error, data } = useBehandlingsstatistikk();

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
