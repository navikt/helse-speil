import React from 'react';
import styled from '@emotion/styled';
import { atom, useRecoilState, useRecoilValueLoadable } from 'recoil';
import { Oppgave } from '../../../types';
import { useEmail } from '../../state/authentication';
import { oppgaverState } from '../../state/oppgaver';
import { Dropdownknapp } from '../saksbilde/sakslinje/Verktøylinje';
import { AnonymiserData } from '../saksbilde/sakslinje/AnonymiserData';

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
    margin-bottom: 2rem;
    display: flex;
    width: 100%;
    justify-content: space-between;
`;

const Tab = styled.button<{ active: boolean }>`
    background: none;
    border: none;
    padding: 1rem 1.5rem;
    font-family: inherit;
    font-size: 1.25rem;
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

const AlleSakerTab = () => {
    const [aktivTab, setAktivTab] = useRecoilState(tabState);
    return (
        <Tab
            role="tab"
            aria-selected={aktivTab === 'alle'}
            active={aktivTab === 'alle'}
            onClick={() => setAktivTab('alle')}
        >
            Saker
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
            Mine saker ({antall})
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
            På vent ({antall})
        </Tab>
    );
};

export const Tabs = () => {
    const email = useEmail();
    const alleOppgaver = useRecoilValueLoadable(oppgaverState);
    const oppgaver = alleOppgaver.state === 'hasValue' ? (alleOppgaver.contents as Oppgave[]) : [];
    return (
        <Tablist>
            <div>
                <AlleSakerTab />
                <MineSakerTab
                    antall={
                        oppgaver?.filter(({ tildeltTil, erPåVent }) => tildeltTil === email && !erPåVent)?.length ?? 0
                    }
                />
                <VentendeTab
                    antall={
                        oppgaver?.filter(({ tildeltTil, erPåVent }) => tildeltTil === email && erPåVent)?.length ?? 0
                    }
                />
            </div>
            <Container>
                <Dropdownknapp tittel={'Meny'} venstrestilt={true}>
                    <AnonymiserData />
                </Dropdownknapp>
            </Container>
        </Tablist>
    );
};
