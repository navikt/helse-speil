import { Mock } from 'vitest';

import {
    ApiKildetype,
    ApiKravkilde,
    ApiKravkode,
    ApiUtfall,
    ApiVilkårskode,
    ApiVilkårsvurderingerForPersonResponse,
} from '@io/rest/generated/vilkarsproving.schemas';
import { usePostManuellOpptjeningsvurderingBehandler } from '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger';
import { screen, within } from '@test-utils';
import userEvent from '@testing-library/user-event';

import {
    bareArbeid,
    mockVilkårsvurderinger,
    mutate,
    opptjeningsvilkår,
    renderOpptjening,
    settOppOpptjeningsmocker,
    startVurdering,
    velgBareArbeid,
} from './opptjeningTestoppsett';

vi.mock('@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger')>()),
    useGetVilkårsvurderingerForPersonBehandler: vi.fn(),
    useGetOpptjeningshistorikkBehandler: vi.fn(),
    usePostManuellOpptjeningsvurderingBehandler: vi.fn(),
    usePostNyAutomatiskVilkårsvurderingBehandler: vi.fn(),
}));

vi.mock('@state/serverSentEvents', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@state/serverSentEvents')>()),
    useHåndterNyttEvent: () => {},
}));

vi.mock('@hooks/brukerrolleHooks', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@hooks/brukerrolleHooks')>()),
    useHarSkrivetilgang: () => true,
    useErCoachFagkoordinatorEllerSupersaksbehandler: () => true,
}));

beforeEach(() => {
    settOppOpptjeningsmocker();
});

describe('Journalpost-ID i opptjeningsvurderingsskjemaet', () => {
    it('krever at saksbehandler velger om journalpost-ID skal legges til', async () => {
        renderOpptjening(false);

        await startVurdering();
        await velgBareArbeid();
        await userEvent.type(screen.getByRole('textbox', { name: /Begrunnelse/ }), 'Har jobbet');
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(await screen.findByText('Velg om du vil legge til journalpost-ID')).toBeVisible();
        expect(mutate).not.toHaveBeenCalled();
    });

    it('viser journalpost-ID-feltet bare når saksbehandler velger å legge til journalpost-ID', async () => {
        renderOpptjening(false);

        await startVurdering();

        expect(screen.getByRole('radio', { name: 'Saken er godt nok opplyst i Speil' })).not.toBeChecked();
        expect(screen.getByRole('radio', { name: 'Legg til journalpost-ID' })).not.toBeChecked();
        expect(screen.queryByRole('textbox', { name: 'Journalpost-ID' })).not.toBeInTheDocument();

        await userEvent.click(screen.getByRole('radio', { name: 'Legg til journalpost-ID' }));

        expect(screen.getByRole('textbox', { name: 'Journalpost-ID' })).toBeVisible();
    });

    it('sender dokument-id som journalpostId', async () => {
        renderOpptjening(false);

        await startVurdering();
        await velgBareArbeid();
        await userEvent.click(screen.getByRole('radio', { name: 'Legg til journalpost-ID' }));
        await userEvent.type(screen.getByRole('textbox', { name: 'Journalpost-ID' }), '12345');
        await userEvent.type(screen.getByRole('textbox', { name: /Begrunnelse/ }), 'Dokumentert via vedtak');
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(mutate).toHaveBeenCalledWith({
            personId: 'en-person',
            data: {
                skjæringstidspunkt: '2024-01-01',
                ...bareArbeid,
                fritekstbegrunnelse: 'Dokumentert via vedtak',
                journalpostId: ['12345'],
            },
        });
    });

    it('sender ikke journalpost-ID når saksbehandler bytter tilbake til at saken er godt nok opplyst', async () => {
        renderOpptjening(false);

        await startVurdering();
        await velgBareArbeid();
        await userEvent.click(screen.getByRole('radio', { name: 'Legg til journalpost-ID' }));
        await userEvent.type(screen.getByRole('textbox', { name: 'Journalpost-ID' }), '12345');
        await userEvent.click(screen.getByRole('radio', { name: 'Saken er godt nok opplyst i Speil' }));
        await userEvent.type(screen.getByRole('textbox', { name: /Begrunnelse/ }), 'Opplyst i Speil');
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(mutate).toHaveBeenCalledWith(
            expect.objectContaining({ data: expect.objectContaining({ journalpostId: [] }) }),
        );
    });

    it('krever journalpost-ID når saksbehandler har valgt å legge til journalpost-ID', async () => {
        renderOpptjening(false);

        await startVurdering();
        await velgBareArbeid();
        await userEvent.click(screen.getByRole('radio', { name: 'Legg til journalpost-ID' }));
        await userEvent.type(screen.getByRole('textbox', { name: /Begrunnelse/ }), 'Mangler journalpost');
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(await screen.findByText('Fyll inn journalpost-ID')).toBeVisible();
        expect(mutate).not.toHaveBeenCalled();
    });

    // Formatet testes i begrunnelseOgJournalpostSkjema.test.ts. Her sjekkes bare at feilen vises.
    it('viser validering når journalpost-ID ikke er tall', async () => {
        renderOpptjening(false);

        await startVurdering();
        await velgBareArbeid();
        await userEvent.click(screen.getByRole('radio', { name: 'Legg til journalpost-ID' }));
        await userEvent.type(screen.getByRole('textbox', { name: 'Journalpost-ID' }), 'JP-123');
        await userEvent.type(screen.getByRole('textbox', { name: /Begrunnelse/ }), 'Dokumentert via vedtak');
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(await screen.findByText('Journalpost-ID må være 1 til 11 siffer')).toBeVisible();
        expect(mutate).not.toHaveBeenCalled();
    });

    it('viser ikke begrunnelse og dokument-id i opptjeningsvisningen etter lagring', async () => {
        const oppdatertVilkårsvurderinger: ApiVilkårsvurderingerForPersonResponse = {
            skjæringstidspunkt: '2024-01-01',
            krav: [
                {
                    id: 'krav-1',
                    kravkode: ApiKravkode.OPPTJENING,
                    opptjeningOk: true,
                    kravkilde: ApiKravkilde.VURDERT_I_SP_VILKARSPROVING,
                    vurderinger: [
                        {
                            id: 'vurdering-2',
                            vilkårskode: ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER,
                            utfall: ApiUtfall.OPPFYLT,
                            vurdertTidspunkt: '2024-01-03T10:00:00.000Z',
                            lovreferanse: {
                                lov: 'folketrygdloven',
                                paragraf: '8-2',
                                iKraftFra: '1997-05-01',
                            },
                            kilde: {
                                ident: 'S123456',
                                fritekstbegrunnelse: 'Dokumentert via vedtak',
                                journalpostId: ['12345'],
                                opptjeningsaktiviteter: [],
                                kildetype: ApiKildetype.SAKSBEHANDLER,
                            },
                        },
                    ],
                },
            ],
        };

        (usePostManuellOpptjeningsvurderingBehandler as Mock).mockImplementation((options) => ({
            mutate: (variables: { personId: string; data: unknown }) => {
                mutate(variables);
                mockVilkårsvurderinger(oppdatertVilkårsvurderinger);
                options?.mutation?.onSuccess?.({ opptjeningsvurderingId: 'oppdatert-id' }, variables, undefined);
            },
            isPending: false,
            isError: false,
        }));

        renderOpptjening(false);

        await startVurdering();
        await velgBareArbeid();
        await userEvent.click(screen.getByRole('radio', { name: 'Legg til journalpost-ID' }));
        await userEvent.type(screen.getByRole('textbox', { name: 'Journalpost-ID' }), '12345');
        await userEvent.type(screen.getByRole('textbox', { name: /Begrunnelse/ }), 'Dokumentert via vedtak');
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(await within(opptjeningsvilkår()).findByText('S123456')).toBeVisible();
        expect(within(opptjeningsvilkår()).queryByText('Journalpost-ID')).not.toBeInTheDocument();
        expect(within(opptjeningsvilkår()).queryByText('12345')).not.toBeInTheDocument();
        expect(within(opptjeningsvilkår()).queryByText('Dokumentert via vedtak')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Lagre' })).not.toBeInTheDocument();
    });
});
