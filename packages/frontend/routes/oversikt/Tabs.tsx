import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';

import { BarChartIcon, FilterIcon } from '@navikt/aksel-icons';

import { RoundedButton } from '@components/RoundedButton';
import { useAntallOppgaver } from '@state/oppgaver';

import { useShowStatistikk, useToggleStatistikk } from './behandlingsstatistikk/state';
import { filtermenyWidth, useShowFiltermeny, useToggleFiltermeny } from './filtermeny/state';
import { TabType, useSwitchTab } from './tabState';

import styles from './Tabs.module.css';

interface OppgaveTabProps {
    tag: TabType;
    label: string;
    numberOfTasks?: number;
}

const OppgaveTab = ({ tag, label, numberOfTasks }: OppgaveTabProps) => {
    const [aktivTab, setAktivTab] = useSwitchTab();
    return (
        <button
            className={classNames(styles.tab, aktivTab === tag && styles.active)}
            role="tab"
            aria-selected={aktivTab === tag}
            onClick={() => setAktivTab(tag)}
        >
            {label}
            {typeof numberOfTasks === 'number' && <span>({numberOfTasks})</span>}
        </button>
    );
};

const AlleSakerTab = () => <OppgaveTab tag={TabType.TilGodkjenning} label="Til godkjenning" />;

const MineSakerTab = () => {
    const { antallMineSaker } = useAntallOppgaver();
    return <OppgaveTab tag={TabType.Mine} label="Mine saker" numberOfTasks={antallMineSaker} />;
};

const VentendeSakerTab = () => {
    const { antallPåVent } = useAntallOppgaver();
    return <OppgaveTab tag={TabType.Ventende} label="På vent" numberOfTasks={antallPåVent} />;
};

const BehandletIdagTab = () => <OppgaveTab tag={TabType.BehandletIdag} label="Behandlet i dag" />;

const FilterButton = () => {
    const toggleFiltermeny = useToggleFiltermeny();
    const showFiltermeny = useShowFiltermeny();
    const filtermenyBredde = useRecoilValue(filtermenyWidth);
    const prevShowFiltermeny = useRef<boolean>(showFiltermeny);

    useEffect(() => {
        prevShowFiltermeny.current = showFiltermeny;
    }, [showFiltermeny]);

    return (
        <RoundedButton
            id="filtermeny-toggle"
            className={classNames(
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
        </RoundedButton>
    );
};

const StatistikkButton = () => {
    const toggleStatistikk = useToggleStatistikk();
    const showStatistikk = useShowStatistikk();

    return (
        <RoundedButton
            id="behandlingsstatistikk-toggle"
            className={classNames(styles.button, styles.statistikkbutton, showStatistikk && styles.active)}
            aria-label="Toggle visning av behandlingsstatistikk"
            aria-expanded={showStatistikk}
            onClick={toggleStatistikk}
        >
            <BarChartIcon title="Behandlingsstatistikk" fontSize="18px" />
        </RoundedButton>
    );
};

export const Tabs = () => {
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
