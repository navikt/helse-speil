import { useParams } from 'next/navigation';

import { ApiMedlemskapsstatus } from '@io/rest/generated/medlemskap/medlemskap.schemas';
import { useGetVilkårsvurderingerForPersonBehandler } from '@io/rest/generated/medlemskap/vilkarsvurderinger/vilkarsvurderinger';
import { finnPeriodeTilGodkjenning } from '@state/inntektsforhold/inntektsforhold';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { useKanOverstyreMedlemskap } from '@state/toggles';

import { useVilkårsgrunnlag } from '../sykepengegrunnlag/useVilkårsgrunnlag';

interface Medlemskapsvarselvisning {
    skalViseSomFeil: boolean;
    henterStatus: boolean;
}

export function useSkalViseMedlemskapsvarselSomFeil(): Medlemskapsvarselvisning {
    const kanOverstyreMedlemskap = useKanOverstyreMedlemskap();
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const { data: person = null } = useFetchPersonQuery();
    const aktivPeriode = useActivePeriod(person);
    const periodeTilGodkjenning = finnPeriodeTilGodkjenning(person);
    const medlemskapsvurderingId = useVilkårsgrunnlag(person, periodeTilGodkjenning)?.medlemskapsvurderingId;

    const { data, isLoading } = useGetVilkårsvurderingerForPersonBehandler(
        personPseudoId,
        { medlemskapsvurderingId: medlemskapsvurderingId ?? '' },
        { query: { enabled: kanOverstyreMedlemskap && medlemskapsvurderingId !== undefined } },
    );

    const gjelderPeriodeTilGodkjenning =
        kanOverstyreMedlemskap && aktivPeriode?.skjaeringstidspunkt === periodeTilGodkjenning?.skjaeringstidspunkt;

    return {
        skalViseSomFeil:
            gjelderPeriodeTilGodkjenning &&
            data?.krav[0]?.status === ApiMedlemskapsstatus.UAVKLART_MED_BRUKERSPORSMAAL,
        henterStatus: gjelderPeriodeTilGodkjenning && isLoading,
    };
}
