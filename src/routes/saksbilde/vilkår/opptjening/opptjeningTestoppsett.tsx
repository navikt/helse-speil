import { Mock } from 'vitest';

import { ApiVilkårsgrunnlagInfotrygdV2 } from '@io/rest/generated/spesialist.schemas';
import {
    ApiKildetype,
    ApiKravkilde,
    ApiKravkode,
    ApiOpptjeningsaktivitet,
    ApiOpptjeningshistorikkInnslag,
    ApiUtfall,
    ApiVilkårskode,
    ApiVilkårsvurdering,
    ApiVilkårsvurderingerForPersonResponse,
} from '@io/rest/generated/vilkarsproving.schemas';
import {
    useGetOpptjeningshistorikkBehandler,
    useGetVilkårsvurderingerForPersonBehandler,
    usePostManuellOpptjeningsvurderingBehandler,
    usePostNyAutomatiskVilkårsvurderingBehandler,
} from '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger';
import { InngangsvilkårWithContent } from '@saksbilde/vilkår/Inngangsvilkår';
import { render, screen, within } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { mockFetchResponse } from '../../../../../vitest.setup';

// Felles oppsett for Opptjening-testene. Testfilene må selv mocke
// '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger', siden vi.mock bare virker i testfila.

export const ingenAutomatiskeVurderinger: ApiVilkårsvurderingerForPersonResponse = {
    skjæringstidspunkt: '2024-01-01',
    krav: [
        {
            id: 'krav-1',
            kravkode: ApiKravkode.OPPTJENING,
            opptjeningOk: false,
            kravkilde: ApiKravkilde.VURDERT_I_SP_VILKARSPROVING,
            vurderinger: [],
        },
    ],
};

export const automatiskVurdertArbeidMinst4Uker: ApiVilkårsvurderingerForPersonResponse = {
    skjæringstidspunkt: '2024-01-01',
    krav: [
        {
            id: 'krav-1',
            kravkode: ApiKravkode.OPPTJENING,
            opptjeningOk: true,
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

export const automatiskIkkeOppfyltArbeidMinst4Uker = medEndretVurdering(automatiskVurdertArbeidMinst4Uker, {
    utfall: ApiUtfall.IKKE_OPPFYLT,
});

export const saksbehandlerOppfyltArbeidMinst4Uker = medEndretVurdering(automatiskVurdertArbeidMinst4Uker, {
    kilde: {
        ident: 'S123456',
        fritekstbegrunnelse: 'Har likestilt ytelse',
        journalpostId: [],
        opptjeningsaktiviteter: [],
        kildetype: ApiKildetype.SAKSBEHANDLER,
    },
});

export const overførtFraSpleis: ApiVilkårsvurderingerForPersonResponse = {
    skjæringstidspunkt: '2024-01-01',
    krav: [
        {
            id: 'krav-spleis',
            kravkode: ApiKravkode.OPPTJENING,
            opptjeningOk: true,
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

export const overførtFraInfotrygd: ApiVilkårsvurderingerForPersonResponse = {
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

export const bareArbeid = {
    minst4Uker: true,
    opptjeningsaktiviteter: [ApiOpptjeningsaktivitet.ARBEID],
    foreldrepengerOpptjentPåAap: null,
    yrkesaktivMinst4UkerFørUttak: null,
};

export const minst4Uker = /kombinasjon av arbeid og likestilt ytelse, i minst 4 uker/;

export const mutate = vi.fn();
export const mutateNyAutomatisk = vi.fn();
export const refetch = vi.fn();

const vilkårsgrunnlag: ApiVilkårsgrunnlagInfotrygdV2 = {
    type: 'ApiVilkårsgrunnlagInfotrygdV2',
    id: 'en-id',
    arbeidsgiverrefusjoner: [],
    inntekter: [],
    skjaeringstidspunkt: '2024-01-01',
    sykepengegrunnlag: 1234567,
    omregnetArsinntekt: 1234567,
    opptjeningsvurderingId: 'en-id',
    medlemskapsvurderingId: 'en-medlemskapsvurdering-id',
};

export function settOppOpptjeningsmocker() {
    mutate.mockClear();
    mutateNyAutomatisk.mockClear();
    refetch.mockClear();
    mockVilkårsvurderinger(automatiskIkkeOppfyltArbeidMinst4Uker);
    mockOpptjeningshistorikk([]);
    // Inngangsvilkår henter også medlemskapsvurderingen
    mockFetchResponse({ skjæringstidspunkt: '2024-01-01', krav: [] });
    (usePostManuellOpptjeningsvurderingBehandler as Mock).mockReturnValue({
        mutate,
        isPending: false,
        isError: false,
    });
    (usePostNyAutomatiskVilkårsvurderingBehandler as Mock).mockReturnValue({
        mutate: mutateNyAutomatisk,
        isPending: false,
    });
}

export function mockVilkårsvurderinger(
    data: ApiVilkårsvurderingerForPersonResponse | undefined,
    overrides?: { isLoading?: boolean; isFetching?: boolean; isError?: boolean },
) {
    (useGetVilkårsvurderingerForPersonBehandler as Mock).mockReturnValue({
        data,
        isLoading: overrides?.isLoading ?? false,
        isFetching: overrides?.isFetching ?? false,
        isError: overrides?.isError ?? false,
        refetch,
    });
}

export function mockOpptjeningshistorikk(historikk: ApiOpptjeningshistorikkInnslag[]) {
    (useGetOpptjeningshistorikkBehandler as Mock).mockReturnValue({
        data: { skjæringstidspunkt: '2024-01-01', historikk },
        isLoading: false,
        isError: false,
    });
}

export function opptjeningsvilkår() {
    return screen.getByRole('region', { name: /^Opptjeningstid/ });
}

export function renderOpptjening(readOnly: boolean, serPåTidligereBehandling = false) {
    return render(medOpptjening(readOnly, serPåTidligereBehandling));
}

export function medOpptjening(readOnly: boolean, serPåTidligereBehandling = false, opptjeningsvurderingId = 'en-id') {
    return (
        <InngangsvilkårWithContent
            vilkårsgrunnlag={vilkårsgrunnlag}
            fødselsdato="1980-01-01"
            personPseudoId="en-person"
            opptjeningsvurderingId={opptjeningsvurderingId}
            readOnly={readOnly}
            serPåTidligereBehandling={serPåTidligereBehandling}
        />
    );
}

export async function startVurdering() {
    await userEvent.click(within(opptjeningsvilkår()).getByRole('button', { name: 'Vurder vilkår' }));
}

export function svar(spørsmål: RegExp, svar: 'Ja' | 'Nei') {
    return userEvent.click(
        within(screen.getByRole('radiogroup', { name: spørsmål })).getByRole('radio', { name: svar }),
    );
}

export async function velgBareArbeid() {
    await svar(minst4Uker, 'Ja');
    await userEvent.click(screen.getByRole('checkbox', { name: 'Arbeid' }));
}

export function velgOpplystISpeil() {
    return userEvent.click(screen.getByRole('radio', { name: 'Saken er godt nok opplyst i Speil' }));
}

export function medLikestiltYtelse(vurderinger: [ApiVilkårskode, ApiUtfall][]): ApiVilkårsvurderingerForPersonResponse {
    return {
        skjæringstidspunkt: '2024-01-01',
        krav: [
            {
                id: 'krav-likestilt',
                kravkode: ApiKravkode.OPPTJENING,
                opptjeningOk: true,
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

export function medId(
    response: ApiVilkårsvurderingerForPersonResponse,
    opptjeningsvurderingId: string,
    vurdering: Partial<ApiVilkårsvurdering>,
): ApiOpptjeningshistorikkInnslag['opptjeningsvurdering'] {
    const krav = response.krav[0]!;
    if (!('vurderinger' in krav)) throw new Error('Forventet krav med enkeltvurderinger');
    return { ...krav, id: opptjeningsvurderingId, vurderinger: [{ ...krav.vurderinger[0]!, ...vurdering }] };
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
