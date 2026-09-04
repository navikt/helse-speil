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
import { useGetVilkårsvurderingerForPersonBehandler } from '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger';
import { render, screen, within } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { VilkårsvurderingerKnapp } from './VilkårsvurderingerKnapp';

vi.mock('@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger')>()),
    useGetVilkårsvurderingerForPersonBehandler: vi.fn(),
}));

const vilkårsvurderinger: ApiVilkårsvurderingerForPersonResponse = {
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
                        grunnlag: { grunnlagstype: 'SELVSTENDIG_NAERINGSDRIVENDE' },
                        kildetype: ApiKildetype.AUTOMATISK,
                    },
                },
                {
                    id: 'vurdering-2',
                    vilkårskode: ApiVilkårskode.OPPTJENING_LIKESTILT_YTELSE,
                    utfall: ApiUtfall.IKKE_OPPFYLT,
                    vurdertTidspunkt: '2024-01-03T10:00:00.000Z',
                    kilde: {
                        ident: 'S123456',
                        fritekstbegrunnelse: 'En begrunnelse',
                        kildetype: ApiKildetype.SAKSBEHANDLER,
                    },
                },
            ],
        },
    ],
};

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

const åpneDialog = async () => {
    render(<VilkårsvurderingerKnapp personPseudoId="en-person" opptjeningsvurderingId="en-id" />);
    await userEvent.click(screen.getByRole('button', { name: 'Vilkårsvurderinger' }));
};

describe('VilkårsvurderingerKnapp', () => {
    it('viser ikke dialogen før knappen klikkes', () => {
        mockVilkårsvurderinger(vilkårsvurderinger);

        render(<VilkårsvurderingerKnapp personPseudoId="en-person" opptjeningsvurderingId="en-id" />);

        expect(screen.queryByText('OPPTJENING_MINST_4_UKER')).not.toBeInTheDocument();
    });

    it('viser paragraf, vurderingstype og utfall for hvert vurderte vilkår', async () => {
        mockVilkårsvurderinger(vilkårsvurderinger);

        await åpneDialog();

        const arbeidsvilkår = screen.getByTestId(`vilkårsvurdering-${ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER}`);
        expect(within(arbeidsvilkår).getByText('OPPTJENING_MINST_4_UKER')).toBeVisible();
        expect(
            within(arbeidsvilkår).getByText('Har arbeidet i minst fire uker før arbeidsuførhet inntreffer'),
        ).toBeVisible();
        expect(within(arbeidsvilkår).getByText('Folketrygdloven')).toBeVisible();
        expect(within(arbeidsvilkår).getByText('§8-2 ledd 1 setning 1')).toBeVisible();
        expect(within(arbeidsvilkår).getByText('Oppfylt')).toBeVisible();
        expect(within(arbeidsvilkår).getByText('Automatisk vurdert')).toBeVisible();

        const likestiltYtelse = screen.getByTestId(`vilkårsvurdering-${ApiVilkårskode.OPPTJENING_LIKESTILT_YTELSE}`);
        expect(within(likestiltYtelse).getByText('OPPTJENING_ANNEN_YTELSE')).toBeVisible();
        expect(within(likestiltYtelse).getByText('§8-2 ledd 2 setning 1')).toBeVisible();
        expect(within(likestiltYtelse).getByText('Ikke oppfylt')).toBeVisible();
        expect(within(likestiltYtelse).getByText('Manuelt vurdert')).toBeVisible();
    });

    it('viser melding når ingen vilkår er vurdert', async () => {
        mockVilkårsvurderinger({ skjæringstidspunkt: '2024-01-01', krav: [] });

        await åpneDialog();

        expect(screen.getByText('Ingen vilkår er vurdert')).toBeVisible();
    });

    it('viser feilmelding når vilkårsvurderingene ikke kan hentes', async () => {
        mockVilkårsvurderinger(undefined, { isError: true });

        await åpneDialog();

        expect(screen.getByText('Kunne ikke hente vilkårsvurderingene')).toBeVisible();
    });
});
