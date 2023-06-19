import classNames from 'classnames';
import React from 'react';
import { useRecoilState } from 'recoil';

import { DataFilled } from '@navikt/ds-icons';

import { RoundedButton } from '@components/RoundedButton';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useMineOppgaver, useOppgaver } from '@state/oppgaver';

import { useShowStatistikk, useToggleStatistikk } from './behandlingsstatistikk/state';
import { TabType, tabState } from './tabState';

import styles from './Tabs.module.css';

interface OppgaveTabProps {
    tag: TabType;
    label: string;
    numberOfTasks?: number;
}

const OppgaveTab = ({ tag, label, numberOfTasks }: OppgaveTabProps) => {
    const [aktivTab, setAktivTab] = useRecoilState(tabState);
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

const AlleSakerTab = () => {
    const { oid } = useInnloggetSaksbehandler();
    const antallOppgaver = useOppgaver().filter((it) => it.tildeling?.oid !== oid).length;
    return <OppgaveTab tag={TabType.TilGodkjenning} label="Til godkjenning" numberOfTasks={antallOppgaver} />;
};

const MineSakerTab = () => {
    const antallEgneOppgaver = useMineOppgaver().filter((it) => !it.tildeling?.paaVent).length;
    return <OppgaveTab tag={TabType.Mine} label="Mine saker" numberOfTasks={antallEgneOppgaver} />;
};

const VentendeSakerTab = () => {
    const antallEgneVentendeSaker = useMineOppgaver().filter((it) => it.tildeling?.paaVent).length;
    return <OppgaveTab tag={TabType.Ventende} label="På vent" numberOfTasks={antallEgneVentendeSaker} />;
};

const BehandletIdagTab = () => {
    return <OppgaveTab tag={TabType.BehandletIdag} label="Behandlet i dag" />;
};

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
