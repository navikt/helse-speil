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
    useOverstyrVilkårsvurderingBehandler,
} from '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger';
import { render, screen, within } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { Opptjening } from './Opptjening';

vi.mock('@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger')>()),
    useGetVilkårsvurderingerForPersonBehandler: vi.fn(),
    useOverstyrVilkårsvurderingBehandler: vi.fn(),
}));

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
const likestiltYtelse = () => screen.getByTestId(`opptjeningsvilkår-${ApiVilkårskode.OPPTJENING_LIKESTILT_YTELSE}`);

beforeEach(() => {
    mutate.mockClear();
    mockVilkårsvurderinger(automatiskVurdertArbeidMinst4Uker);
    (useOverstyrVilkårsvurderingBehandler as Mock).mockReturnValue({
        mutate,
        isPending: false,
        isError: false,
    });
});

describe('Opptjening', () => {
    it('viser totalen for opptjeningskravet', () => {
        render(<Opptjening personPseudoId="en-person" opptjeningsvurderingId="en-id" readOnly={false} />);

        expect(screen.getByText('Kravet til opptjening er oppfylt')).toBeVisible();
    });

    it('viser begge opptjeningsvilkårene selv om bare ett er vurdert', () => {
        render(<Opptjening personPseudoId="en-person" opptjeningsvurderingId="en-id" readOnly={false} />);

        expect(within(arbeidsvilkår()).getByText('Arbeid i minst 4 uker')).toBeVisible();
        expect(within(arbeidsvilkår()).getByText('Oppfylt', { selector: 'p' })).toBeVisible();

        expect(within(likestiltYtelse()).getByText('Likestilt ytelse')).toBeVisible();
        expect(within(likestiltYtelse()).getByText('Ikke vurdert', { selector: 'p' })).toBeVisible();
    });

    it('viser grunnlagsdata for automatisk vurdering', () => {
        render(<Opptjening personPseudoId="en-person" opptjeningsvurderingId="en-id" readOnly={false} />);

        expect(within(arbeidsvilkår()).getByText('Opptjening fra')).toBeVisible();
        expect(within(arbeidsvilkår()).getByText('01.01.2023')).toBeVisible();
        expect(within(arbeidsvilkår()).getByText('Antall dager (>28)')).toBeVisible();
        expect(within(arbeidsvilkår()).getByText('120')).toBeVisible();
        expect(within(arbeidsvilkår()).getByText('Automatisk')).toBeVisible();
    });

    it('lar saksbehandler vurdere et uvurdert vilkår direkte', async () => {
        render(<Opptjening personPseudoId="en-person" opptjeningsvurderingId="en-id" readOnly={false} />);

        await userEvent.click(screen.getByRole('button', { name: 'Vurder Likestilt ytelse' }));

        await userEvent.click(within(likestiltYtelse()).getByRole('radio', { name: 'Oppfylt' }));
        await userEvent.type(
            within(likestiltYtelse()).getByRole('textbox', { name: 'Begrunnelse for Likestilt ytelse' }),
            'Har likestilt ytelse',
        );
        await userEvent.click(within(likestiltYtelse()).getByRole('button', { name: 'Lagre vurdering' }));

        expect(mutate).toHaveBeenCalledWith({
            personId: 'en-person',
            data: {
                skjæringstidspunkt: '2024-01-01',
                vilkårskode: ApiVilkårskode.OPPTJENING_LIKESTILT_YTELSE,
                utfall: ApiUtfall.OPPFYLT,
                fritekstbegrunnelse: 'Har likestilt ytelse',
            },
        });
    });

    it('lar saksbehandler overstyre en automatisk vurdering', async () => {
        render(<Opptjening personPseudoId="en-person" opptjeningsvurderingId="en-id" readOnly={false} />);

        await userEvent.click(screen.getByRole('button', { name: 'Endre vurdering av Arbeid i minst 4 uker' }));

        await userEvent.click(within(arbeidsvilkår()).getByRole('radio', { name: 'Ikke oppfylt' }));
        await userEvent.type(
            within(arbeidsvilkår()).getByRole('textbox', { name: 'Begrunnelse for Arbeid i minst 4 uker' }),
            'Mangler opptjening',
        );
        await userEvent.click(within(arbeidsvilkår()).getByRole('button', { name: 'Lagre vurdering' }));

        expect(mutate).toHaveBeenCalledWith({
            personId: 'en-person',
            data: {
                skjæringstidspunkt: '2024-01-01',
                vilkårskode: ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER,
                utfall: ApiUtfall.IKKE_OPPFYLT,
                fritekstbegrunnelse: 'Mangler opptjening',
            },
        });
    });

    it('validerer at utfall og begrunnelse er fylt ut', async () => {
        render(<Opptjening personPseudoId="en-person" opptjeningsvurderingId="en-id" readOnly={false} />);

        await userEvent.click(screen.getByRole('button', { name: 'Vurder Likestilt ytelse' }));
        await userEvent.click(within(likestiltYtelse()).getByRole('button', { name: 'Lagre vurdering' }));

        expect(mutate).not.toHaveBeenCalled();
        expect(await screen.findByText('Velg utfall')).toBeVisible();
        expect(screen.getByText('Fyll inn begrunnelse')).toBeVisible();
    });

    it('skjuler vurderingsknappene når saken er read only', () => {
        render(<Opptjening personPseudoId="en-person" opptjeningsvurderingId="en-id" readOnly={true} />);

        expect(screen.queryByRole('button', { name: 'Vurder Likestilt ytelse' })).not.toBeInTheDocument();
        expect(
            screen.queryByRole('button', { name: 'Endre vurdering av Arbeid i minst 4 uker' }),
        ).not.toBeInTheDocument();
    });

    it('lar saksbehandler vurdere vilkårene når kravet er overført fra Infotrygd', async () => {
        mockVilkårsvurderinger(overførtFraInfotrygd);

        render(<Opptjening personPseudoId="en-person" opptjeningsvurderingId="en-id" readOnly={false} />);

        expect(within(arbeidsvilkår()).getByText('Ikke vurdert', { selector: 'p' })).toBeVisible();
        expect(within(likestiltYtelse()).getByText('Ikke vurdert', { selector: 'p' })).toBeVisible();

        expect(screen.getByRole('button', { name: 'Vurder Arbeid i minst 4 uker' })).toBeVisible();
        expect(screen.getByRole('button', { name: 'Vurder Likestilt ytelse' })).toBeVisible();
    });

    it('viser feilmelding når vilkårsvurderingen ikke kan hentes', () => {
        mockVilkårsvurderinger(undefined, { isError: true });

        render(<Opptjening personPseudoId="en-person" opptjeningsvurderingId="en-id" readOnly={false} />);

        expect(screen.getByText('Kunne ikke hente opptjeningsvurderingen')).toBeVisible();
    });
});
