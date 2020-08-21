import React, { useContext, useEffect } from 'react';
import Varsel, { Varseltype } from '@navikt/helse-frontend-varsel';
import styled from '@emotion/styled';
import Panel from 'nav-frontend-paneler';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { useLocation } from 'react-router-dom';
import { PersonContext } from '../../context/PersonContext';
import { OppgaverContext } from '../../context/OppgaverContext';
import { Scopes, useVarselFilter } from '../../state/varslerState';
import { VedtaksstatusToast } from './VedtaksstatusToast';
import { OppgaverTabell } from './OppgaverTabell';
import { useEmail } from '../../state/authentication';
import { Oppgave } from '../../../types';
import { atom, useRecoilState } from 'recoil';

const Container = styled(Panel)`
    margin: 1rem;
    padding: 1rem;
    color: #3e3832;
`;

const LasterInnhold = styled.div`
    display: flex;
    align-items: center;
    margin-left: 1rem;
    margin-top: 1rem;
    svg {
        margin-right: 1rem;
        width: 25px;
        height: 25px;
    }
`;

const Tablist = styled.div`
    border-bottom: 1px solid #c6c2bf;
    margin-bottom: 2rem;
`;

const Tab = styled.button<{ active: boolean }>`
    background: none;
    border: none;
    padding: 1rem 1.5rem;
    font-family: inherit;
    font-size: 1.25rem;
    font-weight: 600;
    color: #3e3832;
    cursor: pointer;
    transition: box-shadow 0.1s ease;
    box-shadow: inset 0 0 0 0 #0067c5;
    outline: none;

    &:hover,
    &:focus {
        color: #0067c5;
    }

    ${({ active }) => active && `box-shadow: inset 0 -5px 0 0 #0067c5;`}
`;

const faneState = atom<'alle' | 'mine'>({
    key: 'faneState',
    default: 'alle',
});

export const Oversikt = () => {
    const email = useEmail();
    const location = useLocation();
    const { isFetching: isFetchingPersonBySearch } = useContext(PersonContext);
    const { oppgaver, hentOppgaver, isFetchingOppgaver, error: oppgaverContextError } = useContext(OppgaverContext);
    const [aktivFane, setAktivFane] = useRecoilState(faneState);

    const erTildeltInnloggetBruker = (oppgave: Oppgave) => email === oppgave.tildeltTil;

    useVarselFilter(Scopes.OVERSIKT);

    useEffect(() => {
        hentOppgaver();
    }, [location.key]);

    return (
        <>
            {isFetchingOppgaver && (
                <LasterInnhold>
                    <NavFrontendSpinner type="XS" />
                    Henter personer
                </LasterInnhold>
            )}
            {isFetchingPersonBySearch && (
                <LasterInnhold>
                    <NavFrontendSpinner type="XS" />
                    Henter person
                </LasterInnhold>
            )}
            {oppgaverContextError && <Varsel type={Varseltype.Feil}>{oppgaverContextError.message}</Varsel>}
            <Container>
                <Tablist>
                    <Tab
                        role="tab"
                        aria-selected={aktivFane === 'alle'}
                        active={aktivFane === 'alle'}
                        onClick={() => setAktivFane('alle')}
                    >
                        Saker
                    </Tab>
                    <Tab
                        role="tab"
                        aria-selected={aktivFane === 'mine'}
                        active={aktivFane === 'mine'}
                        onClick={() => setAktivFane('mine')}
                    >
                        Mine saker
                    </Tab>
                </Tablist>
                <OppgaverTabell
                    oppgaver={aktivFane === 'alle' ? oppgaver : oppgaver.filter(erTildeltInnloggetBruker)}
                />
            </Container>
            <VedtaksstatusToast />
        </>
    );
};
