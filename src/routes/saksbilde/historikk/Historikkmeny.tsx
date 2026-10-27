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
                label="Historikk"
                active={showHistorikk && filter === 'Historikk'}
                onClick={activateFilter('Historikk')}
                data-sporing-event="historikkmeny-klikk"
                data-sporing-event-fane="Historikk"
            >
                <ClockIcon aria-hidden fontSize="18px" />
            </TabButton>
            <TabButton
                label="Dokumenter"
                active={showHistorikk && filter === 'Dokument'}
                onClick={activateFilter('Dokument')}
                data-sporing-event="historikkmeny-klikk"
                data-sporing-event-fane="Dokument"
            >
                <FolderIcon aria-hidden fontSize="18px" />
            </TabButton>
            <TabButton
                label="Notat"
                active={showHistorikk && filter === 'Notat'}
                onClick={activateFilter('Notat')}
                data-sporing-event="historikkmeny-klikk"
                data-sporing-event-fane="Notat"
            >
                <PencilWritingIcon aria-hidden fontSize="18px" />
            </TabButton>
            <TabButton
                label="Overstyring"
                active={showHistorikk && filter === 'Overstyring'}
                onClick={activateFilter('Overstyring')}
                data-sporing-event="historikkmeny-klikk"
                data-sporing-event-fane="Overstyring"
            >
                <PersonPencilIcon aria-hidden fontSize="18px" />
            </TabButton>
        </div>
    );
};
