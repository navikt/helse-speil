import { fetchMock, jsonResponse, mockFetchResponse } from '../../../vitest.setup';
import mockRouter from 'next-router-mock';
import React from 'react';
import { Mock } from 'vitest';

import { Varsler } from '@components/Varsler';
import { useFetchPersonQuery } from '@state/person';
import { render, screen } from '@test-utils';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { VedtaksperiodeSøk } from './VedtaksperiodeSøk';

vi.mock('@state/person');

beforeEach(() => {
    (useFetchPersonQuery as Mock).mockReturnValue({});
});

const vedtaksperiodeId = 'b5b7a8e4-1c55-4c4a-9d6e-3c1f0b7a2a11';
const fødselsnummer = '12345678910';

const spoogleSvar = (fnr: string) =>
    new Response(
        JSON.stringify({
            tree: { id: fnr, type: 'FØDSELSNUMMER', children: [], ugyldig_fra: null },
            path: [fnr, vedtaksperiodeId],
        }),
        { status: 200, headers: { 'Content-Type': 'text/plain; charset=UTF-8' } },
    );

const søk = async (søketekst: string) => {
    await userEvent.type(screen.getByRole('searchbox', { name: 'Søk på vedtaksperiode-ID' }), søketekst);
    await userEvent.click(screen.getByRole('button', { name: 'Søk' }));
};

describe('VedtaksperiodeSøk', () => {
    it('finner fødselsnummer via spoogle og åpner personen', async () => {
        fetchMock.mockImplementation((input) =>
            Promise.resolve(
                String(input).startsWith('/api/spoogle/')
                    ? spoogleSvar(fødselsnummer)
                    : jsonResponse({ personPseudoId: 'en random uuid' }),
            ),
        );

        render(<VedtaksperiodeSøk />);
        await søk(vedtaksperiodeId);

        await waitFor(() => {
            expect(mockRouter.pathname).toEqual('/person/[personPseudoId]');
        });
        expect(String(fetchMock.mock.calls[0]![0])).toEqual(`/api/spoogle/sok/${vedtaksperiodeId}`);
        expect(JSON.parse(String(fetchMock.mock.calls[1]![1]!.body))).toEqual({ identitetsnummer: fødselsnummer });
    });

    it('viser varsel når vedtaksperioden ikke finnes i spoogle', async () => {
        mockFetchResponse(undefined, 404);

        render(
            <div>
                <Varsler />
                <VedtaksperiodeSøk />
            </div>,
        );
        await søk(vedtaksperiodeId);

        expect(await screen.findByText(`Fant ikke vedtaksperiode "${vedtaksperiodeId}" i Spoogle`)).toBeInTheDocument();
    });

    it('viser varsel ved ugyldig vedtaksperiode-ID uten å kalle spoogle', async () => {
        render(
            <div>
                <Varsler />
                <VedtaksperiodeSøk />
            </div>,
        );
        await søk('ikke-en-uuid');

        expect(await screen.findByText('"ikke-en-uuid" er ikke en gyldig identifikator for søk')).toBeInTheDocument();
        expect(fetchMock).not.toHaveBeenCalled();
    });
});
