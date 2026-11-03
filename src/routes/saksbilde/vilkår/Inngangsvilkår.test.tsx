import {
    ApiKildetype,
    ApiKravkode,
    ApiMedlemskapshistorikkInnslag,
    ApiMedlemskapsstatus,
    ApiVilkårsvurderingerForPersonResponse,
} from '@io/rest/generated/medlemskap/medlemskap.schemas';
import {
    ApiVilkårsgrunnlagInfotrygdV2,
    ApiVilkårsgrunnlagSpleisV2,
    ApiVilkårsgrunnlagVurdering,
} from '@io/rest/generated/spesialist.schemas';
import { render, screen, within } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { InngangsvilkårWithContent } from './Inngangsvilkår';

vi.mock('@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger')>()),
    useGetVilkårsvurderingerForPersonBehandler: () => ({ data: undefined, isLoading: true, isError: false }),
    useGetOpptjeningshistorikkBehandler: () => ({ data: undefined, isLoading: true, isError: false }),
}));

const medlemskapQuery = vi.hoisted(() => ({
    kall: [] as { medlemskapsvurderingId: string; enabled: boolean | undefined }[],
    data: undefined as ApiVilkårsvurderingerForPersonResponse | undefined,
    historikk: [] as ApiMedlemskapshistorikkInnslag[],
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
    useGetMedlemskapshistorikkBehandler: (
        _personId: string,
        params: { skjæringstidspunkt: string },
        options?: { query?: { enabled?: boolean } },
    ) => ({
        data: options?.query?.enabled
            ? { skjæringstidspunkt: params.skjæringstidspunkt, historikk: medlemskapQuery.historikk }
            : undefined,
    }),
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
            medlemskapQuery.historikk = [];
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

        describe('endringslogg', () => {
            const automatisk: ApiMedlemskapshistorikkInnslag = {
                vurdertTidspunkt: '2022-01-02T10:00:00.000Z',
                medlemskapsvurdering: {
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
            };
            const manuell: ApiMedlemskapshistorikkInnslag = {
                vurdertTidspunkt: '2022-02-03T12:00:00.000Z',
                medlemskapsvurdering: {
                    id: 'en-manuell-medlemskapsvurdering-id',
                    kravkode: ApiKravkode.MEDLEMSKAP,
                    medlemskapOk: true,
                    status: ApiMedlemskapsstatus.JA,
                    vurdertTidspunkt: '2022-02-03T12:00:00.000Z',
                    kilde: {
                        kildetype: ApiKildetype.SAKSBEHANDLER,
                        ident: 'S123456',
                        fritekstbegrunnelse: 'Jobber i Norge',
                        journalpostId: [],
                    },
                },
            };
            const fraInfotrygd: ApiMedlemskapshistorikkInnslag = {
                vurdertTidspunkt: '2021-12-01T10:00:00.000Z',
                medlemskapsvurdering: {
                    id: 'en-infotrygd-medlemskapsvurdering-id',
                    kravkode: ApiKravkode.MEDLEMSKAP,
                    medlemskapOk: true,
                    status: ApiMedlemskapsstatus.JA,
                    vurdertTidspunkt: '2021-12-01T10:00:00.000Z',
                    kilde: { kildetype: ApiKildetype.OVERFOERT_FRA_INFOTRYGD },
                },
            };

            function renderMedlemskap() {
                render(
                    <InngangsvilkårWithContent
                        vilkårsgrunnlag={getVilkårsgrunnlagSpleis({
                            medlemskapsvurderingId: 'en-medlemskapsvurdering-id',
                        })}
                        fødselsdato="1900-01-01"
                        {...opptjeningProps}
                        nyMedlemskapsvisning
                    />,
                );
            }

            function endringsloggknapp() {
                return screen.queryByRole('button', { name: 'Vis endringslogg for lovvalg og medlemskap' });
            }

            function endringsloggrader() {
                return within(screen.getByRole('dialog')).getAllByRole('row').slice(1);
            }

            it('viser ikke endringslogg når det bare finnes én medlemskapsvurdering', () => {
                medlemskapQuery.historikk = [automatisk];

                renderMedlemskap();

                expect(endringsloggknapp()).not.toBeInTheDocument();
            });

            it('viser alle vurderingene, nyeste først, når det finnes flere medlemskapsvurderinger', async () => {
                medlemskapQuery.historikk = [automatisk, manuell];

                renderMedlemskap();
                await userEvent.click(endringsloggknapp()!);

                const [nyeste, eldste] = endringsloggrader();
                expect(endringsloggrader()).toHaveLength(2);
                expect(within(nyeste!).getByText(/^03.02.2022/)).toBeVisible();
                expect(within(nyeste!).getByText('Lovvalg og medlemskap')).toBeVisible();
                expect(within(nyeste!).getByText('Medlem')).toBeVisible();
                expect(within(nyeste!).getByText('Jobber i Norge')).toBeVisible();
                expect(within(nyeste!).getByText('S123456')).toHaveAttribute('data-sensitive');
                expect(within(eldste!).getByText('Uavklart med brukerspørsmål')).toBeVisible();
                expect(within(eldste!).getByText('Automatisk')).toBeVisible();
            });

            it('viser årsakene til en automatisk vurdering når raden ekspanderes', async () => {
                medlemskapQuery.historikk = [automatisk, manuell];

                renderMedlemskap();
                await userEvent.click(endringsloggknapp()!);
                await userEvent.click(within(endringsloggrader()[1]!).getByRole('button'));

                expect(within(screen.getByRole('dialog')).getByText('Arbeid utenfor Norge (SP6001)')).toBeVisible();
            });

            it('kan ikke ekspandere medlemskapsvurderinger fra Infotrygd', async () => {
                medlemskapQuery.historikk = [manuell, fraInfotrygd];

                renderMedlemskap();
                await userEvent.click(endringsloggknapp()!);

                expect(within(endringsloggrader()[0]!).getByRole('button')).toBeEnabled();
                expect(within(endringsloggrader()[1]!).getByText('Infotrygd')).toBeVisible();
                expect(within(endringsloggrader()[1]!).queryByRole('button')).not.toBeInTheDocument();
            });
        });
    });
});
