import '@testing-library/jest-dom/extend-expect';
import { act, renderHook } from '@testing-library/react-hooks';
import { oppgaverState, useTildeling } from './oppgaver';
import { RecoilRoot, useRecoilValueLoadable } from 'recoil';
import { Inntektskilde, Oppgave, Periodetype, Saksbehandler } from 'internal-types';
import dayjs from 'dayjs';
import { Inntektskilde, Oppgave, Periodetype } from 'internal-types';
import React, { ReactNode } from 'react';
import { RecoilRoot } from 'recoil';

import { useTildeling } from './oppgaver';

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

const wrapper = ({ children }: { children: ReactNode | ReactNode[] }) => <RecoilRoot>{children}</RecoilRoot>;

async function settOppOppgaver() {
    const { result } = renderHook(async () => useRecoilValueLoadable(oppgaverState), { wrapper });
    await act(async () => {
        // Vent til oppgavene er hentet. Skulle jo ønske recoil ordnet dette på egen hånd...
        // eslint-disable-next-line no-empty
        while ((await result.current).state !== 'hasValue') {}
    });
}

describe('oppgavetildeling', () => {
    describe('useTildelOppgave', () => {
        test('thrower ikke ved suksess', async () => {
            mockHentOppgaver();
            await settOppOppgaver();

            mockTildelingOk();
            const { result } = renderHook(() => useTildeling().tildelOppgave, { wrapper });

            act(async () => {
                expect(await result.current(enOppgave(), saksbehandler)).toHaveProperty('status', 200);
            });
        });

        test('thrower og returnerer navnet på tildelt saksbehandler ved konflikt', async () => {
            mockHentOppgaver();
            await settOppOppgaver();
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
            mockTildelingOk();
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
