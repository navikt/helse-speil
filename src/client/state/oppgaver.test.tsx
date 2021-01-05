import React, { ReactNode } from 'react';
import '@testing-library/jest-dom/extend-expect';
import { act, renderHook } from '@testing-library/react-hooks';
import { useFjernTildeling, useTildelOppgave } from './oppgaver';
import { RecoilRoot } from 'recoil';
import { Oppgave, OppgaveType } from '../../types';

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

const enOppgavereferanse = '123456';

const enOppgave = (): Oppgave => ({
    oppgavereferanse: enOppgavereferanse,
    tildeltTil: undefined,
    opprettet: '2020-01-01',
    vedtaksperiodeId: '234567',
    personinfo: {
        fornavn: 'Alfa',
        mellomnavn: 'Beta',
        etternavn: 'Omega',
        kjønn: 'Kvinne',
        fødselsdato: '1980-01-01',
    },
    fødselsnummer: '12345678910',
    aktørId: '12345678910',
    antallVarsler: 0,
    type: OppgaveType.Førstegangsbehandling,
    boenhet: {
        id: '1234',
        navn: 'Boenhet',
    },
});

const mockSuccessfulFetch = () =>
    (global.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
            status: 200,
            json: () => ({ data: { oppgaver: [enOppgave()] } }),
        });
    }));

const mockTildelingsfeil = () =>
    (global.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
            status: 409,
            text: () => '{ "kontekst": { "tildeltTil": "enSaksbehandler" } }',
        });
    }));

const wrapper = ({ children }: { children: ReactNode | ReactNode[] }) => <RecoilRoot>{children}</RecoilRoot>;

describe('oppgavetildeling', () => {
    describe('useTildelOppgave', () => {
        test('thrower ikke ved suksess', () => {
            mockSuccessfulFetch();
            const { result } = renderHook(() => useTildelOppgave(), { wrapper });

            act(async () => {
                expect(await result.current(enOppgave(), 'enEpost')).toHaveProperty('status', 200);
            });
        });

        test('thrower og returnerer navnet på tildelt saksbehandler ved konflikt', async () => {
            mockTildelingsfeil();
            const { result } = renderHook(() => useTildelOppgave(), { wrapper });

            act(async () => {
                const errorMessage = await result.current(enOppgave(), 'enEpost').catch((err) => err);
                expect(errorMessage).toEqual('enSaksbehandler');
            });
        });
    });
    describe('useFjernTildeling', () => {
        test('thrower ikke ved suksess', () => {
            mockSuccessfulFetch();
            const { result } = renderHook(() => useFjernTildeling(), { wrapper });

            act(async () => {
                expect(await result.current(enOppgave())).toHaveProperty('status', 200);
            });
        });

        test('thrower ved feil', async () => {
            mockTildelingsfeil();
            const { result } = renderHook(() => useFjernTildeling(), { wrapper });

            act(() => {
                expect(async () => await result.current(enOppgave())).rejects.toBeUndefined();
            });
        });
    });
});
