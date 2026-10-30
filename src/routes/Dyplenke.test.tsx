import { fetchMock, jsonResponse, mockFetchResponse } from '../../vitest.setup';
import mockRouter from 'next-router-mock';
import React from 'react';

import { render, screen } from '@test-utils';
import { waitFor } from '@testing-library/react';

import { Dyplenke } from './Dyplenke';

const fødselsnummer = '12345678910';
const organisasjonsnummer = '987654321';
const vedtaksperiodeId = 'b5b7a8e4-1c55-4c4a-9d6e-3c1f0b7a2a11';
const behandlingId = 'd1e2f3a4-5b6c-4d7e-8f90-a1b2c3d4e5f6';

const node = (id: string, type: string, children: unknown[] = []) => ({ id, type, children, ugyldig_fra: null });

function spoogleSvar(path: string[]) {
    const tree = node(fødselsnummer, 'FØDSELSNUMMER', [
        node(organisasjonsnummer, 'ORGANISASJONSNUMMER', [
            node(vedtaksperiodeId, 'VEDTAKSPERIODE_ID', [node(behandlingId, 'BEHANDLING_ID')]),
        ]),
    ]);
    return new Response(JSON.stringify({ tree, path }), {
        status: 200,
        headers: { 'Content-Type': 'text/plain; charset=UTF-8' },
    });
}

function mockSpoogleOgPersonsøk(path: string[]) {
    fetchMock.mockImplementation((input) =>
        Promise.resolve(
            String(input).startsWith('/api/spoogle/')
                ? spoogleSvar(path)
                : jsonResponse({ personPseudoId: 'pseudo-id' }),
        ),
    );
}

const stiTilVedtaksperiode = [fødselsnummer, organisasjonsnummer, vedtaksperiodeId];

beforeEach(() => {
    mockRouter.setCurrentUrl('/vedtaksperiode/x');
});

describe('Dyplenke', () => {
    it('sender videre til vedtaksperioden', async () => {
        mockSpoogleOgPersonsøk(stiTilVedtaksperiode);

        render(<Dyplenke id={vedtaksperiodeId} />);

        await waitFor(() => {
            expect(mockRouter.asPath).toEqual(`/person/pseudo-id/periode/${vedtaksperiodeId}`);
        });
        expect(String(fetchMock.mock.calls[0]![0])).toEqual(`/api/spoogle/sok/${vedtaksperiodeId}`);
        expect(JSON.parse(String(fetchMock.mock.calls[1]![1]!.body))).toEqual({ identitetsnummer: fødselsnummer });
    });

    it('sender videre til behandlingen', async () => {
        mockSpoogleOgPersonsøk([...stiTilVedtaksperiode, behandlingId]);

        render(<Dyplenke id={behandlingId} />);

        await waitFor(() => {
            expect(mockRouter.asPath).toEqual(
                `/person/pseudo-id/periode/${vedtaksperiodeId}/behandling/${behandlingId}`,
            );
        });
    });

    it('viser 404-siden når spoogle ikke kjenner ID-en', async () => {
        mockFetchResponse(undefined, 404);

        render(<Dyplenke id={vedtaksperiodeId} />);

        expect(await screen.findByText('Feilkode: 404')).toBeInTheDocument();
        expect(mockRouter.asPath).toEqual('/vedtaksperiode/x');
    });

    it('viser feilmelding ved serverfeil', async () => {
        mockFetchResponse(undefined, 500);

        render(<Dyplenke id={vedtaksperiodeId} />);

        expect(
            await screen.findByText(`Kunne ikke slå opp ${vedtaksperiodeId}. Prøv igjen senere.`),
        ).toBeInTheDocument();
    });
});
