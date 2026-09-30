import React from 'react';
import { Mock } from 'vitest';

import { VilkarsgrunnlagInfotrygdV2 } from '@io/graphql';
import {
    ApiKildetype,
    ApiKravkilde,
    ApiKravkode,
    ApiUtfall,
    ApiVilkårskode,
    ApiVilkårsvurdering,
    ApiVilkårsvurderingerForPersonResponse,
} from '@io/rest/generated/vilkarsproving.schemas';
import {
    useGetVilkårsvurderingerForPersonBehandler,
    usePostManuellVilkårsvurderingBehandler,
} from '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger';
import { InngangsvilkårWithContent } from '@saksbilde/vilkår/Inngangsvilkår';
import { render, screen, within } from '@test-utils';
import userEvent from '@testing-library/user-event';

vi.mock('@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger')>()),
    useGetVilkårsvurderingerForPersonBehandler: vi.fn(),
    usePostManuellVilkårsvurderingBehandler: vi.fn(),
}));

const envMock = vi.hoisted(() => ({
    erUtvikling: true,
}));

vi.mock('@/env', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@/env')>()),
    get erUtvikling() {
        return envMock.erUtvikling;
    },
}));

const ingenAutomatiskeVurderinger: ApiVilkårsvurderingerForPersonResponse = {
    skjæringstidspunkt: '2024-01-01',
    krav: [
        {
            id: 'krav-1',
            kravkode: ApiKravkode.OPPTJENING,
            opptjeningOk: false,
            avgjørendeVilkårskode: null,
            kravkilde: ApiKravkilde.VURDERT_I_SP_VILKARSPROVING,
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
            kravkilde: ApiKravkilde.VURDERT_I_SP_VILKARSPROVING,
            vurderinger: [
                {
                    id: 'vurdering-1',
                    vilkårskode: ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER,
                    utfall: ApiUtfall.OPPFYLT,
                    vurdertTidspunkt: '2024-01-02T10:00:00.000Z',
                    lovreferanse: {
                        lov: 'folketrygdloven',
                        paragraf: '8-2',
                        iKraftFra: '1997-05-01',
                    },
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

const automatiskIkkeOppfyltArbeidMinst4Uker = medEndretVurdering(automatiskVurdertArbeidMinst4Uker, {
    utfall: ApiUtfall.IKKE_OPPFYLT,
});

const saksbehandlerOppfyltArbeidMinst4Uker = medEndretVurdering(automatiskVurdertArbeidMinst4Uker, {
    kilde: {
        ident: 'S123456',
        fritekstbegrunnelse: 'Har likestilt ytelse',
        journalpostId: [],
        kildetype: ApiKildetype.SAKSBEHANDLER,
    },
});

const overførtFraSpleis: ApiVilkårsvurderingerForPersonResponse = {
    skjæringstidspunkt: '2024-01-01',
    krav: [
        {
            id: 'krav-spleis',
            kravkode: ApiKravkode.OPPTJENING,
            opptjeningOk: true,
            avgjørendeVilkårskode: ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER,
            kravkilde: ApiKravkilde.OVERFORT_FRA_SPLEIS,
            vurderinger: [
                {
                    id: 'vurdering-spleis',
                    vilkårskode: ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER,
                    utfall: ApiUtfall.OPPFYLT,
                    vurdertTidspunkt: '2024-01-02T10:00:00.000Z',
                    lovreferanse: {
                        lov: 'folketrygdloven',
                        paragraf: '8-2',
                        iKraftFra: '1997-05-01',
                    },
                    kilde: {
                        grunnlag: { grunnlagstype: 'SELVSTENDIG_NAERINGSDRIVENDE' },
                        kildetype: ApiKildetype.OVERFOERT_FRA_SPLEIS,
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

const arbeidsvilkår = () => screen.getByRole('listitem', { name: 'Arbeid i minst 4 uker' });

const vilkårsgrunnlag: VilkarsgrunnlagInfotrygdV2 = {
    __typename: 'VilkarsgrunnlagInfotrygdV2',
    id: 'en-id',
    arbeidsgiverrefusjoner: [],
    inntekter: [],
    skjaeringstidspunkt: '2024-01-01',
    sykepengegrunnlag: 1234567,
    omregnetArsinntekt: 1234567,
    opptjeningsvurderingId: 'en-id',
};

const renderOpptjening = (readOnly: boolean) =>
    render(
        <InngangsvilkårWithContent
            vilkårsgrunnlag={vilkårsgrunnlag}
            fødselsdato="1980-01-01"
            personPseudoId="en-person"
            opptjeningsvurderingId="en-id"
            readOnly={readOnly}
        />,
    );

const startVurdering = async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Vurder vilkår' }));
};

beforeEach(() => {
    mutate.mockClear();
    envMock.erUtvikling = true;
    mockVilkårsvurderinger(automatiskIkkeOppfyltArbeidMinst4Uker);
    (usePostManuellVilkårsvurderingBehandler as Mock).mockReturnValue({
        mutate,
        isPending: false,
        isError: false,
    });
});

describe('Opptjening', () => {
    it('viser oppsummering av opptjeningsgrunnlaget', async () => {
        renderOpptjening(false);

        expect(within(arbeidsvilkår()).getByText('Opptjening fra')).toBeVisible();
        expect(within(arbeidsvilkår()).getByText('01.01.2023 (120 dager)')).toBeVisible();
    });

    it('skjuler vurder vilkår-knappen når vi ikke er i utvikling', async () => {
        envMock.erUtvikling = false;

        renderOpptjening(false);

        expect(screen.queryByRole('button', { name: 'Vurder vilkår' })).not.toBeInTheDocument();
    });

    it('viser grunnlagsdata for automatisk vurdering', async () => {
        renderOpptjening(true);

        expect(within(arbeidsvilkår()).getByText('Opptjening fra')).toBeVisible();
        expect(within(arbeidsvilkår()).getByText('01.01.2023 (120 dager)')).toBeVisible();
        expect(within(arbeidsvilkår()).getByText(/Vurdert automatisk/, { selector: 'span' })).toBeVisible();
    });

    it('lar saksbehandler vurdere et uvurdert vilkår direkte', async () => {
        renderOpptjening(false);

        await startVurdering();

        await userEvent.click(screen.getByRole('radio', { name: 'Oppfylt' }));
        await userEvent.type(screen.getByRole('textbox', { name: /Begrunnelse/ }), 'Har likestilt ytelse');
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

        await userEvent.click(screen.getByRole('radio', { name: 'Oppfylt' }));
        await userEvent.type(screen.getByRole('textbox', { name: /Begrunnelse/ }), 'Har opptjening');
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(mutate).toHaveBeenCalledWith({
            personId: 'en-person',
            data: {
                skjæringstidspunkt: '2024-01-01',
                vilkårskode: ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER,
                utfall: ApiUtfall.OPPFYLT,
                fritekstbegrunnelse: 'Har opptjening',
                journalpostId: [],
            },
        });
    });

    it('skjuler vurder vilkår-knappen når vilkåret er automatisk oppfylt', async () => {
        mockVilkårsvurderinger(automatiskVurdertArbeidMinst4Uker);

        renderOpptjening(false);

        expect(screen.queryByRole('button', { name: 'Vurder vilkår' })).not.toBeInTheDocument();
    });

    it('skjuler vurder vilkår-knappen når vilkåret er overført fra Spleis som oppfylt', async () => {
        mockVilkårsvurderinger(overførtFraSpleis);

        renderOpptjening(false);

        expect(screen.queryByRole('button', { name: 'Vurder vilkår' })).not.toBeInTheDocument();
    });

    it('viser vurder vilkår-knappen når saksbehandler har vurdert vilkåret som oppfylt', async () => {
        mockVilkårsvurderinger(saksbehandlerOppfyltArbeidMinst4Uker);

        renderOpptjening(false);

        expect(screen.getByRole('button', { name: 'Vurder vilkår' })).toBeVisible();
    });

    it('sender dokument-id som journalpostId', async () => {
        renderOpptjening(false);

        await startVurdering();
        await userEvent.click(screen.getByRole('radio', { name: 'Oppfylt' }));
        await userEvent.click(screen.getByRole('radio', { name: 'Legg til journalpost-ID' }));
        await userEvent.type(screen.getByRole('textbox', { name: 'Journalpost-ID' }), '12345');
        await userEvent.type(screen.getByRole('textbox', { name: /Begrunnelse/ }), 'Dokumentert via vedtak');
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(mutate).toHaveBeenCalledWith({
            personId: 'en-person',
            data: {
                skjæringstidspunkt: '2024-01-01',
                vilkårskode: ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER,
                utfall: ApiUtfall.OPPFYLT,
                fritekstbegrunnelse: 'Dokumentert via vedtak',
                journalpostId: ['12345'],
            },
        });
    });

    it('viser journalpost-ID-feltet bare når saksbehandler velger å legge til journalpost-ID', async () => {
        renderOpptjening(false);

        await startVurdering();

        expect(screen.getByRole('radio', { name: 'Saken er godt nok opplyst i Speil' })).toBeChecked();
        expect(screen.queryByRole('textbox', { name: 'Journalpost-ID' })).not.toBeInTheDocument();

        await userEvent.click(screen.getByRole('radio', { name: 'Legg til journalpost-ID' }));

        expect(screen.getByRole('textbox', { name: 'Journalpost-ID' })).toBeVisible();
    });

    it('sender ikke journalpost-ID når saksbehandler bytter tilbake til at saken er godt nok opplyst', async () => {
        renderOpptjening(false);

        await startVurdering();
        await userEvent.click(screen.getByRole('radio', { name: 'Oppfylt' }));
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
        await userEvent.click(screen.getByRole('radio', { name: 'Oppfylt' }));
        await userEvent.click(screen.getByRole('radio', { name: 'Legg til journalpost-ID' }));
        await userEvent.type(screen.getByRole('textbox', { name: /Begrunnelse/ }), 'Mangler journalpost');
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(await screen.findByText('Fyll inn journalpost-ID')).toBeVisible();
        expect(mutate).not.toHaveBeenCalled();
    });

    it('viser validering når dokument-id inneholder andre tegn enn tall', async () => {
        renderOpptjening(false);

        await startVurdering();
        await userEvent.click(screen.getByRole('radio', { name: 'Oppfylt' }));
        await userEvent.click(screen.getByRole('radio', { name: 'Legg til journalpost-ID' }));
        await userEvent.type(screen.getByRole('textbox', { name: 'Journalpost-ID' }), 'JP-123');
        await userEvent.type(screen.getByRole('textbox', { name: /Begrunnelse/ }), 'Dokumentert via vedtak');
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(await screen.findByText('Journalpost-ID må være 1 til 11 siffer')).toBeVisible();
        expect(mutate).not.toHaveBeenCalled();
    });

    it('viser validering når dokument-id er lengre enn 11 siffer', async () => {
        renderOpptjening(false);

        await startVurdering();
        await userEvent.click(screen.getByRole('radio', { name: 'Oppfylt' }));
        await userEvent.click(screen.getByRole('radio', { name: 'Legg til journalpost-ID' }));
        await userEvent.type(screen.getByRole('textbox', { name: 'Journalpost-ID' }), '123456789012');
        await userEvent.type(screen.getByRole('textbox', { name: /Begrunnelse/ }), 'Dokumentert via vedtak');
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(await screen.findByText('Journalpost-ID må være 1 til 11 siffer')).toBeVisible();
        expect(mutate).not.toHaveBeenCalled();
    });

    it('viser dokument-id under begrunnelse etter lagring', async () => {
        const oppdatertVilkårsvurderinger: ApiVilkårsvurderingerForPersonResponse = {
            skjæringstidspunkt: '2024-01-01',
            krav: [
                {
                    id: 'krav-1',
                    kravkode: ApiKravkode.OPPTJENING,
                    opptjeningOk: true,
                    avgjørendeVilkårskode: ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER,
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
                                kildetype: ApiKildetype.SAKSBEHANDLER,
                            },
                        },
                    ],
                },
            ],
        };

        (usePostManuellVilkårsvurderingBehandler as Mock).mockImplementation((options) => ({
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
        await userEvent.click(screen.getByRole('radio', { name: 'Oppfylt' }));
        await userEvent.click(screen.getByRole('radio', { name: 'Legg til journalpost-ID' }));
        await userEvent.type(screen.getByRole('textbox', { name: 'Journalpost-ID' }), '12345');
        await userEvent.type(screen.getByRole('textbox', { name: /Begrunnelse/ }), 'Dokumentert via vedtak');
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(await within(arbeidsvilkår()).findByText('Journalpost-ID')).toBeVisible();
        expect(within(arbeidsvilkår()).getByText('12345')).toBeVisible();
        expect(screen.queryByRole('button', { name: 'Lagre' })).not.toBeInTheDocument();
    });

    it('markerer vilkåret som vurderes', async () => {
        renderOpptjening(false);

        expect(arbeidsvilkår()).not.toHaveClass('bg-ax-bg-accent-soft');

        await startVurdering();

        expect(arbeidsvilkår()).toHaveClass('bg-ax-bg-accent-soft');
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

    it('viser vurderinger overført fra Spleis på samme måte som vurderinger fra sp-vilkårsprøving', async () => {
        mockVilkårsvurderinger(overførtFraSpleis);

        renderOpptjening(false);

        expect(within(arbeidsvilkår()).getByText(/Vurdert automatisk/, { selector: 'span' })).toHaveAttribute(
            'data-color',
            'neutral',
        );
    });

    it('viser feilmelding når vilkårsvurderingen ikke kan hentes', async () => {
        mockVilkårsvurderinger(undefined, { isError: true });

        renderOpptjening(false);

        expect(screen.getByText('Kunne ikke hente opptjeningsvurderingen')).toBeVisible();
    });
});

function medEndretVurdering(
    data: ApiVilkårsvurderingerForPersonResponse,
    endring: Partial<ApiVilkårsvurdering>,
): ApiVilkårsvurderingerForPersonResponse {
    return {
        ...data,
        krav: data.krav.map((krav) =>
            'vurderinger' in krav
                ? { ...krav, vurderinger: krav.vurderinger.map((vurdering) => ({ ...vurdering, ...endring })) }
                : krav,
        ),
    };
}
