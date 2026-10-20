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
    mockRouter.setCurrentUrl('/');
    (useFetchPersonQuery as Mock).mockReturnValue({});
});

const vedtaksperiodeId = 'b5b7a8e4-1c55-4c4a-9d6e-3c1f0b7a2a11';
const fødselsnummer = '01019010046';
const aktørId = '1234567891000';

const organisasjonsnummer = '987654321';
const behandlingId = 'd1e2f3a4-5b6c-4d7e-8f90-a1b2c3d4e5f6';
const utbetalingId = '6f1c2d3e-4a5b-4c6d-8e7f-9a0b1c2d3e4f';
const søknadId = 'aa11bb22-cc33-4d44-8e55-ff6677889900';

const node = (id: string, type: string, children: unknown[] = []) => ({ id, type, children, ugyldig_fra: null });

function spoogleSvar(fnr: string, path: string[] = [fnr]) {
    const tree = node(fnr, 'FØDSELSNUMMER', [
        node(organisasjonsnummer, 'ORGANISASJONSNUMMER', [
            node(vedtaksperiodeId, 'VEDTAKSPERIODE_ID', [
                node(søknadId, 'SØKNAD_ID'),
                node(behandlingId, 'BEHANDLING_ID', [node(utbetalingId, 'UTBETALING_ID')]),
            ]),
        ]),
    ]);
    return new Response(JSON.stringify({ tree, path }), {
        status: 200,
        headers: { 'Content-Type': 'text/plain; charset=UTF-8' },
    });
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

    function mockSpoogleOgPersonsøk(path: string[]) {
        fetchMock.mockImplementation((input) =>
            Promise.resolve(
                String(input).startsWith('/api/spoogle/')
                    ? spoogleSvar(fødselsnummer, path)
                    : jsonResponse({ personPseudoId: 'pseudo-id' }),
            ),
        );
    }

    const stiTilVedtaksperiode = [fødselsnummer, organisasjonsnummer, vedtaksperiodeId];

    it('finner fødselsnummer via spoogle og åpner vedtaksperioden', async () => {
        mockSpoogleOgPersonsøk(stiTilVedtaksperiode);

        render(<SpoogleSøk />);
        await søk(vedtaksperiodeId);

        await waitFor(() => {
            expect(mockRouter.asPath).toEqual(`/person/pseudo-id/periode/${vedtaksperiodeId}`);
        });
        expect(String(fetchMock.mock.calls[0]![0])).toEqual(`/api/spoogle/sok/${vedtaksperiodeId}`);
        expect(JSON.parse(String(fetchMock.mock.calls[1]![1]!.body))).toEqual({ identitetsnummer: fødselsnummer });
    });

    it('åpner riktig behandling ved søk på behandlingId', async () => {
        mockSpoogleOgPersonsøk([...stiTilVedtaksperiode, behandlingId]);

        render(<SpoogleSøk />);
        await søk(behandlingId);

        await waitFor(() => {
            expect(mockRouter.asPath).toEqual(
                `/person/pseudo-id/periode/${vedtaksperiodeId}/behandling/${behandlingId}`,
            );
        });
    });

    it('åpner behandlingen til en utbetaling', async () => {
        mockSpoogleOgPersonsøk([...stiTilVedtaksperiode, behandlingId, utbetalingId]);

        render(<SpoogleSøk />);
        await søk(utbetalingId);

        await waitFor(() => {
            expect(mockRouter.asPath).toEqual(
                `/person/pseudo-id/periode/${vedtaksperiodeId}/behandling/${behandlingId}`,
            );
        });
    });

    it('åpner vedtaksperioden til en søknad', async () => {
        mockSpoogleOgPersonsøk([...stiTilVedtaksperiode, søknadId]);

        render(<SpoogleSøk />);
        await søk(søknadId);

        await waitFor(() => {
            expect(mockRouter.asPath).toEqual(`/person/pseudo-id/periode/${vedtaksperiodeId}`);
        });
    });

    it('åpner personen når treffet ikke hører til en vedtaksperiode', async () => {
        mockSpoogleOgPersonsøk([fødselsnummer, organisasjonsnummer]);

        render(<SpoogleSøk />);
        await søk(vedtaksperiodeId);

        await waitFor(() => {
            expect(mockRouter.asPath).toEqual('/person/pseudo-id');
        });
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
