import React from 'react';
import userEvent from '@testing-library/user-event';
import { act, render, screen, waitFor } from '@testing-library/react';
import { varslerForScope } from '../state/varslerState';
import { useOppgavetildeling } from './useOppgavetildeling';
import { RecoilRoot, useRecoilValue } from 'recoil';
import '@testing-library/jest-dom/extend-expect';

declare global {
    namespace NodeJS {
        interface Global {
            fetch: jest.MockedFunction<any>;
        }
    }
}

afterEach(() => {
    global.fetch = undefined;
});

describe('oppgavetildeling', () => {
    describe('tildelOppgave', () => {
        test('viser ikke varsel dersom tildelingen var vellykket', async () => {
            render(
                <RecoilRoot>
                    <UseOppgavetildelingContainer />
                </RecoilRoot>
            );
            await act(() => mockFetchSuccess().then(tildel).then(assertIngenVarsler));
        });
        test('returnerer feilkode og navnet på saksbehandler som har tildelingen om konflikt', async () => {
            render(
                <RecoilRoot>
                    <UseOppgavetildelingContainer />
                </RecoilRoot>
            );
            await act(() => mockFetchTildelingfeil().then(tildel).then(assertTildelingsvarselErSynlig));
        });
    });

    describe('fjernTildeling', () => {
        test('viser ikke varsel dersom fjerning av tildeling var vellykket', async () => {
            render(
                <RecoilRoot>
                    <UseOppgavetildelingContainer />
                </RecoilRoot>
            );
            await act(() => mockFetchSuccess().then(fjernTildeling).then(assertIngenVarsler));
        });
        test('viser varsel dersom fjerning av tildeling ikke var vellykket', async () => {
            render(
                <RecoilRoot>
                    <UseOppgavetildelingContainer />
                </RecoilRoot>
            );
            await act(() => mockFetchFail().then(fjernTildeling).then(assertFjernTildelingsvarselErSynlig));
        });
    });
});

const mockFetchTildelingfeil = async () => {
    global.fetch = jest.fn().mockReturnValue(
        Promise.resolve({
            status: 409,
            text: () =>
                Promise.resolve(
                    JSON.stringify({
                        feilkode: 'oppgave_er_allerede_tildelt',
                        kontekst: {
                            tildeltTil: 'Sara Saksbehandler',
                        },
                        kildesystem: 'spesialist',
                    })
                ),
        })
    );
};

const mockFetchFail = async () => (global.fetch = jest.fn().mockReturnValue(Promise.resolve({ status: 500 })));

const mockFetchSuccess = async () => (global.fetch = jest.fn().mockReturnValue(Promise.resolve({ status: 204 })));

const tildel = async () => userEvent.click(screen.getByTestId('tildel'));

const fjernTildeling = async () => userEvent.click(screen.getByTestId('fjern'));

const assertIngenVarsler = () => waitFor(() => expect(screen.queryByTestId('varsel')).toBeNull());

const assertVarselMedTekst = async (varseltekst: string) =>
    await waitFor(() => {
        const varselElement = screen.getByTestId('varsel');
        expect(varselElement).toBeVisible();
        expect(varselElement).toHaveTextContent(varseltekst);
    });

const assertTildelingsvarselErSynlig = () => assertVarselMedTekst('Sara Saksbehandler har allerede tatt saken.');

const assertFjernTildelingsvarselErSynlig = () => assertVarselMedTekst('Kunne ikke fjerne tildeling av sak.');

const UseOppgavetildelingContainer = () => {
    const { tildelOppgave, fjernTildeling } = useOppgavetildeling();
    const varsler = useRecoilValue(varslerForScope);
    return (
        <>
            <button data-testid="tildel" onClick={() => tildelOppgave('', '').catch(() => null)}>
                Tildel oppgave
            </button>
            <button data-testid="fjern" onClick={() => fjernTildeling('').catch(() => null)}>
                Fjern tildeling
            </button>
            {varsler.map((varsel) => (
                <div data-testid="varsel" key={varsel.message}>
                    {varsel.message}
                </div>
            ))}
        </>
    );
};
