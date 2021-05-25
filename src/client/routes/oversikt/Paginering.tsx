import styled from '@emotion/styled';
import React from 'react';

import { UseTabellPaginering } from '@navikt/helse-frontend-tabell';

import { genererSidetall } from './sidetall';

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
`;

const SideknappContainer = styled.div`
    margin: 0.5rem;
    > button:not(:last-of-type) {
        margin-right: 0.5rem;
    }
`;

const Sideknapp = styled.button<{ active?: boolean }>`
    border: none;
    background: none;
    border-radius: 0.25rem;
    font-family: Source Sans Pro, sans-serif;
    font-size: 16px;
    cursor: pointer;
    outline: none;
    min-width: 2rem;

    &:focus {
        box-shadow: 0 0 0 3px var(--navds-text-focus);
    }

    &:hover && :not(:disabled) {
        color: var(--navds-color-text-inverse);
        background: var(--navds-color-action-default);
    }

    &:active {
        color: var(--navds-color-text-inverse);
        background: var(--navds-text-focus);
    }

    ${({ active }) =>
        active &&
        `
        background: var(--navds-color-action-default);
        color: var(--navds-color-text-inverse);
        `}
`;

interface PagineringProps extends UseTabellPaginering {
    antallOppgaver: number;
}

export const Paginering = ({
    antallOppgaver,
    antallSider,
    set: setPaginering,
    sidenummer,
    førsteSynligeElement,
    sisteSynligeElement,
    antallRaderPerSide,
}: PagineringProps) => {
    const inkrementerSidenummer = () =>
        setPaginering((p) => ({
            ...p,
            sidenummer: p.sidenummer + 1 > antallSider ? antallSider : p.sidenummer + 1,
        }));

    const dekrementerSidenummer = () =>
        setPaginering((p) => ({
            ...p,
            sidenummer: p.sidenummer - 1 < 1 ? 1 : p.sidenummer - 1,
        }));

    return (
        <Container>
            <SideknappContainer>
                <Sideknapp disabled={sidenummer === 1} onClick={dekrementerSidenummer}>
                    Forrige
                </Sideknapp>
                {genererSidetall(sidenummer, antallSider, 9).map((element) =>
                    isNaN(element) ? (
                        <Sideknapp key={element}>{element}</Sideknapp>
                    ) : (
                        <Sideknapp
                            onClick={() => setPaginering((p) => ({ ...p, sidenummer: element }))}
                            active={sidenummer === element}
                            key={element}
                        >
                            {element}
                        </Sideknapp>
                    )
                )}
                <Sideknapp
                    disabled={antallOppgaver <= antallRaderPerSide || sidenummer === antallSider}
                    onClick={inkrementerSidenummer}
                >
                    Neste
                </Sideknapp>
            </SideknappContainer>
            <p>
                Viser {førsteSynligeElement} til {sisteSynligeElement} av {antallOppgaver} oppgaver
            </p>
        </Container>
    );
};
