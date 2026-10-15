import mockRouter from 'next-router-mock';
import React from 'react';

import { ApiHandlingType } from '@io/rest/generated/spesialist.schemas';
import { Saksbehandlerhandlinghendelse } from '@saksbilde/historikk/hendelser/Saksbehandlerhandlinghendelse';
import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';
import { SaksbehandlerhandlinghendelseObject } from '@typer/historikk';

describe('Saksbehandlerhandlinghendelse', () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');

    beforeEach(() => {
        mockRouter.setCurrentUrl('/person/person-1');
        fetchMock.mockReset();
    });

    afterAll(() => fetchMock.mockRestore());

    it('henter detaljer først når innslaget ekspanderes', async () => {
        fetchMock.mockResolvedValue(
            Response.json({
                felter: [
                    { type: 'TEKST', tittel: 'Vilkår', tekst: 'Arbeid i minst 4 uker' },
                    { type: 'TEKST', tittel: 'Begrunnelse', tekst: 'En begrunnelse' },
                    { type: 'LISTE', tittel: 'Journalposter', elementer: ['123'] },
                ],
            }),
        );
        renderHendelse();

        expect(fetchMock).not.toHaveBeenCalled();

        await userEvent.click(screen.getByText('Opptjening vurdert manuelt'));

        expect(await screen.findByText('Vilkår')).toBeVisible();
        expect(screen.getByText('Arbeid i minst 4 uker')).toBeVisible();
        expect(screen.getByText('Begrunnelse')).toBeVisible();
        expect(screen.getByText('En begrunnelse')).toBeVisible();
        expect(screen.getByText('Journalposter')).toBeVisible();
        expect(screen.getByText('123')).toBeVisible();
        expect(fetchMock).toHaveBeenCalledWith(
            '/api/vilkarsproving/personer/person-1/saksbehandlerhandlinger/handling-1/visning',
            expect.anything(),
        );
    });

    it('kan ikke ekspanderes og henter ingenting for handlinger uten detaljer', async () => {
        renderHendelse(ApiHandlingType.NY_AUTOMATISK_OPPTJENINGSVURDERING);

        await userEvent.click(screen.getByText('Opptjening vurdert automatisk på nytt'));

        expect(screen.queryByTitle('Vis mer')).not.toBeInTheDocument();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('viser at detaljene ikke finnes når domenetjenesten svarer 404', async () => {
        fetchMock.mockResolvedValue(new Response(null, { status: 404 }));
        renderHendelse();

        await userEvent.click(screen.getByText('Opptjening vurdert manuelt'));

        expect(await screen.findByText('Fant ikke detaljer')).toBeVisible();
    });

    it('viser feil når svaret ikke kan tolkes', async () => {
        fetchMock.mockResolvedValue(Response.json({ seksjoner: 'feil' }));
        renderHendelse();

        await userEvent.click(screen.getByText('Opptjening vurdert manuelt'));

        expect(await screen.findByText('Kunne ikke hente detaljer')).toBeVisible();
    });
});

function renderHendelse(handlingType: ApiHandlingType = ApiHandlingType.MANUELT_VURDERT_OPPTJENING) {
    const hendelse: SaksbehandlerhandlinghendelseObject = {
        id: 'handling-1',
        type: 'Saksbehandlerhandling',
        handlingType,
        saksbehandler: 'S123456',
        timestamp: '2024-09-10T10:15:00.000',
    };
    return render(
        <ul>
            <Saksbehandlerhandlinghendelse hendelse={hendelse} />
        </ul>,
    );
}
