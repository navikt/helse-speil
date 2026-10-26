import { v4 } from 'uuid';

import {
    ApiKildetype,
    ApiKravkilde,
    ApiKravkode,
    ApiManuellOpptjeningsvurderingRequest,
    ApiNyAutomatiskVilkårsvurderingRequest,
    ApiOpptjeningsaktivitet,
    ApiOpptjeningshistorikkInnslag,
    ApiOpptjeningshistorikkResponse,
    ApiOpptjeningsvurdering,
    ApiOpptjeningsvurderingVurdertISpVilkarproving,
    ApiUtfall,
    ApiVilkårskode,
    ApiVilkårsvurdering,
    ApiVilkårsvurderingerForPersonResponse,
    ApiVurderingskildeSaksbehandler,
} from '@io/rest/generated/vilkarsproving.schemas';
import { finnPerioderMedOppgave } from '@spesialist-mock/periodeoppslag';
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

// Speiler ManuellOpptjeningsvurdering.vurder() i sp-vilkarsproving: bare arbeid gir første ledd oppfylt,
// ellers første ledd ikke oppfylt og én vurdering per punktum i andre ledd som ble besvart
export const vurderOpptjening = (personPseudoId: string, request: ApiManuellOpptjeningsvurderingRequest): string => {
    const vurdertTidspunkt = new Date().toISOString();
    const kilde: ApiVurderingskildeSaksbehandler = {
        ident: 'S123456',
        fritekstbegrunnelse: request.fritekstbegrunnelse,
        journalpostId: request.journalpostId,
        opptjeningsaktiviteter: request.opptjeningsaktiviteter,
        kildetype: ApiKildetype.SAKSBEHANDLER,
    };
    const førsteLedd = (oppfylt: boolean): ApiVilkårsvurdering => ({
        id: v4(),
        vilkårskode: ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER,
        utfall: oppfylt ? ApiUtfall.OPPFYLT : ApiUtfall.IKKE_OPPFYLT,
        vurdertTidspunkt,
        lovreferanse: { lov: 'folketrygdloven', paragraf: '8-2', iKraftFra: '1997-05-01' },
        kilde,
    });
    const punktum = (vilkårskode: ApiVilkårskode, oppfylt: boolean, setning: number): ApiVilkårsvurdering => ({
        id: v4(),
        vilkårskode,
        utfall: oppfylt ? ApiUtfall.OPPFYLT : ApiUtfall.IKKE_OPPFYLT,
        vurdertTidspunkt,
        lovreferanse: {
            lov: 'folketrygdloven',
            paragraf: '8-2',
            avsnitt: 2,
            setning,
            iKraftFra: setning === 1 ? '1997-01-01' : '2018-01-01',
        },
        kilde,
    });

    const bareArbeid =
        request.opptjeningsaktiviteter.length > 0 &&
        request.opptjeningsaktiviteter.every((aktivitet) => aktivitet === ApiOpptjeningsaktivitet.ARBEID);
    if (request.minst4Uker && bareArbeid) {
        return lagreManuelleVurderinger(personPseudoId, request.skjæringstidspunkt, [førsteLedd(true)]);
    }

    const nyeVurderinger = [
        førsteLedd(false),
        punktum(ApiVilkårskode.OPPTJENING_LIKESTILT_YTELSE_MINST_4_UKER, request.minst4Uker, 1),
    ];
    if (request.foreldrepengerOpptjentPåAap != null) {
        nyeVurderinger.push(
            punktum(
                ApiVilkårskode.OPPTJENING_FORELDREPENGER_IKKE_OPPTJENT_PA_AAP,
                !request.foreldrepengerOpptjentPåAap,
                2,
            ),
        );
        if (request.yrkesaktivMinst4UkerFørUttak != null) {
            nyeVurderinger.push(
                punktum(
                    ApiVilkårskode.OPPTJENING_YRKESAKTIV_MINST_4_UKER_FOR_UTTAK_AV_FORELDREPENGER,
                    request.yrkesaktivMinst4UkerFørUttak,
                    3,
                ),
            );
        }
    }

    return lagreManuelleVurderinger(personPseudoId, request.skjæringstidspunkt, nyeVurderinger);
};

// Speiler Opptjeningsvurdering.avSaksbehandlerErstattAlle() i sp-vilkarsproving
function lagreManuelleVurderinger(
    personPseudoId: string,
    skjæringstidspunkt: string,
    nyeVurderinger: ApiVilkårsvurdering[],
): string {
    const { vilkårsvurderinger, opptjeningshistorikk } = hentTilstand(personPseudoId);
    const avgjørende = avgjørendeVurdering(nyeVurderinger);

    const nyttKrav: ApiOpptjeningsvurderingVurdertISpVilkarproving = {
        id: v4(),
        kravkode: ApiKravkode.OPPTJENING,
        opptjeningOk: avgjørende !== undefined,
        avgjørendeVilkårskode: avgjørende?.vilkårskode ?? null,
        vurderinger: nyeVurderinger,
        kravkilde: ApiKravkilde.VURDERT_I_SP_VILKARSPROVING,
    };

    tilstandPerPerson.set(personPseudoId, {
        vilkårsvurderinger: {
            skjæringstidspunkt,
            krav: [...vilkårsvurderinger.krav.filter((krav) => krav.kravkode !== ApiKravkode.OPPTJENING), nyttKrav],
        },
        opptjeningshistorikk: [
            { vurdertTidspunkt: nyeVurderinger[0]!.vurdertTidspunkt, opptjeningsvurdering: nyttKrav },
            ...opptjeningshistorikk,
        ],
    });

    return nyttKrav.id;
}

// Speiler avgjørendeVilkårsvurdering() i sp-vilkarsproving
function avgjørendeVurdering(vurderinger: ApiVilkårsvurdering[]): ApiVilkårsvurdering | undefined {
    const finn = (vilkårskode: ApiVilkårskode) => vurderinger.find((it) => it.vilkårskode === vilkårskode);
    const erOppfylt = (vurdering?: ApiVilkårsvurdering) => vurdering?.utfall === ApiUtfall.OPPFYLT;

    const hovedregel = finn(ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER);
    if (erOppfylt(hovedregel)) return hovedregel;

    const førstePunktum = finn(ApiVilkårskode.OPPTJENING_LIKESTILT_YTELSE_MINST_4_UKER);
    if (!erOppfylt(førstePunktum)) return undefined;

    const andrePunktum = finn(ApiVilkårskode.OPPTJENING_FORELDREPENGER_IKKE_OPPTJENT_PA_AAP);
    if (!andrePunktum || erOppfylt(andrePunktum)) return førstePunktum;

    const tredjePunktum = finn(ApiVilkårskode.OPPTJENING_YRKESAKTIV_MINST_4_UKER_FOR_UTTAK_AV_FORELDREPENGER);
    return erOppfylt(tredjePunktum) ? tredjePunktum : undefined;
}

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
        vilkårsvurderinger: { skjæringstidspunkt: skjæringstidspunktForPerson(personPseudoId), krav: [krav] },
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
                    opptjeningsaktiviteter: [],
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

// Personer uten seedet opptjening får skjæringstidspunktet til perioden med oppgave, så handlinger treffer perioden
function skjæringstidspunktForPerson(personPseudoId: string): string {
    const fødselsnummer = PersonMock.findFødselsnummerForPersonPseudoId(personPseudoId);
    const periode = fødselsnummer ? finnPerioderMedOppgave(fødselsnummer)[0]?.periode : undefined;
    return periode?.skjaeringstidspunkt ?? '2024-01-01';
}
