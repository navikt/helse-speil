import React, { ReactElement } from 'react';

import { ClockIcon, FolderIcon, PencilWritingIcon, PersonPencilIcon } from '@navikt/aksel-icons';

import { TabButton } from '@components/TabButton';
import { Filtertype } from '@typer/historikk';

import { useFilterState, useShowHistorikkState, useShowHøyremenyState } from './state';

import styles from './Historikkmeny.module.css';

export const Historikkmeny = (): ReactElement => {
    const [filter, setFilter] = useFilterState();
    const [showHistorikk, setShowHistorikk] = useShowHistorikkState();
    const [showHøyremeny, setShowHøyremeny] = useShowHøyremenyState();

    const activateFilter = (nyttFilter: Filtertype) => () => {
        if (showHistorikk && showHøyremeny && filter === nyttFilter) {
            setShowHistorikk(false);
            setShowHøyremeny(false);
            return;
        }
        setShowHistorikk(true);
        setShowHøyremeny(true);
        setFilter(nyttFilter);
    };

    return (
        <div className={styles.historikkmeny}>
            <TabButton
                active={showHistorikk && filter === 'Historikk'}
                onClick={activateFilter('Historikk')}
                title="Historikk"
            >
                <ClockIcon title="Historikk" fontSize="18px" />
            </TabButton>
            <TabButton
                active={showHistorikk && filter === 'Dokument'}
                onClick={activateFilter('Dokument')}
                title="Dokumenter"
            >
                <FolderIcon title="Dokumenter" fontSize="18px" />
            </TabButton>
            <TabButton active={showHistorikk && filter === 'Notat'} onClick={activateFilter('Notat')} title="Notat">
                <PencilWritingIcon title="Notat" fontSize="18px" />
            </TabButton>
            <TabButton
                active={showHistorikk && filter === 'Overstyring'}
                onClick={activateFilter('Overstyring')}
                title="Overstyring"
            >
                <PersonPencilIcon title="Overstyring" fontSize="18px" />
            </TabButton>
        </div>
    );
};
