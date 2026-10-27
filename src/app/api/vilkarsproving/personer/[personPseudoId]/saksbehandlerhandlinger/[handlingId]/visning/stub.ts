import { NextRequest } from 'next/server';

import { hentOpptjeningsvurdering } from '@app/api/vilkarsproving/personer/[personPseudoId]/vilkarsvurderinger/vilkarsvurderingerMock';
import { opptjeningsaktivitetLabels } from '@form-schemas/opptjeningsvurderingSkjema';
import {
    ApiOpptjeningsaktivitet,
    ApiUtfall,
    ApiVilkårskode,
    ApiVilkårsvurdering,
    ApiVurderingskildeSaksbehandler,
} from '@io/rest/generated/vilkarsproving.schemas';
import { Handlingsvisning, Visningsfelt } from '@io/rest/handlingsvisning';

export const stub = async (_request: NextRequest, params: Promise<{ personPseudoId: string; handlingId: string }>) => {
    const { personPseudoId, handlingId } = await params;
    const opptjeningsvurdering = hentOpptjeningsvurdering(personPseudoId, handlingId);
    const manuelle =
        opptjeningsvurdering && 'vurderinger' in opptjeningsvurdering
            ? opptjeningsvurdering.vurderinger.filter(erManuellVurdering)
            : [];
    // Bare manuelle vurderinger har detaljer
    if (manuelle.length === 0) return new Response(null, { status: 404 });
    return Response.json(tilVisning(nyesteHandling(manuelle), opptjeningsvurdering!.opptjeningOk));
};

type ManuellVurdering = ApiVilkårsvurdering & { kilde: ApiVurderingskildeSaksbehandler };

function erManuellVurdering(vurdering: ApiVilkårsvurdering): vurdering is ManuellVurdering {
    return 'fritekstbegrunnelse' in vurdering.kilde;
}

// Vurderinger fra samme skjema lagres sammen i én handling med samme tidspunkt
function nyesteHandling(manuelle: ManuellVurdering[]): ManuellVurdering[] {
    const nyesteTidspunkt = manuelle
        .map((vurdering) => vurdering.vurdertTidspunkt)
        .sort()
        .at(-1);
    return manuelle.filter((vurdering) => vurdering.vurdertTidspunkt === nyesteTidspunkt);
}

function tilVisning(vurderinger: ManuellVurdering[], opptjeningOk: boolean): Handlingsvisning {
    const { kilde } = vurderinger[0]!;
    const sorterte = vurderinger
        .toSorted((a, b) => vilkårsrekkefølge(a.vilkårskode) - vilkårsrekkefølge(b.vilkårskode))
        .map((vurdering) => ({ vurdering, felt: tilVisningsfelt(vurdering) }));
    // Feltene kommer i samme rekkefølge som spørsmålene i skjemaet: aktivitetene før spørsmålene om foreldrepenger
    const felter: Visningsfelt[] = [
        { type: 'TEKST', tittel: 'Opptjeningstid', tekst: opptjeningOk ? 'Oppfylt' : 'Ikke oppfylt' },
        ...sorterte.filter(({ vurdering }) => !gjelderForeldrepenger(vurdering)).map(({ felt }) => felt),
    ];
    // Bare arbeid følger av at «Arbeid i minst 4 uker» er oppfylt, så lista vises bare når det er likestilte ytelser
    if (kilde.opptjeningsaktiviteter.some((aktivitet) => aktivitet !== ApiOpptjeningsaktivitet.ARBEID)) {
        felter.push({
            type: 'LISTE',
            tittel: 'Arbeid og likestilte ytelser',
            elementer: kilde.opptjeningsaktiviteter.map((aktivitet) => opptjeningsaktivitetLabels[aktivitet]),
        });
    }
    felter.push(...sorterte.filter(({ vurdering }) => gjelderForeldrepenger(vurdering)).map(({ felt }) => felt));
    felter.push({ type: 'TEKST', tittel: 'Begrunnelse', tekst: kilde.fritekstbegrunnelse });
    if (kilde.journalpostId.length > 0) {
        felter.push({ type: 'LISTE', tittel: 'Journalposter', elementer: kilde.journalpostId });
    }
    return { felter };
}

function tilVisningsfelt(vurdering: ApiVilkårsvurdering): Visningsfelt {
    return { type: 'TEKST', tittel: spørsmål[vurdering.vilkårskode], tekst: svar(vurdering) };
}

function gjelderForeldrepenger(vurdering: ApiVilkårsvurdering): boolean {
    return (
        vurdering.vilkårskode === ApiVilkårskode.OPPTJENING_FORELDREPENGER_IKKE_OPPTJENT_PA_AAP ||
        vurdering.vilkårskode === ApiVilkårskode.OPPTJENING_YRKESAKTIV_MINST_4_UKER_FOR_UTTAK_AV_FORELDREPENGER
    );
}

// Vilkåret «Foreldrepenger ikke opptjent på AAP» er negert i forhold til spørsmålet, så svaret snus
function svar(vurdering: ApiVilkårsvurdering): string {
    const oppfylt = vurdering.utfall === ApiUtfall.OPPFYLT;
    const ja =
        vurdering.vilkårskode === ApiVilkårskode.OPPTJENING_FORELDREPENGER_IKKE_OPPTJENT_PA_AAP ? !oppfylt : oppfylt;
    return ja ? 'Ja' : 'Nei';
}

function vilkårsrekkefølge(vilkårskode: ApiVilkårskode): number {
    return Object.values(ApiVilkårskode).indexOf(vilkårskode);
}

// Vilkårene vises som spørsmålene saksbehandleren svarte på i skjemaet
const spørsmål: Record<ApiVilkårskode, string> = {
    [ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER]: 'Arbeid i minst 4 uker',
    [ApiVilkårskode.OPPTJENING_LIKESTILT_YTELSE_MINST_4_UKER]: 'Likestilt ytelse i minst 4 uker',
    [ApiVilkårskode.OPPTJENING_FORELDREPENGER_IKKE_OPPTJENT_PA_AAP]: 'Foreldrepenger opptjent på AAP',
    [ApiVilkårskode.OPPTJENING_YRKESAKTIV_MINST_4_UKER_FOR_UTTAK_AV_FORELDREPENGER]:
        'Yrkesaktiv eller likestilt ytelse i minst 4 uker før uttak av foreldrepenger',
};
