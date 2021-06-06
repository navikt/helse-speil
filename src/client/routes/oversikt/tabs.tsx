import styled from '@emotion/styled';
import React from 'react';
import { atom, useRecoilState, useRecoilValue } from 'recoil';

import { PopoverOrientering } from 'nav-frontend-popover';
import { Normaltekst } from 'nav-frontend-typografi';

import { Flex } from '../../components/Flex';
import { Dropdown } from '../../components/dropdown/Dropdown';
import { useInnloggetSaksbehandler } from '../../state/authentication';
import { useMineOppgaver, useOppgaver } from '../../state/oppgaver';

import { AnonymiserData } from '../saksbilde/sakslinje/AnonymiserData';

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
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
`;

const NoWrap = styled.span`
    white-space: nowrap;
`;

const Tab = styled.button<{ active: boolean }>`
    background: none;
    border: none;
    padding: 0 0 16px 0;
    margin: 0 16px;
    height: max-content;
    font-family: inherit;
    font-size: 1rem;
    font-weight: 600;
    color: var(--navds-color-text-primary);
    cursor: pointer;
    transition: box-shadow 0.1s ease;
    box-shadow: inset 0 0 0 0 var(--navds-color-action-default);
    outline: none;

    &:hover,
    &:focus {
        color: var(--navds-color-action-default);
    }

    ${({ active }) => active && `box-shadow: inset 0 -5px 0 0 var(--navds-color-action-default);`}
`;

const Antall = styled(Normaltekst)`
    margin-left: 0.25rem;
`;

const Meny = styled(Dropdown)`
    > button {
        height: max-content;
        padding: 2px;
        margin: 0 14px 14px;
    }
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
                <Antall>({numberOfTasks})</Antall>
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
        </NoWrap>
        <Meny orientering={PopoverOrientering.UnderHoyre}>
            <AnonymiserData />
        </Meny>
    </Tablist>
);
