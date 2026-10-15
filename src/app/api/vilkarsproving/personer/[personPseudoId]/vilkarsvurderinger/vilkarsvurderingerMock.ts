import { v4 } from 'uuid';

import {
    ApiKildetype,
    ApiKravkilde,
    ApiKravkode,
    ApiManuellVilkårsvurderingRequest,
    ApiNyAutomatiskVilkårsvurderingRequest,
    ApiOpptjeningshistorikkInnslag,
    ApiOpptjeningshistorikkResponse,
    ApiOpptjeningsvurdering,
    ApiOpptjeningsvurderingVurdertISpVilkarproving,
    ApiUtfall,
    ApiVilkårskode,
    ApiVilkårsvurdering,
    ApiVilkårsvurderingerForPersonResponse,
} from '@io/rest/generated/vilkarsproving.schemas';
import { PersonMock } from '@spesialist-mock/storage/person';

interface Opptjeningstilstand {
    vilkårsvurderinger: ApiVilkårsvurderingerForPersonResponse;
    opptjeningshistorikk: ApiOpptjeningshistorikkInnslag[];
}

// punktlig_jakke.json starter med opptjening ikke vurdert, så man kan teste manuell vurdering
const PERSONER_MED_OPPTJENING_IKKE_VURDERT: Record<string, string> = {
    '2805594640777': '2023-03-01',
};

// streng_kaktus.json har opptjening automatisk vurdert til ikke oppfylt
const PERSONER_MED_OPPTJENING_AUTOMATISK_AVSLÅTT: Record<string, string> = {
    '2805594640665': '2023-03-01',
};

const SEEDEDE_OPPTJENINGSVURDERINGER: Record<string, ApiOpptjeningsvurderingVurdertISpVilkarproving> = {
    'a1f1c0de-0000-4000-8000-000000000001': manueltVurdertKrav('a1f1c0de-0000-4000-8000-000000000001', {
        utfall: ApiUtfall.OPPFYLT,
        vurdertTidspunkt: '2024-09-10T10:15:00.000',
        fritekstbegrunnelse:
            'Søker har arbeidet hos samme arbeidsgiver i 6 uker før sykmeldingen.\nBekreftet med arbeidsavtale.',
        journalpostId: ['598373838', '598373839'],
    }),
    'a1f1c0de-0000-4000-8000-000000000002': manueltVurdertKrav('a1f1c0de-0000-4000-8000-000000000002', {
        utfall: ApiUtfall.IKKE_OPPFYLT,
        vurdertTidspunkt: '2024-07-20T09:00:00.000',
        fritekstbegrunnelse: 'Fant ikke dokumentasjon på arbeid i perioden.',
        journalpostId: [],
    }),
    'a1f1c0de-0000-4000-8000-000000000003': manueltVurdertKrav('a1f1c0de-0000-4000-8000-000000000003', {
        utfall: ApiUtfall.OPPFYLT,
        vurdertTidspunkt: '2024-07-10T08:30:00.000',
        fritekstbegrunnelse: 'Arbeidsforholdet er bekreftet av arbeidsgiver.',
        journalpostId: ['598373840'],
    }),
    'a1f1c0de-0000-4000-8000-000000000004': {
        id: 'a1f1c0de-0000-4000-8000-000000000004',
        kravkode: ApiKravkode.OPPTJENING,
        opptjeningOk: true,
        avgjørendeVilkårskode: ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER,
        vurderinger: [automatiskVurdering('vurdering-seed-4', '2024-09-05T13:45:00.000')],
        kravkilde: ApiKravkilde.VURDERT_I_SP_VILKARSPROVING,
    },
};

const tilstandPerPerson = new Map<string, Opptjeningstilstand>();

export const hentVilkårsvurderinger = (personPseudoId: string): ApiVilkårsvurderingerForPersonResponse =>
    hentTilstand(personPseudoId).vilkårsvurderinger;

export const hentOpptjeningshistorikk = (
    personPseudoId: string,
    skjæringstidspunkt: string,
): ApiOpptjeningshistorikkResponse => ({
    skjæringstidspunkt,
    historikk: hentTilstand(personPseudoId).opptjeningshistorikk,
});

export const hentOpptjeningsvurdering = (
    personPseudoId: string,
    opptjeningsvurderingId: string,
): ApiOpptjeningsvurdering | undefined =>
    hentTilstand(personPseudoId)
        .opptjeningshistorikk.map((innslag) => innslag.opptjeningsvurdering)
        .find((vurdering) => vurdering.id === opptjeningsvurderingId) ??
    SEEDEDE_OPPTJENINGSVURDERINGER[opptjeningsvurderingId];

export const overstyrVilkårsvurdering = (
    personPseudoId: string,
    request: ApiManuellVilkårsvurderingRequest,
): string => {
    const { vilkårsvurderinger, opptjeningshistorikk } = hentTilstand(personPseudoId);
    const nyVurdering: ApiVilkårsvurdering = {
        id: v4(),
        vilkårskode: request.vilkårskode,
        utfall: request.utfall,
        vurdertTidspunkt: new Date().toISOString(),
        lovreferanse: {
            lov: 'folketrygdloven',
            paragraf: '8-2',
            iKraftFra: '1997-05-01',
        },
        kilde: {
            ident: 'S123456',
            fritekstbegrunnelse: request.fritekstbegrunnelse,
            journalpostId: request.journalpostId,
            kildetype: ApiKildetype.SAKSBEHANDLER,
        },
    };

    const forrigeOpptjeningskrav = vilkårsvurderinger.krav.find((krav) => krav.kravkode === ApiKravkode.OPPTJENING);
    const tidligereVurderinger =
        forrigeOpptjeningskrav && 'vurderinger' in forrigeOpptjeningskrav
            ? forrigeOpptjeningskrav.vurderinger.filter((vurdering) => vurdering.vilkårskode !== request.vilkårskode)
            : [];

    const nyeVurderinger = [...tidligereVurderinger, nyVurdering];
    const oppfyltVurdering = nyeVurderinger.find((vurdering) => vurdering.utfall === ApiUtfall.OPPFYLT);

    const nyttKrav: ApiOpptjeningsvurderingVurdertISpVilkarproving = {
        id: v4(),
        kravkode: ApiKravkode.OPPTJENING,
        opptjeningOk: oppfyltVurdering !== undefined,
        avgjørendeVilkårskode: (oppfyltVurdering ?? nyVurdering).vilkårskode,
        vurderinger: nyeVurderinger,
        kravkilde: ApiKravkilde.VURDERT_I_SP_VILKARSPROVING,
    };

    tilstandPerPerson.set(personPseudoId, {
        vilkårsvurderinger: {
            skjæringstidspunkt: request.skjæringstidspunkt,
            krav: [...vilkårsvurderinger.krav.filter((krav) => krav.kravkode !== ApiKravkode.OPPTJENING), nyttKrav],
        },
        opptjeningshistorikk: [
            { vurdertTidspunkt: nyVurdering.vurdertTidspunkt, opptjeningsvurdering: nyttKrav },
            ...opptjeningshistorikk,
        ],
    });

    return nyttKrav.id;
};

export const vurderAutomatiskPåNytt = (
    personPseudoId: string,
    request: ApiNyAutomatiskVilkårsvurderingRequest,
): string => {
    const { vilkårsvurderinger, opptjeningshistorikk } = hentTilstand(personPseudoId);
    const aktørId = PersonMock.findAktørIdForPersonPseudoId(personPseudoId);
    const erAvslått = aktørId !== null && aktørId in PERSONER_MED_OPPTJENING_AUTOMATISK_AVSLÅTT;
    const nyVurdering = erAvslått
        ? automatiskAvslåttVurdering(v4(), new Date().toISOString())
        : automatiskVurdering(v4(), new Date().toISOString());

    const nyttKrav: ApiOpptjeningsvurderingVurdertISpVilkarproving = {
        id: v4(),
        kravkode: ApiKravkode.OPPTJENING,
        opptjeningOk: !erAvslått,
        avgjørendeVilkårskode: nyVurdering.vilkårskode,
        vurderinger: [nyVurdering],
        kravkilde: ApiKravkilde.VURDERT_I_SP_VILKARSPROVING,
    };

    tilstandPerPerson.set(personPseudoId, {
        vilkårsvurderinger: {
            skjæringstidspunkt: request.skjæringstidspunkt,
            krav: [...vilkårsvurderinger.krav.filter((krav) => krav.kravkode !== ApiKravkode.OPPTJENING), nyttKrav],
        },
        opptjeningshistorikk: [
            { vurdertTidspunkt: nyVurdering.vurdertTidspunkt, opptjeningsvurdering: nyttKrav },
            ...opptjeningshistorikk,
        ],
    });

    return nyttKrav.id;
};

function hentTilstand(personPseudoId: string): Opptjeningstilstand {
    const eksisterende = tilstandPerPerson.get(personPseudoId);
    if (eksisterende) return eksisterende;

    const tilstand = initiellTilstand(personPseudoId);
    tilstandPerPerson.set(personPseudoId, tilstand);
    return tilstand;
}

function initiellTilstand(personPseudoId: string): Opptjeningstilstand {
    const aktørId = PersonMock.findAktørIdForPersonPseudoId(personPseudoId);
    const skjæringstidspunktIkkeVurdert = aktørId ? PERSONER_MED_OPPTJENING_IKKE_VURDERT[aktørId] : undefined;
    if (skjæringstidspunktIkkeVurdert) {
        return {
            vilkårsvurderinger: { skjæringstidspunkt: skjæringstidspunktIkkeVurdert, krav: [] },
            opptjeningshistorikk: [],
        };
    }

    const skjæringstidspunktAvslått = aktørId ? PERSONER_MED_OPPTJENING_AUTOMATISK_AVSLÅTT[aktørId] : undefined;
    if (skjæringstidspunktAvslått) {
        const vurdertTidspunkt = '2023-04-03T10:00:00.000Z';
        const avslåttKrav: ApiOpptjeningsvurderingVurdertISpVilkarproving = {
            id: 'krav-avslått',
            kravkode: ApiKravkode.OPPTJENING,
            opptjeningOk: false,
            avgjørendeVilkårskode: ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER,
            vurderinger: [automatiskAvslåttVurdering('vurdering-avslått', vurdertTidspunkt)],
            kravkilde: ApiKravkilde.VURDERT_I_SP_VILKARSPROVING,
        };
        return {
            vilkårsvurderinger: { skjæringstidspunkt: skjæringstidspunktAvslått, krav: [avslåttKrav] },
            opptjeningshistorikk: [{ vurdertTidspunkt, opptjeningsvurdering: avslåttKrav }],
        };
    }

    const krav: ApiOpptjeningsvurderingVurdertISpVilkarproving = {
        id: 'krav-2',
        kravkode: ApiKravkode.OPPTJENING,
        opptjeningOk: true,
        avgjørendeVilkårskode: ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER,
        vurderinger: [automatiskVurdering('vurdering-1', '2024-01-02T10:00:00.000Z')],
        kravkilde: ApiKravkilde.VURDERT_I_SP_VILKARSPROVING,
    };
    return {
        vilkårsvurderinger: { skjæringstidspunkt: '2024-01-01', krav: [krav] },
        opptjeningshistorikk: [{ vurdertTidspunkt: '2024-01-02T10:00:00.000Z', opptjeningsvurdering: krav }],
    };
}

function manueltVurdertKrav(
    id: string,
    vurdering: { utfall: ApiUtfall; vurdertTidspunkt: string; fritekstbegrunnelse: string; journalpostId: string[] },
): ApiOpptjeningsvurderingVurdertISpVilkarproving {
    return {
        id,
        kravkode: ApiKravkode.OPPTJENING,
        opptjeningOk: vurdering.utfall === ApiUtfall.OPPFYLT,
        avgjørendeVilkårskode: ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER,
        vurderinger: [
            {
                id: `vurdering-${id}`,
                vilkårskode: ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER,
                utfall: vurdering.utfall,
                vurdertTidspunkt: vurdering.vurdertTidspunkt,
                lovreferanse: { lov: 'folketrygdloven', paragraf: '8-2', iKraftFra: '1997-05-01' },
                kilde: {
                    ident: 'S123456',
                    fritekstbegrunnelse: vurdering.fritekstbegrunnelse,
                    journalpostId: vurdering.journalpostId,
                    kildetype: ApiKildetype.SAKSBEHANDLER,
                },
            },
        ],
        kravkilde: ApiKravkilde.VURDERT_I_SP_VILKARSPROVING,
    };
}

function automatiskVurdering(id: string, vurdertTidspunkt: string): ApiVilkårsvurdering {
    return {
        id,
        vilkårskode: ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER,
        utfall: ApiUtfall.OPPFYLT,
        vurdertTidspunkt,
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
                        organisasjonsnummer: '967170232',
                        fom: '2023-01-01',
                        tom: null,
                        type: 'ORDINÆRT',
                    },
                    {
                        organisasjonsnummer: '311927825',
                        fom: '2022-03-01',
                        tom: '2022-12-31',
                        type: 'FRILANSER',
                    },
                ],
                opptjeningsperiode: {
                    fom: '2023-01-01',
                    tom: '2023-12-31',
                },
                opptjeningsdager: 120,
                grunnlagstype: 'ARBEIDSFORHOLD',
            },
            kildetype: ApiKildetype.AUTOMATISK,
        },
    };
}

function automatiskAvslåttVurdering(id: string, vurdertTidspunkt: string): ApiVilkårsvurdering {
    return {
        id,
        vilkårskode: ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER,
        utfall: ApiUtfall.IKKE_OPPFYLT,
        vurdertTidspunkt,
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
                        organisasjonsnummer: '896929119',
                        fom: '2023-02-15',
                        tom: null,
                        type: 'ORDINÆRT',
                    },
                ],
                opptjeningsperiode: {
                    fom: '2023-02-15',
                    tom: '2023-02-28',
                },
                opptjeningsdager: 14,
                grunnlagstype: 'ARBEIDSFORHOLD',
            },
            kildetype: ApiKildetype.AUTOMATISK,
        },
    };
}
