import React, { ReactNode } from 'react';
import '@testing-library/jest-dom/extend-expect';
import { act, renderHook } from '@testing-library/react-hooks';
import { useTildeling } from './oppgaver';
import { RecoilRoot } from 'recoil';
import { Inntektskilde, Oppgave, Periodetype } from 'internal-types';
import dayjs from 'dayjs';

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
    inntektskilde: Inntektskilde.EnArbeidsgiver,
    tildeling: undefined,
});

const mockSuccessfulFetch = () =>
    (global.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
            status: 200,
            json: () => ({ data: { oppgaver: [enOppgave()] } }),
        });
    }));

const saksbehandler = {
    oid: 'uuid',
    navn: 'enSaksbehandler',
    epost: 'saksbehandler@nav.no',
};

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

const wrapper = ({ children }: { children: ReactNode | ReactNode[] }) => <RecoilRoot>{children}</RecoilRoot>;

describe('oppgavetildeling', () => {
    describe('useTildelOppgave', () => {
        test('thrower ikke ved suksess', () => {
            mockSuccessfulFetch();
            const { result } = renderHook(() => useTildeling().tildelOppgave, { wrapper });

            act(async () => {
                expect(await result.current(enOppgave(), saksbehandler)).toHaveProperty('status', 200);
            });
        });

        test('thrower og returnerer navnet på tildelt saksbehandler ved konflikt', () => {
            mockTildelingsfeil();
            const { result } = renderHook(() => useTildeling().tildelOppgave, { wrapper });

            act(async () => {
                const errorMessage = await result.current(enOppgave(), saksbehandler).catch((err) => err);
                expect(errorMessage).toEqual('uuid');
            });
        });
    });
    describe('useFjernTildeling', () => {
        test('thrower ikke ved suksess', () => {
            mockSuccessfulFetch();
            const { result } = renderHook(() => useTildeling().fjernTildeling, { wrapper });

            act(async () => {
                expect(await result.current(enOppgave())).toHaveProperty('status', 200);
            });
        });

        test('thrower ved feil', () => {
            mockTildelingsfeil();
            const { result } = renderHook(() => useTildeling().fjernTildeling, { wrapper });

            act(() => {
                expect(async () => await result.current(enOppgave())).rejects.toBeUndefined();
            });
        });
    });
});
