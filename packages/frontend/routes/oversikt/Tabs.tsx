import classNames from 'classnames';
import React from 'react';

import { DataFilled } from '@navikt/ds-icons';

import { RoundedButton } from '@components/RoundedButton';
import { useAntallOppgaver } from '@state/oppgaver';

import { useShowStatistikk, useToggleStatistikk } from './behandlingsstatistikk/state';
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
            className={classNames(styles.Tab, aktivTab === tag && styles.active)}
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

export const Tabs = () => {
    const toggleStatistikk = useToggleStatistikk();
    const showStatistikk = useShowStatistikk();

    return (
        <div className={styles.Tabs}>
            <span role="tablist">
                <AlleSakerTab />
                <MineSakerTab />
                <VentendeSakerTab />
                <BehandletIdagTab />
            </span>
            <RoundedButton
                id="behandlingsstatistikk-toggle"
                className={classNames(styles.Button, showStatistikk && styles.active)}
                aria-label="Toggle visning av behandlingsstatistikk"
                aria-expanded={showStatistikk}
                onClick={toggleStatistikk}
            >
                <DataFilled title="Behandlingsstatistikk" width={20} height={20} />
            </RoundedButton>
        </div>
    );
};
