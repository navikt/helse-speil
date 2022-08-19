import React from 'react';
import classNames from 'classnames';
import { atom, AtomEffect, useRecoilState, useRecoilValue } from 'recoil';
import { BodyShort } from '@navikt/ds-react';
import { Data } from '@navikt/ds-icons';

import { Dropdown } from '@components/dropdown';
import { RoundedButton } from '@components/RoundedButton';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useMineOppgaver, useOppgaver } from '@state/oppgaver';

import { AnonymiserDataDropdownMenuButton } from '../saksbilde/sakslinje/dropdown/AnonymiserDataDropdownMenuButton';
import { useToggleStatistikk } from './behandlingsstatistikk/state';

import styles from './Tabs.module.css';

export enum TabType {
    TilGodkjenning = 'alle',
    Mine = 'mine',
    Ventende = 'ventende',
}

const syncLastActiveTabEffect: AtomEffect<TabType> = ({ onSet, setSelf }) => {
    const key = 'sistBesøkteTab';
    const savedTab = sessionStorage.getItem(key) as TabType | null;
    if (savedTab) {
        setSelf(savedTab);
    }
    onSet((newValue) => {
        sessionStorage.setItem(key, newValue);
    });
};

export const tabState = atom<TabType>({
    key: 'tabState',
    default: TabType.TilGodkjenning,
    effects: [syncLastActiveTabEffect],
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

export const Tabs = () => {
    const toggleStatistikk = useToggleStatistikk();

    return (
        <div className={styles.Tabs}>
            <span>
                <AlleSakerTab />
                <MineSakerTab />
                <VentendeSakerTab />
                <Dropdown className={styles.Meny} title="Meny">
                    <AnonymiserDataDropdownMenuButton />
                </Dropdown>
            </span>
            <RoundedButton
                className={styles.Button}
                aria-label="Toggle visning av behandlingsstatistikk"
                onClick={toggleStatistikk}
            >
                <Data />
            </RoundedButton>
        </div>
    );
};
