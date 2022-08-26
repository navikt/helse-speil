import React from 'react';

import { TabButton } from '@components/TabButton';

import { useFilterState, useShowHistorikkState } from './state';

import iconDokumenter from './icons/IconDokumenter.svg';
import iconHistorikk from './icons/IconHistorikk.svg';

import styles from './HistorikkHeader.module.css';

export const HistorikkHeader = () => {
    const [filter, setFilter] = useFilterState();
    const [showHistorikk, setShowHistorikk] = useShowHistorikkState();

    const activateFilter = (filter: Filtertype) => () => {
        setShowHistorikk(true);
        setFilter(filter);
    };

    return (
        <div className={styles.HistorikkHeader}>
            <TabButton
                className={styles.FilterButton}
                active={showHistorikk && filter === 'Historikk'}
                onClick={activateFilter('Historikk')}
                title="Historikk"
            >
                <img alt="" src={iconHistorikk} />
            </TabButton>
            <TabButton
                className={styles.FilterButton}
                active={showHistorikk && filter === 'Dokument'}
                onClick={activateFilter('Dokument')}
                title="Dokumenter"
            >
                <img alt="" src={iconDokumenter} />
            </TabButton>
        </div>
    );
};
