import React from 'react';

import {
    ApiKildetype,
    ApiKravkode,
    ApiMedlemskapsstatus,
    ApiVilkårsvurderingerForPersonResponse,
} from '@io/rest/generated/medlemskap/medlemskap.schemas';
import {
    ApiVilkårsgrunnlagInfotrygdV2,
    ApiVilkårsgrunnlagSpleisV2,
    ApiVilkårsgrunnlagVurdering,
} from '@io/rest/generated/spesialist.schemas';
import { render, screen, within } from '@test-utils';

import { InngangsvilkårWithContent } from './Inngangsvilkår';

vi.mock('@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger')>()),
    useGetVilkårsvurderingerForPersonBehandler: () => ({ data: undefined, isLoading: true, isError: false }),
    useGetOpptjeningshistorikkBehandler: () => ({ data: undefined, isLoading: true, isError: false }),
}));

const medlemskapQuery = vi.hoisted(() => ({
    kall: [] as { medlemskapsvurderingId: string; enabled: boolean | undefined }[],
    data: undefined as ApiVilkårsvurderingerForPersonResponse | undefined,
}));

vi.mock('@io/rest/generated/medlemskap/vilkarsvurderinger/vilkarsvurderinger', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@io/rest/generated/medlemskap/vilkarsvurderinger/vilkarsvurderinger')>()),
    useGetVilkårsvurderingerForPersonBehandler: (
        _personId: string,
        params: { medlemskapsvurderingId: string },
        options?: { query?: { enabled?: boolean } },
    ) => {
        medlemskapQuery.kall.push({
            medlemskapsvurderingId: params.medlemskapsvurderingId,
            enabled: options?.query?.enabled,
        });
        return { data: medlemskapQuery.data, isLoading: false, isError: false, refetch: vi.fn() };
    },
}));

const opptjeningProps = {
    personPseudoId: 'en-person',
    opptjeningsvurderingId: 'en-id',
    readOnly: false,
    serPåTidligereBehandling: false,
};

const getVilkårsgrunnlagSpleis = (
    // TODO: Erstatte global type med query type
    overrides?: Partial<ApiVilkårsgrunnlagSpleisV2>,
): ApiVilkårsgrunnlagSpleisV2 => ({
    type: 'ApiVilkårsgrunnlagSpleisV2',
    id: 'en-id',
    antallOpptjeningsdagerErMinst: 100,
    arbeidsgiverrefusjoner: [],
    grunnbelop: 100000,
    inntekter: [],
    vurderingAvKravOmMedlemskap: ApiVilkårsgrunnlagVurdering.OPPFYLT,
    oppfyllerKravOmMinstelonn: true,
    oppfyllerKravOmOpptjening: true,
    opptjeningFra: '2000-01-01',
    opptjeningsvurderingId: 'en-opptjeningsvurdering-id',
    skjaeringstidspunkt: '2022-01-01',
    sykepengegrunnlag: 1234567,
    beregningsgrunnlag: '1234567',
    forsikringsvurderingId: null,
    avviksvurdering: {
        avviksprosent: '0',
        beregningsgrunnlag: '1234567',
        sammenligningsgrunnlag: '1234567',
    },
    skjonnsmessigFastsattAarlig: null,
    sykepengegrunnlagsgrense: {
        grunnbelop: 106399,
        grense: 6 * 106399,
        virkningstidspunkt: '2021-05-01',
    },
    ...overrides,
});

const getVilkårsgrunnlagInfotrygd = (): ApiVilkårsgrunnlagInfotrygdV2 => ({
    type: 'ApiVilkårsgrunnlagInfotrygdV2',
    id: 'en-id',
    arbeidsgiverrefusjoner: [],
    inntekter: [],
    skjaeringstidspunkt: '2022-01-01',
    sykepengegrunnlag: 1234567,
    omregnetArsinntekt: 1234567,
    opptjeningsvurderingId: 'en-opptjeningsvurdering-id',
});
describe('Inngangsvilkår', () => {
    it('rendrer opptjening, sykepengegrunnlag og medlemskap', () => {
        render(
            <InngangsvilkårWithContent
                vilkårsgrunnlag={getVilkårsgrunnlagSpleis()}
                fødselsdato="1900-01-01"
                {...opptjeningProps}
            />,
        );

        expect(screen.getByRole('region', { name: 'Opptjeningstid' })).toBeVisible();

        const sykepengegrunnlag = screen.getByRole('region', { name: 'Krav til minste sykepengegrunnlag' });
        expect(within(sykepengegrunnlag).getByText('Krav til minste sykepengegrunnlag')).toBeVisible();
        expect(within(sykepengegrunnlag).getByText('Oppfylt', { selector: '.aksel-tag' })).toBeVisible();

        const medlemskap = screen.getByRole('region', { name: 'Lovvalg og medlemskap' });
        expect(within(medlemskap).getByText('Lovvalg og medlemskap')).toBeVisible();
        expect(within(medlemskap).getByText('Oppfylt', { selector: '.aksel-tag' })).toBeVisible();
    });

    it('viser ikke oppfylt/ikke vurdert-utfall for sykepengegrunnlag og medlemskap', () => {
        render(
            <InngangsvilkårWithContent
                vilkårsgrunnlag={getVilkårsgrunnlagSpleis({
                    oppfyllerKravOmMinstelonn: false,
                    vurderingAvKravOmMedlemskap: ApiVilkårsgrunnlagVurdering.IKKE_VURDERT,
                })}
                fødselsdato="1900-01-01"
                {...opptjeningProps}
            />,
        );

        const sykepengegrunnlag = screen.getByRole('region', { name: 'Krav til minste sykepengegrunnlag' });
        expect(within(sykepengegrunnlag).getByText('Ikke oppfylt', { selector: '.aksel-tag' })).toBeVisible();

        const medlemskap = screen.getByRole('region', { name: 'Lovvalg og medlemskap' });
        expect(within(medlemskap).getByText('Ikke vurdert', { selector: '.aksel-tag' })).toBeVisible();
    });

    it('viser "Vurdert i Infotrygd" som utfall-tag når vilkårsgrunnlaget er fra Infotrygd', () => {
        render(
            <InngangsvilkårWithContent
                vilkårsgrunnlag={getVilkårsgrunnlagInfotrygd()}
                fødselsdato="1900-01-01"
                {...opptjeningProps}
            />,
        );

        const sykepengegrunnlag = screen.getByRole('region', { name: 'Krav til minste sykepengegrunnlag' });
        expect(within(sykepengegrunnlag).getByText('Vurdert i Infotrygd')).toBeVisible();

        const medlemskap = screen.getByRole('region', { name: 'Lovvalg og medlemskap' });
        expect(within(medlemskap).getByText('Vurdert i Infotrygd')).toBeVisible();
    });

    describe('ny medlemskapsvisning', () => {
        beforeEach(() => {
            medlemskapQuery.kall = [];
            medlemskapQuery.data = {
                skjæringstidspunkt: '2022-01-01',
                krav: [
                    {
                        id: 'en-medlemskapsvurdering-id',
                        kravkode: ApiKravkode.MEDLEMSKAP,
                        medlemskapOk: true,
                        status: ApiMedlemskapsstatus.UAVKLART_MED_BRUKERSPORSMAAL,
                        vurdertTidspunkt: '2022-01-02T10:00:00.000Z',
                        kilde: {
                            kildetype: ApiKildetype.AUTOMATISK,
                            versjonAvKildekode: '1',
                            oppslagsperiode: { fom: '2022-01-01', tom: '2022-01-01' },
                            årsaker: [{ regelId: 'SP6001', forklaringPaaUavklart: 'Arbeid utenfor Norge' }],
                        },
                    },
                ],
            };
        });

        it('henter ikke fra sp-medlemskap når togglen er av', () => {
            render(
                <InngangsvilkårWithContent
                    vilkårsgrunnlag={getVilkårsgrunnlagSpleis({ medlemskapsvurderingId: 'en-medlemskapsvurdering-id' })}
                    fødselsdato="1900-01-01"
                    {...opptjeningProps}
                />,
            );

            expect(medlemskapQuery.kall.every((kall) => kall.enabled === false)).toBe(true);
            const medlemskap = screen.getByRole('region', { name: 'Lovvalg og medlemskap' });
            expect(within(medlemskap).getByText('Oppfylt', { selector: '.aksel-tag' })).toBeVisible();
            expect(screen.queryByText('Uavklart med brukerspørsmål')).not.toBeInTheDocument();
        });

        it('viser vurderingen fra sp-medlemskap når togglen er på', () => {
            render(
                <InngangsvilkårWithContent
                    vilkårsgrunnlag={getVilkårsgrunnlagSpleis({ medlemskapsvurderingId: 'en-medlemskapsvurdering-id' })}
                    fødselsdato="1900-01-01"
                    {...opptjeningProps}
                    nyMedlemskapsvisning
                />,
            );

            expect(medlemskapQuery.kall).toContainEqual({
                medlemskapsvurderingId: 'en-medlemskapsvurdering-id',
                enabled: true,
            });
            const medlemskap = screen.getByRole('region', { name: 'Lovvalg og medlemskap' });
            expect(within(medlemskap).getByText('Uavklart med brukerspørsmål')).toBeVisible();
            expect(within(medlemskap).getByText('Arbeid utenfor Norge (SP6001)')).toBeVisible();
        });

        it('viser den gamle medlemskapsvisningen når vilkårsgrunnlaget mangler medlemskapsvurderingId', () => {
            render(
                <InngangsvilkårWithContent
                    vilkårsgrunnlag={getVilkårsgrunnlagSpleis({ medlemskapsvurderingId: null })}
                    fødselsdato="1900-01-01"
                    {...opptjeningProps}
                    nyMedlemskapsvisning
                />,
            );

            expect(medlemskapQuery.kall.every((kall) => kall.enabled === false)).toBe(true);
            const medlemskap = screen.getByRole('region', { name: 'Lovvalg og medlemskap' });
            expect(within(medlemskap).getByText('Oppfylt', { selector: '.aksel-tag' })).toBeVisible();
        });
    });
});
