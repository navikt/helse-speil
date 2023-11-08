import classNames from 'classnames';
import React from 'react';

import { Clock, DialogDots, Folder } from '@navikt/ds-icons';

import { TabButton } from '@components/TabButton';

import { useFilterState, useShowHistorikkState } from './state';

import styles from './Historikkmeny.module.css';

export const Historikkmeny = () => {
    const [filter, setFilter] = useFilterState();
    const [showHistorikk, setShowHistorikk] = useShowHistorikkState();

    const activateFilter = (nyttFilter: Filtertype) => () => {
        if (showHistorikk && filter === nyttFilter) return setShowHistorikk(false);
        setShowHistorikk(true);
        setFilter(nyttFilter);
    };

    return (
        <div className={styles.historikkmeny}>
            <TabButton
                className={classNames(styles.filterknapp, showHistorikk && filter === 'Historikk' && styles.active)}
                active={showHistorikk && filter === 'Historikk'}
                onClick={activateFilter('Historikk')}
                title="Historikk"
            >
                <Clock title="Historikk" height={22} width={22} />
            </TabButton>
            <TabButton
                className={classNames(styles.filterknapp, showHistorikk && filter === 'Dokument' && styles.active)}
                active={showHistorikk && filter === 'Dokument'}
                onClick={activateFilter('Dokument')}
                title="Dokumenter"
            >
                <Folder title="Dokumenter" height={22} width={22} />
            </TabButton>
            <TabButton
                className={classNames(styles.filterknapp, showHistorikk && filter === 'Notat' && styles.active)}
                active={showHistorikk && filter === 'Notat'}
                onClick={activateFilter('Notat')}
                title="Notat"
            >
                <DialogDots title="Notat" height={22} width={22} />
            </TabButton>
        </div>
    );
};
