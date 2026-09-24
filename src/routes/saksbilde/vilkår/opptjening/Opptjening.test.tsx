import React from 'react';
import { Mock } from 'vitest';

import {
    ApiKildetype,
    ApiKravkilde,
    ApiKravkode,
    ApiUtfall,
    ApiVilkårskode,
    ApiVilkårsvurderingerForPersonResponse,
} from '@io/rest/generated/vilkarsproving.schemas';
import {
    useGetVilkårsvurderingerForPersonBehandler,
    usePostManuellVilkårsvurderingBehandler,
} from '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger';
import { render, screen, within } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { VurderingspanelContext, VurderingspanelProvider } from '../VurderingspanelContext';
import { Opptjening } from './Opptjening';

vi.mock('@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger')>()),
    useGetVilkårsvurderingerForPersonBehandler: vi.fn(),
    usePostManuellVilkårsvurderingBehandler: vi.fn(),
}));

const ingenAutomatiskeVurderinger: ApiVilkårsvurderingerForPersonResponse = {
    skjæringstidspunkt: '2024-01-01',
    krav: [
        {
            id: 'krav-1',
            kravkode: ApiKravkode.OPPTJENING,
            opptjeningOk: false,
            avgjørendeVilkårskode: null,
            kravkilde: ApiKravkilde.VURDERT_I_SPEIL,
            vurderinger: [],
        },
    ],
};

const automatiskVurdertArbeidMinst4Uker: ApiVilkårsvurderingerForPersonResponse = {
    skjæringstidspunkt: '2024-01-01',
    krav: [
        {
            id: 'krav-1',
            kravkode: ApiKravkode.OPPTJENING,
            opptjeningOk: true,
            avgjørendeVilkårskode: ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER,
            kravkilde: ApiKravkilde.VURDERT_I_SPEIL,
            vurderinger: [
                {
                    id: 'vurdering-1',
                    vilkårskode: ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER,
                    utfall: ApiUtfall.OPPFYLT,
                    vurdertTidspunkt: '2024-01-02T10:00:00.000Z',
                    kilde: {
                        versjonAvKildekode: 'v1',
                        grunnlag: {
                            arbeidsforhold: [
                                {
                                    organisasjonsnummer: '123456789',
                                    fom: '2023-01-01',
                                    tom: null,
                                    type: 'ORDINÆRT',
                                },
                                {
                                    organisasjonsnummer: '987654321',
                                    fom: '2022-03-01',
                                    tom: '2022-12-31',
                                    type: 'FRILANSER',
                                },
                            ],
                            opptjeningsperiode: { fom: '2023-01-01', tom: '2023-12-31' },
                            opptjeningsdager: 120,
                            grunnlagstype: 'ARBEIDSFORHOLD',
                        },
                        kildetype: ApiKildetype.AUTOMATISK,
                    },
                },
            ],
        },
    ],
};

const overførtFraInfotrygd: ApiVilkårsvurderingerForPersonResponse = {
    skjæringstidspunkt: '2024-01-01',
    krav: [
        {
            id: 'krav-2',
            kravkode: ApiKravkode.OPPTJENING,
            opptjeningOk: true,
            kravkilde: ApiKravkilde.OVERFOERT_FRA_INFOTRYGD,
        },
    ],
};

const mutate = vi.fn();

const mockVilkårsvurderinger = (
    data: ApiVilkårsvurderingerForPersonResponse | undefined,
    overrides?: { isLoading?: boolean; isError?: boolean },
) => {
    (useGetVilkårsvurderingerForPersonBehandler as Mock).mockReturnValue({
        data,
        isLoading: overrides?.isLoading ?? false,
        isError: overrides?.isError ?? false,
    });
};

const arbeidsvilkår = () => screen.getByTestId(`opptjeningsvilkår-${ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER}`);

function VurderingspanelTestRamme({ children }: React.PropsWithChildren): React.ReactElement {
    return (
        <VurderingspanelProvider>
            <VurderingspanelInnhold>{children}</VurderingspanelInnhold>
        </VurderingspanelProvider>
    );
}

function VurderingspanelInnhold({ children }: React.PropsWithChildren): React.ReactElement {
    const { innhold } = React.useContext(VurderingspanelContext);

    return (
        <>
            {children}
            <div>{innhold}</div>
        </>
    );
}

const renderOpptjening = (readOnly: boolean) =>
    render(
        <VurderingspanelTestRamme>
            <Opptjening personPseudoId="en-person" opptjeningsvurderingId="en-id" readOnly={readOnly} />
        </VurderingspanelTestRamme>,
    );

const startVurdering = async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Vurder vilkår' }));
};

beforeEach(() => {
    mutate.mockClear();
    mockVilkårsvurderinger(automatiskVurdertArbeidMinst4Uker);
    (usePostManuellVilkårsvurderingBehandler as Mock).mockReturnValue({
        mutate,
        isPending: false,
        isError: false,
    });
});

describe('Opptjening', () => {
    it('viser oppsummering av opptjeningsgrunnlaget', async () => {
        renderOpptjening(false);

        expect(within(arbeidsvilkår()).getByText('Opptjening fra 01.01.2023 (120 dager)')).toBeVisible();
    });

    it('viser grunnlagsdata for automatisk vurdering', async () => {
        renderOpptjening(true);

        expect(within(arbeidsvilkår()).getByText('Opptjening fra 01.01.2023 (120 dager)')).toBeVisible();
        expect(within(arbeidsvilkår()).getByText(/Vurdert automatisk/, { selector: 'span' })).toBeVisible();
    });

    it('lar saksbehandler vurdere et uvurdert vilkår direkte', async () => {
        renderOpptjening(false);

        await startVurdering();

        await userEvent.click(screen.getByRole('radio', { name: 'Oppfylt' }));
        await userEvent.type(
            screen.getByRole('textbox', { name: /Begrunnelse for vurderingen/ }),
            'Har likestilt ytelse',
        );
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(mutate).toHaveBeenCalledWith({
            personId: 'en-person',
            data: {
                skjæringstidspunkt: '2024-01-01',
                vilkårskode: ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER,
                utfall: ApiUtfall.OPPFYLT,
                fritekstbegrunnelse: 'Har likestilt ytelse',
                journalpostId: [],
            },
        });
    });

    it('lar saksbehandler overstyre en automatisk vurdering', async () => {
        renderOpptjening(false);

        await startVurdering();

        await userEvent.click(screen.getByRole('radio', { name: 'Ikke oppfylt' }));
        await userEvent.type(
            screen.getByRole('textbox', { name: /Begrunnelse for vurderingen/ }),
            'Mangler opptjening',
        );
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(mutate).toHaveBeenCalledWith({
            personId: 'en-person',
            data: {
                skjæringstidspunkt: '2024-01-01',
                vilkårskode: ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER,
                utfall: ApiUtfall.IKKE_OPPFYLT,
                fritekstbegrunnelse: 'Mangler opptjening',
                journalpostId: [],
            },
        });
    });

    it('sender dokument-id som journalpostId', async () => {
        renderOpptjening(false);

        await startVurdering();
        await userEvent.type(screen.getByRole('textbox', { name: 'Dokument-ID' }), 'JP-123');
        await userEvent.type(
            screen.getByRole('textbox', { name: /Begrunnelse for vurderingen/ }),
            'Dokumentert via vedtak',
        );
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(mutate).toHaveBeenCalledWith({
            personId: 'en-person',
            data: {
                skjæringstidspunkt: '2024-01-01',
                vilkårskode: ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER,
                utfall: ApiUtfall.OPPFYLT,
                fritekstbegrunnelse: 'Dokumentert via vedtak',
                journalpostId: ['JP-123'],
            },
        });
    });

    it('validerer at utfall og begrunnelse er fylt ut', async () => {
        mockVilkårsvurderinger(ingenAutomatiskeVurderinger);
        renderOpptjening(false);

        await startVurdering();
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(mutate).not.toHaveBeenCalled();
        expect(await screen.findByText('Velg utfall')).toBeVisible();
        expect(screen.getByText('Fyll inn begrunnelse')).toBeVisible();
    });

    it('lar saksbehandler avbryte en vurderingsøkt', async () => {
        renderOpptjening(false);

        await startVurdering();

        expect(screen.getByText('Vurder om søkeren har hatt arbeid i minst 4 uker')).toBeVisible();
        expect(screen.getByRole('heading', { name: 'Opptjeningstid' })).not.toHaveClass('bg-ax-bg-info-soft');
        expect(screen.getByRole('list').parentElement).toHaveClass('bg-ax-bg-info-soft');

        await userEvent.click(screen.getByRole('button', { name: 'Avbryt' }));

        expect(screen.queryByText('Vurder om søkeren har hatt arbeid i minst 4 uker')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Vurder vilkår' })).toBeVisible();
    });

    it('skjuler vurderingsknappene når saken er read only', async () => {
        renderOpptjening(true);

        expect(screen.queryByRole('button', { name: 'Vurder vilkår' })).not.toBeInTheDocument();
    });

    it('lar saksbehandler vurdere vilkårene når kravet er overført fra Infotrygd', async () => {
        mockVilkårsvurderinger(overførtFraInfotrygd);

        renderOpptjening(false);

        expect(within(arbeidsvilkår()).getByText('Ikke vurdert', { selector: 'span' })).toBeVisible();

        await startVurdering();
        expect(screen.getByText('Vurder om søkeren har hatt arbeid i minst 4 uker')).toBeVisible();
    });

    it('viser feilmelding når vilkårsvurderingen ikke kan hentes', async () => {
        mockVilkårsvurderinger(undefined, { isError: true });

        renderOpptjening(false);

        expect(screen.getByText('Kunne ikke hente opptjeningsvurderingen')).toBeVisible();
    });
});
