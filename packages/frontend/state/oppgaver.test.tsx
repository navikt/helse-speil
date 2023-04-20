import React from 'react';
import { RecoilRoot, useRecoilValueLoadable } from 'recoil';

import { Adressebeskyttelse, Kjonn, OppgaveForOversiktsvisning, Oppgavetype, Periodetype } from '@io/graphql';
import '@testing-library/jest-dom/extend-expect';
import { act, renderHook } from '@testing-library/react-hooks';

import { oppgaverState, useFjernTildeling, useTildelOppgave } from './oppgaver';

declare global {
    namespace NodeJS {
        interface Global {
            fetch: jest.MockedFunction<any>;
        }
    }
}

afterEach(() => {
    // @ts-ignore
    global.fetch = undefined;
});

const enOppgavereferanse = '123456';

const enOppgave = (): OppgaveForOversiktsvisning => ({
    id: enOppgavereferanse,
    type: Oppgavetype.Soknad,
    opprettet: '2020-01-01',
    vedtaksperiodeId: '234567',
    personinfo: {
        fornavn: 'Alfa',
        mellomnavn: 'Beta',
        etternavn: 'Omega',
        kjonn: Kjonn.Kvinne,
        fodselsdato: '1980-01-01',
        adressebeskyttelse: Adressebeskyttelse.Ugradert,
    },
    fodselsnummer: '12345678910',
    aktorId: '12345678910',
    antallVarsler: 0,
    periodetype: Periodetype.Forstegangsbehandling,
    boenhet: {
        id: '1234',
        navn: 'Boenhet',
    },
    flereArbeidsgivere: false,
    tildeling: undefined,
    opprinneligSoknadsdato: '2020-01-01',
});

const mockHentOppgaver = () =>
    (global.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
            status: 200,
            json: () => ({ oppgaver: [enOppgave()] }),
        });
    }));

const saksbehandler: Saksbehandler = {
    oid: 'uuid',
    navn: 'enSaksbehandler',
    epost: 'saksbehandler@nav.no',
};

const mockTildelingOk = () => (global.fetch = jest.fn().mockImplementation(() => Promise.resolve({ status: 200 })));

const mockTildelingsfeil = () =>
    (global.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
            status: 409,
            text: () =>
                JSON.stringify({
                    kontekst: {
                        tildeling: {
                            ...saksbehandler,
                            påVent: false,
                        },
                    },
                }),
        });
    }));

const wrapper: React.FC<ChildrenProps> = ({ children }) => <RecoilRoot>{children}</RecoilRoot>;

async function settOppOppgaver() {
    mockHentOppgaver();
    const { result, waitFor } = renderHook(() => useRecoilValueLoadable(oppgaverState), {
        wrapper,
    });
    await waitFor(() => {
        return result.current.state !== 'loading';
    });
}

describe('oppgavetildeling', () => {
    describe('useTildelOppgave', () => {
        test('thrower ikke ved suksess', async () => {
            await settOppOppgaver();

            mockTildelingOk();
            const { result } = renderHook(() => useTildelOppgave(), { wrapper });

            const response = await result.current(enOppgave(), saksbehandler);

            expect(response).toHaveProperty('status', 200);
        });

        test('thrower og returnerer navnet på tildelt saksbehandler ved konflikt', async () => {
            await settOppOppgaver();

            mockTildelingsfeil();
            const { result } = renderHook(() => useTildelOppgave(), { wrapper });

            await act(async () => {
                const errorMessage = await result.current(enOppgave(), saksbehandler).catch((err) => err);
                expect(errorMessage).toEqual('uuid');
            });
        });
    });
    describe('useFjernTildeling', () => {
        test('thrower ikke ved suksess', () => {
            mockTildelingOk();
            const { result } = renderHook(() => useFjernTildeling(), { wrapper });

            act(async () => {
                expect(await result.current(enOppgave().id)()).toHaveProperty('status', 200);
            });
        });

        test('thrower ved feil', () => {
            mockTildelingsfeil();
            const { result } = renderHook(() => useFjernTildeling(), { wrapper });

            act(() => {
                expect(async () => await result.current(enOppgave().id)()).rejects.toBeUndefined();
            });
        });
    });
});
