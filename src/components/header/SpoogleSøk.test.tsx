import { fetchMock, jsonResponse, mockFetchResponse } from '../../../vitest.setup';
import mockRouter from 'next-router-mock';
import React from 'react';
import { Mock } from 'vitest';

import { Varsler } from '@components/Varsler';
import { useFetchPersonQuery } from '@state/person';
import { render, screen } from '@test-utils';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SpoogleSøk } from './SpoogleSøk';

vi.mock('@state/person');

beforeEach(() => {
    (useFetchPersonQuery as Mock).mockReturnValue({});
});

const vedtaksperiodeId = 'b5b7a8e4-1c55-4c4a-9d6e-3c1f0b7a2a11';
const fødselsnummer = '01019010046';
const aktørId = '1234567891000';

function spoogleSvar(fnr: string) {
    return new Response(
        JSON.stringify({
            tree: { id: fnr, type: 'FØDSELSNUMMER', children: [], ugyldig_fra: null },
            path: [fnr, vedtaksperiodeId],
        }),
        { status: 200, headers: { 'Content-Type': 'text/plain; charset=UTF-8' } },
    );
}

async function søk(søketekst: string) {
    await userEvent.type(screen.getByRole('searchbox', { name: 'Søk' }), søketekst);
    await userEvent.click(screen.getByRole('button', { name: 'Søk' }));
}

function renderMedVarsler() {
    render(
        <div>
            <Varsler />
            <SpoogleSøk />
        </div>,
    );
}

describe('SpoogleSøk', () => {
    it('har placeholder "Søk"', () => {
        render(<SpoogleSøk />);
        expect(screen.getByRole('searchbox', { name: 'Søk' })).toHaveAttribute('placeholder', 'Søk');
    });

    it('finner fødselsnummer via spoogle og åpner personen', async () => {
        fetchMock.mockImplementation((input) =>
            Promise.resolve(
                String(input).startsWith('/api/spoogle/')
                    ? spoogleSvar(fødselsnummer)
                    : jsonResponse({ personPseudoId: 'en random uuid' }),
            ),
        );

        render(<SpoogleSøk />);
        await søk(vedtaksperiodeId);

        await waitFor(() => {
            expect(mockRouter.pathname).toEqual('/person/[personPseudoId]');
        });
        expect(String(fetchMock.mock.calls[0]![0])).toEqual(`/api/spoogle/sok/${vedtaksperiodeId}`);
        expect(JSON.parse(String(fetchMock.mock.calls[1]![1]!.body))).toEqual({ identitetsnummer: fødselsnummer });
    });

    it('søker direkte på fødselsnummer uten å kalle spoogle', async () => {
        mockFetchResponse({ personPseudoId: 'en random uuid' });

        render(<SpoogleSøk />);
        await søk(fødselsnummer);

        await waitFor(() => {
            expect(mockRouter.pathname).toEqual('/person/[personPseudoId]');
        });
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(String(fetchMock.mock.calls[0]![0])).not.toContain('/api/spoogle/');
        expect(JSON.parse(String(fetchMock.mock.calls[0]![1]!.body))).toEqual({ identitetsnummer: fødselsnummer });
    });

    it('søker direkte på aktørId uten å kalle spoogle', async () => {
        mockFetchResponse({ personPseudoId: 'en random uuid' });

        render(<SpoogleSøk />);
        await søk(aktørId);

        await waitFor(() => {
            expect(mockRouter.pathname).toEqual('/person/[personPseudoId]');
        });
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(JSON.parse(String(fetchMock.mock.calls[0]![1]!.body))).toEqual({ aktørId });
    });

    it('åpner UUID som personPseudoId når den ikke finnes i spoogle', async () => {
        const personPseudoId = 'c2f1e0d4-7a3b-4e5f-9a1b-2c3d4e5f6a7b';
        mockFetchResponse(undefined, 404);

        render(<SpoogleSøk />);
        await søk(personPseudoId);

        await waitFor(() => {
            expect(mockRouter.asPath).toEqual(`/person/${personPseudoId}`);
        });
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(String(fetchMock.mock.calls[0]![0])).toEqual(`/api/spoogle/sok/${personPseudoId}`);
    });

    it('viser varsel ved ugyldig fødselsnummer uten å kalle backend', async () => {
        renderMedVarsler();
        await søk('12345678910');

        expect(await screen.findByText('"12345678910" er ikke et gyldig fødselsnummer.')).toBeInTheDocument();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('viser varsel ved ugyldig identifikator uten å kalle backend', async () => {
        renderMedVarsler();
        await søk('ikke-en-id');

        expect(await screen.findByText('"ikke-en-id" er ikke en gyldig identifikator for søk')).toBeInTheDocument();
        expect(fetchMock).not.toHaveBeenCalled();
    });
});
