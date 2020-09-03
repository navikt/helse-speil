import React from 'react';
import { UseTabellPaginering } from '@navikt/helse-frontend-tabell/lib/useTabell';
import styled from '@emotion/styled';
import { genererSidetall } from './sidetall';

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1rem;
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
        box-shadow: 0 0 0 3px #254b6d;
    }

    &:hover {
        color: #fff;
        background: #0067c5;
    }

    &:active {
        color: #fff;
        background: #254b6d;
    }

    ${({ active }) =>
        active &&
        `
        background: #0067c5;
        color: #fff;
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
            <p>
                Viser {førsteSynligeElement} til {sisteSynligeElement} av {antallOppgaver} oppgaver
            </p>
            <SideknappContainer>
                <Sideknapp onClick={dekrementerSidenummer}>Forrige</Sideknapp>
                {genererSidetall(sidenummer, antallSider, 9).map((element) =>
                    isNaN(element) ? (
                        <Sideknapp>{element}</Sideknapp>
                    ) : (
                        <Sideknapp
                            onClick={() => setPaginering((p) => ({ ...p, sidenummer: element }))}
                            active={sidenummer === element}
                        >
                            {element}
                        </Sideknapp>
                    )
                )}
                <Sideknapp onClick={inkrementerSidenummer}>Neste</Sideknapp>
            </SideknappContainer>
        </Container>
    );
};
