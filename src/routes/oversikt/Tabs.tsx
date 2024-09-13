import classNames from 'classnames';
import React, { ReactElement, useEffect, useRef } from 'react';

import { BarChartIcon, FilterIcon } from '@navikt/aksel-icons';
import { HStack, Skeleton } from '@navikt/ds-react';

import { useAntallOppgaver } from '@state/oppgaver';

import { useShowStatistikk, useToggleStatistikk } from './behandlingsstatistikk/state';
import { useFiltermenyWidth, useShowFiltermeny, useToggleFiltermeny } from './filtermeny/state';
import { TabType, useSwitchTab } from './tabState';

import styles from './Tabs.module.scss';

interface OppgaveTabProps {
    tag: TabType;
    label: string;
    numberOfTasks?: number;
}

const OppgaveTab = ({ tag, label, numberOfTasks }: OppgaveTabProps): ReactElement => {
    const [aktivTab, setAktivTab] = useSwitchTab();

    return (
        <button
            className={classNames(styles.tab, { [styles.active]: aktivTab === tag })}
            role="tab"
            aria-selected={aktivTab === tag}
            onClick={() => setAktivTab(tag)}
        >
            {label}
            {typeof numberOfTasks === 'number' && <span>({numberOfTasks})</span>}
        </button>
    );
};

const AlleSakerTab = (): ReactElement => <OppgaveTab tag={TabType.TilGodkjenning} label="Til godkjenning" />;

const MineSakerTab = (): ReactElement => {
    const { antallMineSaker } = useAntallOppgaver();
    return <OppgaveTab tag={TabType.Mine} label="Mine saker" numberOfTasks={antallMineSaker} />;
};

const VentendeSakerTab = (): ReactElement => {
    const { antallPåVent } = useAntallOppgaver();
    return <OppgaveTab tag={TabType.Ventende} label="På vent" numberOfTasks={antallPåVent} />;
};

const BehandletIdagTab = (): ReactElement => <OppgaveTab tag={TabType.BehandletIdag} label="Behandlet i dag" />;

const FilterButton = (): ReactElement => {
    const toggleFiltermeny = useToggleFiltermeny();
    const showFiltermeny = useShowFiltermeny();
    const filtermenyBredde = useFiltermenyWidth();
    const prevShowFiltermeny = useRef<boolean>(showFiltermeny);

    useEffect(() => {
        prevShowFiltermeny.current = showFiltermeny;
    }, [showFiltermeny]);

    return (
        <button
            id="filtermeny-toggle"
            className={classNames(
                styles.roundedbutton,
                styles.button,
                styles.filterbutton,
                showFiltermeny && styles.active,
                showFiltermeny === prevShowFiltermeny.current && styles.varaktiv,
            )}
            aria-label="Toggle visning av filtermeny"
            aria-expanded={showFiltermeny}
            onClick={toggleFiltermeny}
            style={{ marginRight: showFiltermeny ? `${filtermenyBredde - 32}px` : '1rem' }}
        >
            <FilterIcon title="Filtermeny" fontSize="18px" />
        </button>
    );
};

const StatistikkButton = (): ReactElement => {
    const toggleStatistikk = useToggleStatistikk();
    const showStatistikk = useShowStatistikk();

    return (
        <button
            id="behandlingsstatistikk-toggle"
            className={classNames(
                styles.roundedbutton,
                styles.button,
                styles.statistikkbutton,
                showStatistikk && styles.active,
            )}
            aria-label="Toggle visning av behandlingsstatistikk"
            aria-expanded={showStatistikk}
            onClick={toggleStatistikk}
        >
            <BarChartIcon title="Behandlingsstatistikk" fontSize="18px" />
        </button>
    );
};

export const Tabs = (): ReactElement => {
    return (
        <div className={styles.tabs}>
            <FilterButton />
            <span role="tablist">
                <AlleSakerTab />
                <MineSakerTab />
                <VentendeSakerTab />
                <BehandletIdagTab />
            </span>
            <StatistikkButton />
        </div>
    );
};

export function TabsSkeleton(): ReactElement {
    return (
        <div className={styles.tabs}>
            <Skeleton variant="circle" width={32} height={32} style={{ marginRight: 304 }} />
            <HStack gap="8">
                <Skeleton width={106} height={32} />
                <Skeleton width={94} height={32} />
                <Skeleton width={72} height={32} />
                <Skeleton width={108} height={32} />
            </HStack>
            <Skeleton variant="circle" width={32} height={32} style={{ marginLeft: 'auto' }} />
        </div>
    );
}
