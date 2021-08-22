import '@testing-library/jest-dom/extend-expect';
import { act, renderHook } from '@testing-library/react-hooks';
import dayjs from 'dayjs';
import { InntektskildeType, Oppgave, Periodetype, Saksbehandler } from 'internal-types';
import React from 'react';
import { Loadable, RecoilRoot, useRecoilValueLoadable } from 'recoil';

import { oppgaverState, useFjernTildeling, useTildelOppgave } from './oppgaver';

declare global {
    namespace NodeJS {
        // noinspection JSUnusedGlobalSymbols
        interface Global {
            fetch: jest.MockedFunction<any>;
        }
    }
}

afterEach(() => {
    global.fetch = undefined;
});

const enOppgavereferanse = '123456';

const enOppgave = (): Oppgave => ({
    oppgavereferanse: enOppgavereferanse,
    opprettet: '2020-01-01',
    vedtaksperiodeId: '234567',
    personinfo: {
        fornavn: 'Alfa',
        mellomnavn: 'Beta',
        etternavn: 'Omega',
        kjønn: 'kvinne',
        fødselsdato: dayjs('1980-01-01'),
    },
    fødselsnummer: '12345678910',
    aktørId: '12345678910',
    antallVarsler: 0,
    periodetype: Periodetype.Førstegangsbehandling,
    boenhet: {
        id: '1234',
        navn: 'Boenhet',
    },
    inntektskilde: InntektskildeType.EnArbeidsgiver,
    tildeling: undefined,
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

const wrapper: React.FC = ({ children }) => <RecoilRoot>{children}</RecoilRoot>;

async function settOppOppgaver() {
    mockHentOppgaver();
    const { result, waitFor } = renderHook<React.FC, Loadable<Oppgave[]>>(() => useRecoilValueLoadable(oppgaverState), {
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
                expect(await result.current(enOppgave())).toHaveProperty('status', 200);
            });
        });

        test('thrower ved feil', () => {
            mockTildelingsfeil();
            const { result } = renderHook(() => useFjernTildeling(), { wrapper });

            act(() => {
                expect(async () => await result.current(enOppgave())).rejects.toBeUndefined();
            });
        });
    });
});
