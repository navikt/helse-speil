import React from 'react';
import { Mock } from 'vitest';

import { getGetSaksbehandlerhandlingerForPersonQueryKey } from '@io/rest/generated/personer/personer';
import { ApiServerSentEventEvent, ApiVilkårsgrunnlagInfotrygdV2 } from '@io/rest/generated/spesialist.schemas';
import {
    ApiKildetype,
    ApiKravkilde,
    ApiKravkode,
    ApiNyAutomatiskVilkårsvurderingStatus,
    ApiOpptjeningsaktivitet,
    ApiOpptjeningshistorikkInnslag,
    ApiUtfall,
    ApiVilkårskode,
    ApiVilkårsvurdering,
    ApiVilkårsvurderingerForPersonResponse,
} from '@io/rest/generated/vilkarsproving.schemas';
import {
    getGetOpptjeningshistorikkBehandlerQueryKey,
    getGetVilkårsvurderingerForPersonBehandlerQueryKey,
    useGetOpptjeningshistorikkBehandler,
    useGetVilkårsvurderingerForPersonBehandler,
    usePostManuellOpptjeningsvurderingBehandler,
    usePostNyAutomatiskVilkårsvurderingBehandler,
} from '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger';
import { InngangsvilkårWithContent } from '@saksbilde/vilkår/Inngangsvilkår';
import { QueryClient } from '@tanstack/react-query';
import { act, render, screen, waitFor, within } from '@test-utils';
import userEvent from '@testing-library/user-event';

const serverSentEventMock = vi.hoisted(() => ({
    onEvent: undefined as ((event: { event: string; data: null }) => void) | undefined,
}));

vi.mock('@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger')>()),
    useGetVilkårsvurderingerForPersonBehandler: vi.fn(),
    useGetOpptjeningshistorikkBehandler: vi.fn(),
    usePostManuellOpptjeningsvurderingBehandler: vi.fn(),
    usePostNyAutomatiskVilkårsvurderingBehandler: vi.fn(),
}));

vi.mock('@state/serverSentEvents', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@state/serverSentEvents')>()),
    useHåndterNyttEvent: (onEvent: (event: { event: string; data: null }) => void) => {
        serverSentEventMock.onEvent = onEvent;
    },
}));

const brukerrolleMock = vi.hoisted(() => ({
    erCoachFagkoordinatorEllerSupersaksbehandler: true,
}));

vi.mock('@hooks/brukerrolleHooks', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@hooks/brukerrolleHooks')>()),
    useErCoachFagkoordinatorEllerSupersaksbehandler: () => brukerrolleMock.erCoachFagkoordinatorEllerSupersaksbehandler,
}));

const featureToggleMock = vi.hoisted(() => ({
    kanVurdereLikestilteYtelser: true,
}));

vi.mock('@utils/featureToggles', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@utils/featureToggles')>()),
    kanVurdereLikestilteYtelser: () => featureToggleMock.kanVurdereLikestilteYtelser,
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
        opptjeningsaktiviteter: [],
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
const mutateNyAutomatisk = vi.fn();
const refetch = vi.fn();

const mockVilkårsvurderinger = (
    data: ApiVilkårsvurderingerForPersonResponse | undefined,
    overrides?: { isLoading?: boolean; isFetching?: boolean; isError?: boolean },
) => {
    (useGetVilkårsvurderingerForPersonBehandler as Mock).mockReturnValue({
        data,
        isLoading: overrides?.isLoading ?? false,
        isFetching: overrides?.isFetching ?? false,
        isError: overrides?.isError ?? false,
        refetch,
    });
};

const mockOpptjeningshistorikk = (historikk: ApiOpptjeningshistorikkInnslag[]) => {
    (useGetOpptjeningshistorikkBehandler as Mock).mockReturnValue({
        data: { skjæringstidspunkt: '2024-01-01', historikk },
        isLoading: false,
        isError: false,
    });
};

const opptjeningsvilkår = () => screen.getByRole('region', { name: /^Opptjeningstid/ });

const vilkårsgrunnlag: ApiVilkårsgrunnlagInfotrygdV2 = {
    type: 'ApiVilkårsgrunnlagInfotrygdV2',
    id: 'en-id',
    arbeidsgiverrefusjoner: [],
    inntekter: [],
    skjaeringstidspunkt: '2024-01-01',
    sykepengegrunnlag: 1234567,
    omregnetArsinntekt: 1234567,
    opptjeningsvurderingId: 'en-id',
};

const renderOpptjening = (readOnly: boolean, serPåTidligereBehandling = false) =>
    render(medOpptjening(readOnly, serPåTidligereBehandling));

const medOpptjening = (readOnly: boolean, serPåTidligereBehandling: boolean) => (
    <InngangsvilkårWithContent
        vilkårsgrunnlag={vilkårsgrunnlag}
        fødselsdato="1980-01-01"
        personPseudoId="en-person"
        opptjeningsvurderingId="en-id"
        readOnly={readOnly}
        serPåTidligereBehandling={serPåTidligereBehandling}
    />
);

const startVurdering = async () => {
    await userEvent.click(within(opptjeningsvilkår()).getByRole('button', { name: 'Vurder vilkår' }));
};

const minst4Uker = /kombinasjon av arbeid og likestilt ytelse, i minst 4 uker/;

const svar = (spørsmål: RegExp, svar: 'Ja' | 'Nei') =>
    userEvent.click(within(screen.getByRole('radiogroup', { name: spørsmål })).getByRole('radio', { name: svar }));

const velgBareArbeid = async () => {
    await svar(minst4Uker, 'Ja');
    await userEvent.click(screen.getByRole('checkbox', { name: 'Arbeid' }));
};

const velgOpplystISpeil = () =>
    userEvent.click(screen.getByRole('radio', { name: 'Saken er godt nok opplyst i Speil' }));

const bareArbeid = {
    minst4Uker: true,
    opptjeningsaktiviteter: [ApiOpptjeningsaktivitet.ARBEID],
    foreldrepengerOpptjentPåAap: null,
    yrkesaktivMinst4UkerFørUttak: null,
};

beforeEach(() => {
    mutate.mockClear();
    mutateNyAutomatisk.mockClear();
    refetch.mockClear();
    brukerrolleMock.erCoachFagkoordinatorEllerSupersaksbehandler = true;
    mockVilkårsvurderinger(automatiskIkkeOppfyltArbeidMinst4Uker);
    mockOpptjeningshistorikk([]);
    (usePostManuellOpptjeningsvurderingBehandler as Mock).mockReturnValue({
        mutate,
        isPending: false,
        isError: false,
    });
    (usePostNyAutomatiskVilkårsvurderingBehandler as Mock).mockReturnValue({
        mutate: mutateNyAutomatisk,
        isPending: false,
    });
});

describe('Opptjening', () => {
    it('henter historikk først når opptjeningsvurderingen er hentet', () => {
        mockVilkårsvurderinger(undefined, { isLoading: true, isFetching: true });
        const { rerender } = renderOpptjening(false);

        expect(useGetOpptjeningshistorikkBehandler).toHaveBeenLastCalledWith(
            'en-person',
            { skjæringstidspunkt: '2024-01-01' },
            { query: { enabled: false } },
        );

        mockVilkårsvurderinger(automatiskIkkeOppfyltArbeidMinst4Uker);
        rerender(
            <InngangsvilkårWithContent
                vilkårsgrunnlag={vilkårsgrunnlag}
                fødselsdato="1980-01-01"
                personPseudoId="en-person"
                opptjeningsvurderingId="en-id"
                readOnly={false}
                serPåTidligereBehandling={false}
            />,
        );

        expect(useGetOpptjeningshistorikkBehandler).toHaveBeenLastCalledWith(
            'en-person',
            { skjæringstidspunkt: '2024-01-01' },
            { query: { enabled: true } },
        );
    });

    it('venter med historikk mens opptjeningsvurderingen hentes på nytt', () => {
        mockVilkårsvurderinger(automatiskIkkeOppfyltArbeidMinst4Uker, { isFetching: true });
        renderOpptjening(false);

        expect(useGetOpptjeningshistorikkBehandler).toHaveBeenLastCalledWith(
            'en-person',
            { skjæringstidspunkt: '2024-01-01' },
            { query: { enabled: false } },
        );
    });

    it('henter ikke historikk når opptjeningsvurderingen feiler', () => {
        mockVilkårsvurderinger(automatiskIkkeOppfyltArbeidMinst4Uker, { isError: true });
        renderOpptjening(false);

        expect(useGetOpptjeningshistorikkBehandler).toHaveBeenLastCalledWith(
            'en-person',
            { skjæringstidspunkt: '2024-01-01' },
            { query: { enabled: false } },
        );
    });

    it('viser oppsummering av opptjeningsgrunnlaget', async () => {
        renderOpptjening(false);

        expect(within(opptjeningsvilkår()).getByText('Opptjening fra')).toBeVisible();
        expect(within(opptjeningsvilkår()).getByText('01.01.2023 (120 dager)')).toBeVisible();
    });

    it('viser vurder vilkår-knappen i produksjon', async () => {
        renderOpptjening(false);

        expect(within(opptjeningsvilkår()).getByRole('button', { name: 'Vurder vilkår' })).toBeVisible();
    });

    it('skjuler vurder vilkår-knappen når saksbehandler ikke er coach, fagkoordinator eller supersaksbehandler', async () => {
        brukerrolleMock.erCoachFagkoordinatorEllerSupersaksbehandler = false;

        renderOpptjening(false);

        expect(screen.queryByRole('button', { name: 'Vurder vilkår' })).not.toBeInTheDocument();
    });

    it('viser grunnlagsdata for automatisk vurdering', async () => {
        renderOpptjening(true);

        expect(within(opptjeningsvilkår()).getByText('Opptjening fra')).toBeVisible();
        expect(within(opptjeningsvilkår()).getByText('01.01.2023 (120 dager)')).toBeVisible();
        const automatiskVurdering = within(opptjeningsvilkår()).getByText(/Vurdert automatisk/, { selector: 'span' });
        expect(automatiskVurdering).toBeVisible();
        expect(automatiskVurdering).not.toHaveAttribute('data-sensitive');
    });

    it('lar saksbehandler vurdere et uvurdert vilkår direkte', async () => {
        renderOpptjening(false);

        await startVurdering();

        await velgBareArbeid();
        await velgOpplystISpeil();
        await userEvent.type(screen.getByRole('textbox', { name: /Begrunnelse/ }), 'Har likestilt ytelse');
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(mutate).toHaveBeenCalledWith({
            personId: 'en-person',
            data: {
                skjæringstidspunkt: '2024-01-01',
                ...bareArbeid,
                fritekstbegrunnelse: 'Har likestilt ytelse',
                journalpostId: [],
            },
        });
    });

    it('lar saksbehandler overstyre en automatisk vurdering', async () => {
        renderOpptjening(false);

        await startVurdering();

        await velgBareArbeid();
        await velgOpplystISpeil();
        await userEvent.type(screen.getByRole('textbox', { name: /Begrunnelse/ }), 'Har opptjening');
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(mutate).toHaveBeenCalledWith({
            personId: 'en-person',
            data: {
                skjæringstidspunkt: '2024-01-01',
                ...bareArbeid,
                fritekstbegrunnelse: 'Har opptjening',
                journalpostId: [],
            },
        });
    });

    it('skjuler vurder vilkår-knappen når vilkåret er automatisk oppfylt', async () => {
        mockVilkårsvurderinger(automatiskVurdertArbeidMinst4Uker);

        renderOpptjening(false);

        expect(within(opptjeningsvilkår()).queryByRole('button', { name: 'Vurder vilkår' })).not.toBeInTheDocument();
    });

    it('skjuler vurder vilkår-knappen når vilkåret er overført fra Spleis som oppfylt', async () => {
        mockVilkårsvurderinger(overførtFraSpleis);

        renderOpptjening(false);

        expect(within(opptjeningsvilkår()).queryByRole('button', { name: 'Vurder vilkår' })).not.toBeInTheDocument();
    });

    it('viser vurder vilkår-knappen når saksbehandler har vurdert vilkåret som oppfylt', async () => {
        mockVilkårsvurderinger(saksbehandlerOppfyltArbeidMinst4Uker);

        renderOpptjening(false);

        expect(within(opptjeningsvilkår()).getByRole('button', { name: 'Vurder vilkår' })).toBeVisible();
        expect(within(opptjeningsvilkår()).getByText('S123456')).toHaveAttribute('data-sensitive');
    });

    it('forhåndsvelger ikke svar fra eksisterende vurdering', async () => {
        mockVilkårsvurderinger(saksbehandlerOppfyltArbeidMinst4Uker);

        renderOpptjening(false);
        await startVurdering();

        expect(screen.getByRole('radio', { name: 'Ja' })).not.toBeChecked();
        expect(screen.getByRole('radio', { name: 'Nei' })).not.toBeChecked();
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

    it('viser journalpost-ID-feltet bare når saksbehandler velger å legge til journalpost-ID', async () => {
        renderOpptjening(false);

        await startVurdering();

        expect(screen.getByRole('radio', { name: 'Saken er godt nok opplyst i Speil' })).not.toBeChecked();
        expect(screen.getByRole('radio', { name: 'Legg til journalpost-ID' })).not.toBeChecked();
        expect(screen.queryByRole('textbox', { name: 'Journalpost-ID' })).not.toBeInTheDocument();

        await userEvent.click(screen.getByRole('radio', { name: 'Legg til journalpost-ID' }));

        expect(screen.getByRole('textbox', { name: 'Journalpost-ID' })).toBeVisible();
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

    it('viser validering når dokument-id inneholder andre tegn enn tall', async () => {
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

    it('viser validering når dokument-id er lengre enn 11 siffer', async () => {
        renderOpptjening(false);

        await startVurdering();
        await velgBareArbeid();
        await userEvent.click(screen.getByRole('radio', { name: 'Legg til journalpost-ID' }));
        await userEvent.type(screen.getByRole('textbox', { name: 'Journalpost-ID' }), '123456789012');
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

    it('markerer vilkåret som vurderes', async () => {
        renderOpptjening(false);

        expect(opptjeningsvilkår()).not.toHaveClass('bg-ax-bg-accent-soft');

        await startVurdering();

        expect(opptjeningsvilkår()).toHaveClass('bg-ax-bg-accent-soft');
    });

    it('viser vurder vilkår-knappen ved siden av vurder automatisk på nytt uten egen vilkårsrad', () => {
        mockVilkårsvurderinger(ingenAutomatiskeVurderinger);
        renderOpptjening(false);

        const knapper = within(opptjeningsvilkår()).getAllByRole('button');
        const vurderVilkår = within(opptjeningsvilkår()).getByRole('button', { name: 'Vurder vilkår' });
        const vurderPåNytt = within(opptjeningsvilkår()).getByRole('button', { name: /Vurder automatisk på nytt/ });
        expect(knapper.indexOf(vurderVilkår)).toBe(knapper.indexOf(vurderPåNytt) + 1);
        expect(within(opptjeningsvilkår()).queryByRole('list')).not.toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Arbeid og likestilte ytelser' })).not.toBeInTheDocument();
    });

    it('validerer at første spørsmål og begrunnelse er besvart', async () => {
        mockVilkårsvurderinger(ingenAutomatiskeVurderinger);
        renderOpptjening(false);

        await startVurdering();
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(mutate).not.toHaveBeenCalled();
        expect(await screen.findByText('Svar ja eller nei')).toBeVisible();
        expect(screen.getByText('Fyll inn begrunnelse')).toBeVisible();
    });

    it('krever at saksbehandler velger om journalpost-ID skal legges til', async () => {
        renderOpptjening(false);

        await startVurdering();
        await velgBareArbeid();
        await userEvent.type(screen.getByRole('textbox', { name: /Begrunnelse/ }), 'Har jobbet');
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(await screen.findByText('Velg om du vil legge til journalpost-ID')).toBeVisible();
        expect(mutate).not.toHaveBeenCalled();
    });

    it('lar saksbehandler avbryte en vurderingsøkt', async () => {
        renderOpptjening(false);

        await startVurdering();

        expect(screen.getByRole('radiogroup', { name: minst4Uker })).toBeVisible();

        await userEvent.click(screen.getByRole('button', { name: 'Avbryt' }));

        expect(screen.queryByRole('radiogroup', { name: minst4Uker })).not.toBeInTheDocument();
        expect(within(opptjeningsvilkår()).getByRole('button', { name: 'Vurder vilkår' })).toBeVisible();
    });

    it('skjuler vurderingsknappene når saken er read only', async () => {
        renderOpptjening(true);

        expect(screen.queryByRole('button', { name: 'Vurder vilkår' })).not.toBeInTheDocument();
    });

    it('skjuler vurderingsknappene når saksbehandler ser på en tidligere behandling', async () => {
        renderOpptjening(false, true);

        expect(await screen.findByRole('region', { name: 'Opptjeningstid' })).toBeVisible();
        expect(screen.queryByRole('button', { name: 'Vurder vilkår' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Vurder automatisk på nytt' })).not.toBeInTheDocument();
    });

    it('lukker vurderingsskjemaet når saksbehandler navigerer til en tidligere behandling', async () => {
        const { rerender } = renderOpptjening(false);

        await startVurdering();
        expect(screen.getByRole('textbox', { name: /Begrunnelse/ })).toBeVisible();

        rerender(medOpptjening(false, true));

        expect(screen.queryByRole('textbox', { name: /Begrunnelse/ })).not.toBeInTheDocument();
    });

    it('viser "Vurdert i Infotrygd" uten enkeltvilkår når kravet er overført fra Infotrygd', () => {
        mockVilkårsvurderinger(overførtFraInfotrygd);

        renderOpptjening(false);

        const opptjening = screen.getByRole('region', { name: /^Opptjeningstid/ });
        expect(within(opptjening).getByText('Vurdert i Infotrygd')).toBeVisible();
        expect(within(opptjening).queryByRole('list')).not.toBeInTheDocument();
        expect(within(opptjening).queryByRole('button', { name: 'Vurder vilkår' })).not.toBeInTheDocument();
    });

    it('viser vurderinger overført fra Spleis på samme måte som vurderinger fra sp-vilkårsprøving', async () => {
        mockVilkårsvurderinger(overførtFraSpleis);

        renderOpptjening(false);

        expect(within(opptjeningsvilkår()).getByText(/Vurdert automatisk/, { selector: 'span' })).toHaveAttribute(
            'data-color',
            'neutral',
        );
    });

    it('viser feilmelding når vilkårsvurderingen ikke kan hentes', async () => {
        mockVilkårsvurderinger(undefined, { isError: true });

        renderOpptjening(false);

        expect(screen.getByText('Kunne ikke hente opptjeningsvurderingen.')).toBeVisible();
    });

    it('henter vilkårsvurderingen på nytt når saksbehandler trykker «Prøv igjen»', async () => {
        mockVilkårsvurderinger(undefined, { isError: true });

        renderOpptjening(false);
        await userEvent.click(screen.getByRole('button', { name: 'Prøv igjen' }));

        expect(refetch).toHaveBeenCalledTimes(1);
    });
    describe('endringslogg', () => {
        const automatiskInnslag: ApiOpptjeningshistorikkInnslag = {
            vurdertTidspunkt: '2025-04-01T10:03:00.000Z',
            opptjeningsvurdering: medId(automatiskIkkeOppfyltArbeidMinst4Uker, 'opptjeningsvurdering-1', {
                id: 'vilkårsvurdering-1',
                vurdertTidspunkt: '2025-04-01T10:03:00.000Z',
            }),
        };

        const manuellInnslag: ApiOpptjeningshistorikkInnslag = {
            vurdertTidspunkt: '2025-07-25T12:21:00.000Z',
            opptjeningsvurdering: medId(saksbehandlerOppfyltArbeidMinst4Uker, 'opptjeningsvurdering-2', {
                id: 'vilkårsvurdering-2',
                vurdertTidspunkt: '2025-07-25T12:21:00.000Z',
            }),
        };

        function likestiltInnslag(): ApiOpptjeningshistorikkInnslag {
            const krav = medLikestiltYtelse([
                [ApiVilkårskode.OPPTJENING_LIKESTILT_YTELSE_MINST_4_UKER, ApiUtfall.OPPFYLT],
                [ApiVilkårskode.OPPTJENING_FORELDREPENGER_IKKE_OPPTJENT_PA_AAP, ApiUtfall.IKKE_OPPFYLT],
                [ApiVilkårskode.OPPTJENING_YRKESAKTIV_MINST_4_UKER_FOR_UTTAK_AV_FORELDREPENGER, ApiUtfall.OPPFYLT],
            ]).krav[0]!;
            if (!('vurderinger' in krav)) throw new Error('Forventet krav med enkeltvurderinger');
            return {
                vurdertTidspunkt: '2025-07-25T12:21:00.000Z',
                opptjeningsvurdering: {
                    ...krav,
                    id: 'opptjeningsvurdering-likestilt',
                    vurderinger: krav.vurderinger.map((vurdering) => ({
                        ...vurdering,
                        vurdertTidspunkt: '2025-07-25T12:21:00.000Z',
                    })),
                },
            };
        }

        const endringsloggknapp = () => screen.queryByRole('button', { name: 'Vis endringslogg for opptjeningstid' });
        const endringsloggrader = () => within(screen.getByRole('dialog')).getAllByRole('row').slice(1);

        it('viser ikke endringslogg når det bare finnes én opptjeningsvurdering', () => {
            mockOpptjeningshistorikk([automatiskInnslag]);

            renderOpptjening(true);

            expect(endringsloggknapp()).not.toBeInTheDocument();
        });

        it('viser alle vurderingene, nyeste først, når det finnes flere opptjeningsvurderinger', async () => {
            mockOpptjeningshistorikk([automatiskInnslag, manuellInnslag]);

            renderOpptjening(true);
            await userEvent.click(endringsloggknapp()!);

            const [nyeste, eldste] = endringsloggrader();
            expect(endringsloggrader()).toHaveLength(2);
            expect(within(nyeste!).getByText(/^25.07.2025/)).toBeVisible();
            expect(within(nyeste!).getByText('Opptjeningstid')).toBeVisible();
            expect(within(nyeste!).getByText('Oppfylt')).toBeVisible();
            expect(within(nyeste!).getByText('Har likestilt ytelse')).toBeVisible();
            expect(within(nyeste!).getByText('S123456')).toBeVisible();
            expect(within(eldste!).getByText('Ikke oppfylt')).toBeVisible();
            expect(within(eldste!).getByText('Automatisk')).toBeVisible();
        });

        it('viser én endringsloggrad for en vurdering av likestilt ytelse', async () => {
            mockOpptjeningshistorikk([automatiskInnslag, likestiltInnslag()]);

            renderOpptjening(true);
            await userEvent.click(endringsloggknapp()!);

            expect(endringsloggrader()).toHaveLength(2);
            expect(within(endringsloggrader()[0]!).getByText('Opptjeningstid')).toBeVisible();
        });

        it('viser svarene og hjemmelen når likestilt ytelse-raden ekspanderes', async () => {
            mockOpptjeningshistorikk([automatiskInnslag, likestiltInnslag()]);

            renderOpptjening(false);
            await userEvent.click(endringsloggknapp()!);
            const dialog = screen.getByRole('dialog');
            await userEvent.click(within(endringsloggrader()[0]!).getByRole('button'));

            const detaljer = within(dialog);
            expect(detaljer.getByText('Foreldrepenger')).toBeVisible();
            expect(detaljer.getByText('Foreldrepenger opptjent på AAP').nextSibling).toHaveTextContent('Ja');
            expect(detaljer.getByText('Yrkesaktiv 4 uker før uttak').nextSibling).toHaveTextContent('Ja');
            expect(detaljer.getByText('§ 8-2 andre ledd tredje punktum')).toBeVisible();
            expect(detaljer.getByText('Hadde FP etter jobb', { selector: 'dd' })).toBeVisible();
        });

        it('viser begrunnelsen til en manuell vurdering når raden ekspanderes', async () => {
            mockOpptjeningshistorikk([automatiskInnslag, manuellInnslag]);

            renderOpptjening(false);
            await userEvent.click(endringsloggknapp()!);
            const dialog = screen.getByRole('dialog');
            await userEvent.click(within(endringsloggrader()[0]!).getByRole('button'));

            expect(within(dialog).getByText('Begrunnelse', { selector: 'dt' }).nextSibling).toHaveTextContent(
                'Har likestilt ytelse',
            );
        });

        it('viser vilkårsvurderingen uten vurder vilkår-knapp når raden ekspanderes', async () => {
            mockOpptjeningshistorikk([automatiskInnslag, manuellInnslag]);

            renderOpptjening(false);
            await userEvent.click(endringsloggknapp()!);
            const dialog = screen.getByRole('dialog');
            await userEvent.click(within(endringsloggrader()[1]!).getByRole('button'));

            expect(within(dialog).getByText(/^Vurdert automatisk/)).toBeVisible();
            expect(
                within(dialog).queryByRole('button', { name: 'Vurder vilkår', hidden: true }),
            ).not.toBeInTheDocument();
        });

        it('kan ikke ekspandere opptjeningsvurderinger fra Infotrygd', async () => {
            mockOpptjeningshistorikk([
                manuellInnslag,
                { vurdertTidspunkt: '2020-01-01T10:00:00.000Z', opptjeningsvurdering: overførtFraInfotrygd.krav[0]! },
            ]);

            renderOpptjening(true);
            await userEvent.click(endringsloggknapp()!);

            expect(within(endringsloggrader()[0]!).getByRole('button')).toBeEnabled();
            expect(within(endringsloggrader()[1]!).queryByRole('button')).not.toBeInTheDocument();
        });

        it('viser en videreført vilkårsvurdering bare én gang', async () => {
            const videreført: ApiOpptjeningshistorikkInnslag = {
                ...manuellInnslag,
                opptjeningsvurdering: { ...manuellInnslag.opptjeningsvurdering, id: 'opptjeningsvurdering-3' },
            };
            mockOpptjeningshistorikk([videreført, manuellInnslag]);

            renderOpptjening(true);
            await userEvent.click(endringsloggknapp()!);

            expect(endringsloggrader()).toHaveLength(1);
        });

        it('viser opptjeningsvurderinger fra Infotrygd uten enkeltvurderinger', async () => {
            mockOpptjeningshistorikk([
                manuellInnslag,
                { vurdertTidspunkt: '2020-01-01T10:00:00.000Z', opptjeningsvurdering: overførtFraInfotrygd.krav[0]! },
            ]);

            renderOpptjening(true);
            await userEvent.click(endringsloggknapp()!);

            const infotrygdrad = endringsloggrader()[1]!;
            expect(within(infotrygdrad).getByText('Opptjeningstid')).toBeVisible();
            expect(within(infotrygdrad).getByText('Infotrygd')).toBeVisible();
        });
    });

    describe('vurder automatisk på nytt', () => {
        const vurderAutomatiskPåNyttKnapp = () => screen.queryByRole('button', { name: 'Vurder automatisk på nytt' });

        async function bekreftVurderAutomatiskPåNytt() {
            await userEvent.click(vurderAutomatiskPåNyttKnapp()!);
            await userEvent.click(await screen.findByRole('button', { name: 'Ja' }));
        }

        it('ber om bekreftelse før ny automatisk vurdering', async () => {
            renderOpptjening(false);

            await userEvent.click(vurderAutomatiskPåNyttKnapp()!);

            expect(await screen.findByRole('dialog', { name: 'Er du sikker?' })).toBeVisible();
            expect(mutateNyAutomatisk).not.toHaveBeenCalled();
        });

        it('sender ikke ny automatisk vurdering når saksbehandler avbryter', async () => {
            renderOpptjening(false);

            await userEvent.click(vurderAutomatiskPåNyttKnapp()!);
            await userEvent.click(await screen.findByRole('button', { name: 'Avbryt' }));

            await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
            expect(mutateNyAutomatisk).not.toHaveBeenCalled();
        });

        it('ber om ny automatisk vurdering for skjæringstidspunktet', async () => {
            renderOpptjening(false);

            await bekreftVurderAutomatiskPåNytt();

            expect(mutateNyAutomatisk).toHaveBeenCalledWith(
                { personId: 'en-person', data: { skjæringstidspunkt: '2024-01-01' } },
                expect.anything(),
            );
        });

        it('invaliderer historikken når grunnlaget er reberegnet', async () => {
            const invalidateQueries = vi.spyOn(QueryClient.prototype, 'invalidateQueries');
            try {
                renderOpptjening(false);

                await bekreftVurderAutomatiskPåNytt();

                const [variables, options] = mutateNyAutomatisk.mock.calls[0]!;
                act(() =>
                    options.onSuccess?.(
                        { status: ApiNyAutomatiskVilkårsvurderingStatus.VENTER_PÅ_GRUNNLAG },
                        variables,
                        undefined,
                        undefined,
                    ),
                );

                expect(invalidateQueries).not.toHaveBeenCalledWith({
                    queryKey: getGetOpptjeningshistorikkBehandlerQueryKey('en-person'),
                });

                act(() =>
                    serverSentEventMock.onEvent?.({
                        event: ApiServerSentEventEvent.NY_SAKSBEHANDLEROPPGAVE,
                        data: null,
                    }),
                );

                expect(invalidateQueries).toHaveBeenCalledWith({
                    queryKey: getGetOpptjeningshistorikkBehandlerQueryKey('en-person'),
                });
            } finally {
                invalidateQueries.mockRestore();
            }
        });

        it('invaliderer hele opptjeningen når grunnlaget er reberegnet', async () => {
            const invalidateQueries = vi.spyOn(QueryClient.prototype, 'invalidateQueries');
            try {
                renderOpptjening(false);

                await bekreftVurderAutomatiskPåNytt();

                const [variables, options] = mutateNyAutomatisk.mock.calls[0]!;
                act(() =>
                    options.onSuccess?.(
                        { status: ApiNyAutomatiskVilkårsvurderingStatus.VENTER_PÅ_GRUNNLAG },
                        variables,
                        undefined,
                        undefined,
                    ),
                );
                act(() =>
                    serverSentEventMock.onEvent?.({
                        event: ApiServerSentEventEvent.NY_SAKSBEHANDLEROPPGAVE,
                        data: null,
                    }),
                );

                forventOpptjeningenInvalidert(invalidateQueries);
            } finally {
                invalidateQueries.mockRestore();
            }
        });

        it('invaliderer hele opptjeningen når opptjeningen er vurdert på nytt', async () => {
            const invalidateQueries = vi.spyOn(QueryClient.prototype, 'invalidateQueries');
            try {
                renderOpptjening(false);

                await bekreftVurderAutomatiskPåNytt();

                const [variables, options] = mutateNyAutomatisk.mock.calls[0]!;
                act(() =>
                    options.onSuccess?.(
                        {
                            status: ApiNyAutomatiskVilkårsvurderingStatus.VURDERT,
                            opptjeningsvurderingId: 'ny-id',
                        },
                        variables,
                        undefined,
                        undefined,
                    ),
                );

                forventOpptjeningenInvalidert(invalidateQueries);
            } finally {
                invalidateQueries.mockRestore();
            }
        });

        it('henter nyeste opptjeningsvurdering fra spleis selv om den er overstyrt tidligere', async () => {
            const { rerender } = renderOpptjening(false);

            await bekreftVurderAutomatiskPåNytt();
            const [variables, options] = mutateNyAutomatisk.mock.calls[0]!;
            act(() =>
                options.onSuccess?.(
                    { status: ApiNyAutomatiskVilkårsvurderingStatus.VURDERT, opptjeningsvurderingId: 'overstyrt-id' },
                    variables,
                    undefined,
                    undefined,
                ),
            );

            expect(useGetVilkårsvurderingerForPersonBehandler).toHaveBeenLastCalledWith('en-person', {
                opptjeningsvurderingId: 'overstyrt-id',
            });

            rerender(
                <InngangsvilkårWithContent
                    vilkårsgrunnlag={vilkårsgrunnlag}
                    fødselsdato="1980-01-01"
                    personPseudoId="en-person"
                    opptjeningsvurderingId="ny-id-fra-spleis"
                    readOnly={false}
                    serPåTidligereBehandling={false}
                />,
            );

            expect(useGetVilkårsvurderingerForPersonBehandler).toHaveBeenLastCalledWith('en-person', {
                opptjeningsvurderingId: 'ny-id-fra-spleis',
            });
        });

        it('er deaktivert mens visningen oppdateres', async () => {
            renderOpptjening(false);

            await bekreftVurderAutomatiskPåNytt();
            const [variables, options] = mutateNyAutomatisk.mock.calls[0]!;
            act(() =>
                options.onSuccess?.(
                    { status: ApiNyAutomatiskVilkårsvurderingStatus.VENTER_PÅ_GRUNNLAG },
                    variables,
                    undefined,
                    undefined,
                ),
            );

            expect(vurderAutomatiskPåNyttKnapp()).toBeDisabled();

            act(() =>
                serverSentEventMock.onEvent?.({
                    event: ApiServerSentEventEvent.NY_SAKSBEHANDLEROPPGAVE,
                    data: null,
                }),
            );

            expect(vurderAutomatiskPåNyttKnapp()).toBeEnabled();
        });

        it('vises i produksjon', () => {
            renderOpptjening(false);

            expect(vurderAutomatiskPåNyttKnapp()).toBeVisible();
        });

        it('skjules når saksbehandler ikke er coach, fagkoordinator eller supersaksbehandler', () => {
            brukerrolleMock.erCoachFagkoordinatorEllerSupersaksbehandler = false;

            renderOpptjening(false);

            expect(vurderAutomatiskPåNyttKnapp()).not.toBeInTheDocument();
        });

        it('skjules når oppgaven er skrivebeskyttet', () => {
            renderOpptjening(true);

            expect(vurderAutomatiskPåNyttKnapp()).not.toBeInTheDocument();
        });
    });

    describe('samlet skjema', () => {
        const opptjentPåAap = /opptjent på grunnlag av arbeidsavklaringspenger/;
        const yrkesaktiv = /sammenhengende yrkesaktiv/;
        const aktiviteter = /Hvilken likestilt ytelse\/arbeid/;

        afterEach(() => {
            featureToggleMock.kanVurdereLikestilteYtelser = true;
        });

        it('viser arbeid først blant aktivitetene', async () => {
            renderOpptjening(false);
            await startVurdering();
            await svar(minst4Uker, 'Ja');

            const valg = within(screen.getByRole('group', { name: aktiviteter }))
                .getAllByRole('checkbox')
                .map((checkbox) => checkbox.getAttribute('value'));
            expect(valg).toEqual([
                ApiOpptjeningsaktivitet.ARBEID,
                ApiOpptjeningsaktivitet.DAGPENGER,
                ApiOpptjeningsaktivitet.SYKEPENGER,
                ApiOpptjeningsaktivitet.KAPITTEL_9,
                ApiOpptjeningsaktivitet.FORELDREPENGER,
                ApiOpptjeningsaktivitet.SVANGERSKAPSPENGER,
            ]);
        });

        it('viser bare arbeid når likestilte ytelser ikke er slått på i miljøet', async () => {
            featureToggleMock.kanVurdereLikestilteYtelser = false;

            renderOpptjening(false);
            await startVurdering();
            await svar(minst4Uker, 'Ja');

            expect(screen.getByRole('checkbox', { name: 'Arbeid' })).toBeVisible();
            expect(screen.queryByRole('checkbox', { name: 'Sykepenger (kap. 8)' })).not.toBeInTheDocument();
        });

        it('viser vilkåret som ikke vurdert når ingenting er vurdert', () => {
            mockVilkårsvurderinger(ingenAutomatiskeVurderinger);

            renderOpptjening(false);

            expect(within(opptjeningsvilkår()).getByText('Ikke vurdert', { selector: 'span' })).toBeVisible();
        });

        it('viser bare oppfølgingsspørsmålene som er aktuelle', async () => {
            renderOpptjening(false);
            await startVurdering();

            expect(screen.queryByRole('group', { name: aktiviteter })).not.toBeInTheDocument();

            await svar(minst4Uker, 'Ja');
            expect(screen.getByRole('group', { name: aktiviteter })).toBeVisible();
            expect(screen.queryByRole('radiogroup', { name: opptjentPåAap })).not.toBeInTheDocument();

            await userEvent.click(screen.getByRole('checkbox', { name: 'Foreldrepenger (kap. 14)' }));
            expect(screen.getByRole('radiogroup', { name: opptjentPåAap })).toBeVisible();
            expect(screen.queryByRole('radiogroup', { name: yrkesaktiv })).not.toBeInTheDocument();

            await svar(opptjentPåAap, 'Ja');
            expect(screen.getByRole('radiogroup', { name: yrkesaktiv })).toBeVisible();
        });

        it('sender bare arbeid når saksbehandler bare velger arbeid', async () => {
            renderOpptjening(false);
            await startVurdering();

            await velgBareArbeid();
            expect(screen.getByText('Vilkåret er oppfylt')).toBeVisible();
            await velgOpplystISpeil();
            await userEvent.type(screen.getByRole('textbox', { name: /Begrunnelse/ }), 'Har jobbet');
            await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

            expect(mutate).toHaveBeenCalledWith({
                personId: 'en-person',
                data: {
                    skjæringstidspunkt: '2024-01-01',
                    ...bareArbeid,
                    fritekstbegrunnelse: 'Har jobbet',
                    journalpostId: [],
                },
            });
        });

        it('sender arbeid sammen med likestilte ytelser', async () => {
            renderOpptjening(false);
            await startVurdering();

            await svar(minst4Uker, 'Ja');
            await userEvent.click(screen.getByRole('checkbox', { name: 'Arbeid' }));
            await userEvent.click(screen.getByRole('checkbox', { name: 'Sykepenger (kap. 8)' }));
            await userEvent.click(screen.getByRole('checkbox', { name: 'Foreldrepenger (kap. 14)' }));
            await svar(opptjentPåAap, 'Ja');
            await svar(yrkesaktiv, 'Ja');
            expect(screen.getByText('Vilkåret er oppfylt')).toBeVisible();
            await velgOpplystISpeil();
            await userEvent.type(screen.getByRole('textbox', { name: /Begrunnelse/ }), 'Hadde FP etter jobb');
            await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

            expect(mutate).toHaveBeenCalledWith({
                personId: 'en-person',
                data: {
                    skjæringstidspunkt: '2024-01-01',
                    minst4Uker: true,
                    opptjeningsaktiviteter: [
                        ApiOpptjeningsaktivitet.ARBEID,
                        ApiOpptjeningsaktivitet.SYKEPENGER,
                        ApiOpptjeningsaktivitet.FORELDREPENGER,
                    ],
                    foreldrepengerOpptjentPåAap: true,
                    yrkesaktivMinst4UkerFørUttak: true,
                    fritekstbegrunnelse: 'Hadde FP etter jobb',
                    journalpostId: [],
                },
            });
        });

        it('kan ikke lagre når søkeren ikke har hatt opptjening i minst 4 uker', async () => {
            renderOpptjening(false);
            await startVurdering();

            await svar(minst4Uker, 'Nei');

            expect(
                screen.getByText('Det er ennå ikke støtte for å manuelt vurdere vilkåret til ikke oppfylt'),
            ).toBeVisible();
            expect(screen.queryByRole('textbox', { name: /Begrunnelse/ })).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: 'Lagre' })).not.toBeInTheDocument();
        });

        it('viser advarsel når foreldrepenger opptjent på AAP mangler yrkesaktivitet før uttak', async () => {
            renderOpptjening(false);
            await startVurdering();

            await svar(minst4Uker, 'Ja');
            await userEvent.click(screen.getByRole('checkbox', { name: 'Foreldrepenger (kap. 14)' }));
            await svar(opptjentPåAap, 'Ja');
            await svar(yrkesaktiv, 'Nei');

            expect(screen.getByText('Vilkåret er ikke oppfylt')).toBeVisible();
            expect(screen.getByRole('button', { name: 'Lagre' })).toBeVisible();
        });

        it('krever minst én aktivitet', async () => {
            renderOpptjening(false);
            await startVurdering();

            await svar(minst4Uker, 'Ja');
            await userEvent.type(screen.getByRole('textbox', { name: /Begrunnelse/ }), 'Begrunnelse');
            await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

            expect(await screen.findByText('Velg minst én')).toBeVisible();
            expect(mutate).not.toHaveBeenCalled();
        });

        it('viser utfallet etter andre ledd uten svar og hjemmel etter lagring', () => {
            mockVilkårsvurderinger(
                medLikestiltYtelse([
                    [ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER, ApiUtfall.IKKE_OPPFYLT],
                    [ApiVilkårskode.OPPTJENING_LIKESTILT_YTELSE_MINST_4_UKER, ApiUtfall.OPPFYLT],
                    [ApiVilkårskode.OPPTJENING_FORELDREPENGER_IKKE_OPPTJENT_PA_AAP, ApiUtfall.IKKE_OPPFYLT],
                    [ApiVilkårskode.OPPTJENING_YRKESAKTIV_MINST_4_UKER_FOR_UTTAK_AV_FORELDREPENGER, ApiUtfall.OPPFYLT],
                ]),
            );

            renderOpptjening(false);

            const rad = within(opptjeningsvilkår());
            expect(rad.getByTitle('Oppfylt')).toBeInTheDocument();
            expect(rad.getByRole('button', { name: 'Vurder vilkår' })).toBeVisible();
            expect(rad.queryByText('Foreldrepenger opptjent på AAP')).not.toBeInTheDocument();
            expect(rad.queryByText('§ 8-2 andre ledd tredje punktum')).not.toBeInTheDocument();
            expect(rad.queryByText('Hadde FP etter jobb')).not.toBeInTheDocument();
        });
    });
});

function medLikestiltYtelse(vurderinger: [ApiVilkårskode, ApiUtfall][]): ApiVilkårsvurderingerForPersonResponse {
    return {
        skjæringstidspunkt: '2024-01-01',
        krav: [
            {
                id: 'krav-likestilt',
                kravkode: ApiKravkode.OPPTJENING,
                opptjeningOk: true,
                avgjørendeVilkårskode: null,
                kravkilde: ApiKravkilde.VURDERT_I_SP_VILKARSPROVING,
                vurderinger: vurderinger.map(([vilkårskode, utfall]) => ({
                    id: vilkårskode,
                    vilkårskode,
                    utfall,
                    vurdertTidspunkt: '2024-01-03T10:00:00.000Z',
                    lovreferanse: { lov: 'folketrygdloven', paragraf: '8-2', avsnitt: 2, iKraftFra: '2018-01-01' },
                    kilde: {
                        ident: 'S123456',
                        fritekstbegrunnelse: 'Hadde FP etter jobb',
                        journalpostId: [],
                        opptjeningsaktiviteter: [ApiOpptjeningsaktivitet.FORELDREPENGER],
                        kildetype: ApiKildetype.SAKSBEHANDLER,
                    },
                })),
            },
        ],
    };
}

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

function medId(
    response: ApiVilkårsvurderingerForPersonResponse,
    opptjeningsvurderingId: string,
    vurdering: Partial<ApiVilkårsvurdering>,
): ApiOpptjeningshistorikkInnslag['opptjeningsvurdering'] {
    const krav = response.krav[0]!;
    if (!('vurderinger' in krav)) throw new Error('Forventet krav med enkeltvurderinger');
    return { ...krav, id: opptjeningsvurderingId, vurderinger: [{ ...krav.vurderinger[0]!, ...vurdering }] };
}

function forventOpptjeningenInvalidert(invalidateQueries: Mock) {
    [
        getGetVilkårsvurderingerForPersonBehandlerQueryKey('en-person'),
        getGetOpptjeningshistorikkBehandlerQueryKey('en-person'),
        getGetSaksbehandlerhandlingerForPersonQueryKey('en-person'),
    ].forEach((queryKey) => expect(invalidateQueries).toHaveBeenCalledWith({ queryKey }));
}
