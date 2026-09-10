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
const likestiltYtelse = () => screen.getByTestId(`opptjeningsvilkår-${ApiVilkårskode.OPPTJENING_LIKESTILT_YTELSE}`);

const åpneKort = async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Vis mer' }));
};

const startVurdering = async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Vurder vilkår' }));
};

const åpneRad = async (rad: HTMLElement) => {
    await userEvent.click(within(rad).getByRole('button', { name: 'Vis mer' }));
};

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
    it('viser oppsummering av opptjeningsgrunnlaget', async () => {
        render(<Opptjening personPseudoId="en-person" opptjeningsvurderingId="en-id" readOnly={false} />);

        await åpneKort();

        expect(screen.getByText('Opptjening fra 01.01.2023 (120 dager)')).toBeVisible();
    });

    it('viser begge opptjeningsvilkårene selv om bare ett er vurdert', async () => {
        render(<Opptjening personPseudoId="en-person" opptjeningsvurderingId="en-id" readOnly={false} />);

        await åpneKort();
        await startVurdering();

        expect(within(arbeidsvilkår()).getByText('Arbeid i minst 4 uker')).toBeVisible();
        expect(within(arbeidsvilkår()).getByText('Oppfylt', { selector: 'span' })).toBeVisible();

        expect(within(likestiltYtelse()).getByText('Likestilt ytelse')).toBeVisible();
        expect(within(likestiltYtelse()).getByText('Ikke vurdert', { selector: 'span' })).toBeVisible();
    });

    it('viser grunnlagsdata for automatisk vurdering', async () => {
        render(<Opptjening personPseudoId="en-person" opptjeningsvurderingId="en-id" readOnly={true} />);

        await åpneKort();
        await åpneRad(arbeidsvilkår());

        expect(within(arbeidsvilkår()).getByText('Opptjening fra')).toBeVisible();
        expect(within(arbeidsvilkår()).getByText('01.01.2023')).toBeVisible();
        expect(within(arbeidsvilkår()).getByText('Antall dager (>28)')).toBeVisible();
        expect(within(arbeidsvilkår()).getByText('120')).toBeVisible();
        expect(within(arbeidsvilkår()).getByText('Automatisk')).toBeVisible();
    });

    it('viser arbeidsforholdene i grunnlaget i en liste bak en ReadMore', async () => {
        render(<Opptjening personPseudoId="en-person" opptjeningsvurderingId="en-id" readOnly={true} />);

        await åpneKort();
        await åpneRad(arbeidsvilkår());

        expect(within(likestiltYtelse()).queryByText('Arbeidsforhold i grunnlaget (2)')).not.toBeInTheDocument();

        const readMore = within(arbeidsvilkår()).getByRole('button', { name: 'Arbeidsforhold i grunnlaget (2)' });
        expect(readMore).toHaveAttribute('aria-expanded', 'false');

        await userEvent.click(readMore);
        expect(readMore).toHaveAttribute('aria-expanded', 'true');

        const rader = within(arbeidsvilkår()).getAllByRole('row');
        expect(rader).toHaveLength(3);
        expect(within(rader[1]!).getByText('123456789')).toBeVisible();
        expect(within(rader[1]!).getByText('01.01.2023 – løpende')).toBeVisible();
        expect(within(rader[1]!).getByText('Ordinært')).toBeVisible();
        expect(within(rader[2]!).getByText('987654321')).toBeVisible();
        expect(within(rader[2]!).getByText('01.03.2022 – 31.12.2022')).toBeVisible();
        expect(within(rader[2]!).getByText('Frilanser')).toBeVisible();
    });

    it('lar saksbehandler vurdere et uvurdert vilkår direkte', async () => {
        render(<Opptjening personPseudoId="en-person" opptjeningsvurderingId="en-id" readOnly={false} />);

        await åpneKort();
        await startVurdering();
        await åpneRad(likestiltYtelse());

        await userEvent.click(within(likestiltYtelse()).getByRole('radio', { name: 'Oppfylt' }));
        await userEvent.type(within(likestiltYtelse()).getByRole('textbox'), 'Har likestilt ytelse');
        await userEvent.click(within(likestiltYtelse()).getByRole('button', { name: 'Lagre' }));

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

        await åpneKort();
        await startVurdering();
        await åpneRad(arbeidsvilkår());

        await userEvent.click(within(arbeidsvilkår()).getByRole('radio', { name: 'Ikke oppfylt' }));
        await userEvent.type(within(arbeidsvilkår()).getByRole('textbox'), 'Mangler opptjening');
        await userEvent.click(within(arbeidsvilkår()).getByRole('button', { name: 'Lagre' }));

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

        await åpneKort();
        await startVurdering();
        await åpneRad(likestiltYtelse());
        await userEvent.click(within(likestiltYtelse()).getByRole('button', { name: 'Lagre' }));

        expect(mutate).not.toHaveBeenCalled();
        expect(await screen.findByText('Velg utfall')).toBeVisible();
        expect(screen.getByText('Fyll inn begrunnelse')).toBeVisible();
    });

    it('lar saksbehandler avbryte en vurderingsøkt', async () => {
        render(<Opptjening personPseudoId="en-person" opptjeningsvurderingId="en-id" readOnly={false} />);

        await åpneKort();
        await startVurdering();

        expect(within(arbeidsvilkår()).getByText('Arbeid i minst 4 uker')).toBeVisible();

        await userEvent.click(screen.getByRole('button', { name: 'Avbryt' }));

        expect(screen.queryByText('Arbeid i minst 4 uker')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Vurder vilkår' })).toBeVisible();
    });

    it('skjuler vurderingsknappene når saken er read only', async () => {
        render(<Opptjening personPseudoId="en-person" opptjeningsvurderingId="en-id" readOnly={true} />);

        await åpneKort();

        expect(screen.queryByRole('button', { name: 'Vurder vilkår' })).not.toBeInTheDocument();
    });

    it('lar saksbehandler vurdere vilkårene når kravet er overført fra Infotrygd', async () => {
        mockVilkårsvurderinger(overførtFraInfotrygd);

        render(<Opptjening personPseudoId="en-person" opptjeningsvurderingId="en-id" readOnly={false} />);

        await åpneKort();
        await startVurdering();

        expect(within(arbeidsvilkår()).getByText('Ikke vurdert', { selector: 'span' })).toBeVisible();
        expect(within(likestiltYtelse()).getByText('Ikke vurdert', { selector: 'span' })).toBeVisible();

        expect(within(arbeidsvilkår()).getByRole('button', { name: 'Vis mer' })).toBeVisible();
        expect(within(likestiltYtelse()).getByRole('button', { name: 'Vis mer' })).toBeVisible();
    });

    it('viser feilmelding når vilkårsvurderingen ikke kan hentes', async () => {
        mockVilkårsvurderinger(undefined, { isError: true });

        render(<Opptjening personPseudoId="en-person" opptjeningsvurderingId="en-id" readOnly={false} />);

        await åpneKort();

        expect(screen.getByText('Kunne ikke hente opptjeningsvurderingen')).toBeVisible();
    });
});
