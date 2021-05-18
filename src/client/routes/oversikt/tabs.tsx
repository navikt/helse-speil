import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import { atom, useRecoilState, useRecoilValueLoadable } from 'recoil';
import { useInnloggetSaksbehandler } from '../../state/authentication';
import { oppgaverState } from '../../state/oppgaver';
import { AnonymiserData } from '../saksbilde/sakslinje/AnonymiserData';
import { Oppgave } from 'internal-types';
import { Dropdown } from '../../components/dropdown/Dropdown';
import { Normaltekst } from 'nav-frontend-typografi';
import { Flex } from '../../components/Flex';
import { PopoverOrientering } from 'nav-frontend-popover';

const Container = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
    justify-self: flex-end;
    align-self: center;
`;

export const tabState = atom<'alle' | 'mine' | 'ventende'>({
    key: 'tabState',
    default: 'alle',
});

const Tablist = styled.div`
    border-bottom: 1px solid var(--navds-color-border);
    margin-bottom: 1rem;
    display: flex;
    width: 100%;
    justify-content: space-between;
`;

const Tab = styled.button<{ active: boolean }>`
    background: none;
    border: none;
    padding: 0 0 1rem 0;
    margin: 0 1rem;
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

const Antall = ({ children }: { children: ReactNode }) => {
    return <Normaltekst style={{ marginLeft: '0.25rem' }}>{children}</Normaltekst>;
};

const AlleSakerTab = ({ antall }: { antall: number }) => {
    const [aktivTab, setAktivTab] = useRecoilState(tabState);
    return (
        <Tab
            role="tab"
            aria-selected={aktivTab === 'alle'}
            active={aktivTab === 'alle'}
            onClick={() => setAktivTab('alle')}
        >
            <Flex alignItems={'center'}>
                Til godkjenning<Antall>({antall})</Antall>
            </Flex>
        </Tab>
    );
};

const MineSakerTab = ({ antall }: { antall: number }) => {
    const [aktivTab, setAktivTab] = useRecoilState(tabState);
    return (
        <Tab
            role="tab"
            aria-selected={aktivTab === 'mine'}
            active={aktivTab === 'mine'}
            onClick={() => setAktivTab('mine')}
        >
            <Flex alignItems={'center'}>
                Mine saker<Antall>({antall})</Antall>
            </Flex>
        </Tab>
    );
};

const VentendeTab = ({ antall }: { antall: number }) => {
    const [aktivTab, setAktivTab] = useRecoilState(tabState);
    return (
        <Tab
            role="tab"
            aria-selected={aktivTab === 'ventende'}
            active={aktivTab === 'ventende'}
            onClick={() => setAktivTab('ventende')}
        >
            <Flex alignItems={'center'}>
                På vent<Antall>({antall})</Antall>
            </Flex>
        </Tab>
    );
};

export const Tabs = () => {
    const { oid } = useInnloggetSaksbehandler();
    const alleOppgaver = useRecoilValueLoadable(oppgaverState);
    const oppgaver = alleOppgaver.state === 'hasValue' ? (alleOppgaver.contents as Oppgave[]) : [];
    const mineOppgaver = oppgaver.filter(({ tildeling }) => tildeling?.saksbehandler.oid === oid);
    return (
        <Tablist>
            <div>
                <AlleSakerTab antall={oppgaver.length ?? 0} />
                <MineSakerTab antall={mineOppgaver?.filter(({ tildeling }) => !tildeling?.påVent)?.length ?? 0} />
                <VentendeTab antall={mineOppgaver?.filter(({ tildeling }) => tildeling?.påVent)?.length ?? 0} />
            </div>
            <Container>
                <Dropdown orientering={PopoverOrientering.UnderHoyre}>
                    <AnonymiserData />
                </Dropdown>
            </Container>
        </Tablist>
    );
};
