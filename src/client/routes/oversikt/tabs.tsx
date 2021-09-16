import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import { atom, useRecoilState, useRecoilValue } from 'recoil';

import { BodyShort } from '@navikt/ds-react';

import { Flex } from '../../components/Flex';
import { Dropdown } from '../../components/dropdown/Dropdown';
import { useInnloggetSaksbehandler } from '../../state/authentication';
import { useMineOppgaver, useOppgaver } from '../../state/oppgaver';

import { AnonymiserData } from '../saksbilde/sakslinje/AnonymiserData';
import { StatistikkButton } from './behandlingsstatistikk/StatistikkButton';

export enum TabType {
    TilGodkjenning = 'alle',
    Mine = 'mine',
    Ventende = 'ventende',
}

export const tabState = atom<TabType>({
    key: 'tabState',
    default: TabType.TilGodkjenning,
});

export const useAktivTab = () => useRecoilValue(tabState);

const Tablist = styled.div`
    border-bottom: 1px solid var(--navds-color-border);
    margin: 1rem 1.5rem 0;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
`;

const NoWrap = styled.span`
    white-space: nowrap;
    display: flex;
    flex-wrap: nowrap;
`;

const Tab = styled.button<{ active: boolean }>`
    position: relative;
    background: none;
    border: none;
    padding: 0 1rem 1rem;
    margin: 0;
    height: max-content;
    font-family: inherit;
    font-size: 1rem;
    font-weight: 600;
    color: var(--navds-color-text-primary);
    cursor: pointer;
    outline: none;

    &:before {
        content: '';
        position: absolute;
        width: 100%;
        height: 0;
        left: 0;
        bottom: 0;
        background-color: var(--navds-color-action-default);
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
        transition: height 0.1s ease;
    }

    &:hover,
    &:focus {
        color: var(--navds-color-action-default);
    }

    ${({ active }) =>
        active &&
        css`
            &:before {
                height: 4px;
            }
        `}
`;

const Antall = styled(BodyShort)`
    margin-left: 0.25rem;
`;

const Meny = styled(Dropdown)`
    height: max-content;
    padding: 4px 8px;
    margin: 0 6px 10px;
`;

interface TabProps {
    tag: TabType;
    label: string;
    numberOfTasks: number;
}

const OppgaveTab = ({ tag, label, numberOfTasks }: TabProps) => {
    const [aktivTab, setAktivTab] = useRecoilState(tabState);
    return (
        <Tab role="tab" aria-selected={aktivTab === tag} active={aktivTab === tag} onClick={() => setAktivTab(tag)}>
            <Flex alignItems="center">
                {label}
                <Antall component="p">({numberOfTasks})</Antall>
            </Flex>
        </Tab>
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

export const Tabs = () => (
    <Tablist>
        <NoWrap>
            <AlleSakerTab />
            <MineSakerTab />
            <VentendeSakerTab />
            <Meny>
                <AnonymiserData />
            </Meny>
        </NoWrap>
        <StatistikkButton />
    </Tablist>
);
