import React from 'react';
import { RecoilRoot, useRecoilValueLoadable } from 'recoil';

import {
    Adressebeskyttelse,
    Kjonn,
    OppgaveForOversiktsvisning,
    Oppgavetype,
    Periodetype,
    Tildeling,
} from '@io/graphql';
import { fjernTildeling, opprettTildeling } from '@io/graphql/tildeling/endreTildeling';
import { useFjernTildeling, useOpprettTildeling } from '@state/tildeling';
import '@testing-library/jest-dom/extend-expect';
import { act, renderHook } from '@testing-library/react-hooks';

import { oppgaverState } from './oppgaver';

import clearAllMocks = jest.clearAllMocks;

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
    navn: {
        fornavn: 'Alfa',
        mellomnavn: 'Beta',
        etternavn: 'Omega',
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

jest.mock('@io/graphql/tildeling/endreTildeling');

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

type TildelingResponse = {
    opprettTildeling: Tildeling;
};

const promiseTildeling = (error: string | undefined = undefined) =>
    new Promise<TildelingResponse>((resolve, reject) => {
        error
            ? reject({
                  response: {
                      errors: [
                          {
                              message: error,
                              extensions: { code: { value: 500 } },
                              tildeling: {},
                          },
                      ],
                  },
              })
            : resolve({
                  opprettTildeling: {
                      __typename: 'Tildeling',
                      oid: 'oid',
                      epost: 'epost',
                      navn: 'navn',
                      reservert: false,
                  },
              });
    });

const promiseFjernTildeling = (error: string | undefined = undefined) =>
    new Promise<boolean>((resolve, reject) => {
        error ? reject(error) : resolve(true);
    });

describe('oppgavetildeling', () => {
    afterEach(() => {
        clearAllMocks();
    });
    describe('useOpprettTildeling', () => {
        test('thrower ikke ved suksess', async () => {
            await settOppOppgaver();

            (opprettTildeling as jest.Mock).mockReturnValue(promiseTildeling());
            const { result } = renderHook(() => useOpprettTildeling(), { wrapper });

            const response = await result.current(enOppgave().id);

            expect(response.navn).toEqual('navn');
        });

        test('thrower ved feil', async () => {
            await settOppOppgaver();
            (opprettTildeling as jest.Mock).mockReturnValue(promiseTildeling('Detta gikk dårlig'));
            const { result } = renderHook(() => useOpprettTildeling(), { wrapper });

            await act(async () => {
                const errorMessage = await result.current(enOppgave().id).catch((err) => err);
                expect(errorMessage).toEqual('Kunne ikke tildele sak.');
            });
        });
    });
    describe('useFjernTildeling', () => {
        test('thrower ikke ved suksess', async () => {
            (fjernTildeling as jest.Mock).mockReturnValue(promiseFjernTildeling());
            const { result } = renderHook(() => useFjernTildeling(), { wrapper });

            const response = await result.current(enOppgave().id);

            expect(response).toBe(true);
        });

        test('thrower ved feil', async () => {
            (fjernTildeling as jest.Mock).mockReturnValue(promiseFjernTildeling('error'));
            const { result } = renderHook(() => useFjernTildeling(), { wrapper });

            await act(async () => {
                const errorMessage = await result.current(enOppgave().id).catch((err) => err);
                expect(errorMessage).toEqual('Kunne ikke fjerne tildeling av sak.');
            });
        });
    });
});
