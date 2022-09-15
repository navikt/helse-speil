import React from 'react';
import classNames from 'classnames';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { BodyShort } from '@navikt/ds-react';
import { DataFilled } from '@navikt/ds-icons';

import { RoundedButton } from '@components/RoundedButton';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useFerdigstilteOppgaver, useMineOppgaver, useOppgaver } from '@state/oppgaver';

import { useShowStatistikk, useToggleStatistikk } from './behandlingsstatistikk/state';

import styles from './Tabs.module.css';
import { sessionStorageEffect } from '@state/effects/sessionStorageEffect';

export enum TabType {
    TilGodkjenning = 'alle',
    Mine = 'mine',
    Ventende = 'ventende',
    BehandletIdag = 'behandletIdag',
}

export const tabState = atom<TabType>({
    key: 'tabState',
    default: TabType.TilGodkjenning,
    effects: [sessionStorageEffect],
});

export const useAktivTab = () => useRecoilValue(tabState);

interface OppgaveTabProps {
    tag: TabType;
    label: string;
    numberOfTasks: number;
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
            <BodyShort>({numberOfTasks})</BodyShort>
        </button>
    );
};

const AlleSakerTab = () => {
    const { oid } = useInnloggetSaksbehandler();
    const antallOppgaver = useOppgaver().filter((it) => it.tildeling?.saksbehandler?.oid !== oid).length;
    return <OppgaveTab tag={TabType.TilGodkjenning} label="Til godkjenning" numberOfTasks={antallOppgaver} />;
};

const MineSakerTab = () => {
    const antallEgneOppgaver = useMineOppgaver().filter((it) => !it.tildeling?.påVent).length;
    return <OppgaveTab tag={TabType.Mine} label="Mine saker" numberOfTasks={antallEgneOppgaver} />;
};

const VentendeSakerTab = () => {
    const antallEgneVentendeSaker = useMineOppgaver().filter((it) => it.tildeling?.påVent).length;
    return <OppgaveTab tag={TabType.Ventende} label="På vent" numberOfTasks={antallEgneVentendeSaker} />;
};

const BehandletIdagTab = () => {
    const oppgaver = useFerdigstilteOppgaver();
    return <OppgaveTab tag={TabType.BehandletIdag} label="Behandlet idag" numberOfTasks={oppgaver.length} />;
};

export const Tabs = () => {
    const toggleStatistikk = useToggleStatistikk();
    const showStatistikk = useShowStatistikk();

    return (
        <div className={styles.Tabs}>
            <span>
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
                <DataFilled width={20} height={20} />
            </RoundedButton>
        </div>
    );
};
