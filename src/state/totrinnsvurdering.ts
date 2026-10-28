import { useParams } from 'next/navigation';

import { useGetTotrinnsvurderingForPerson } from '@io/rest/generated/personer/personer';
import { ApiSaksbildePerson, ApiTotrinnsvurdering } from '@io/rest/generated/spesialist.schemas';
import { finnAlleInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { usePeriodeIdMedAktivOppgave } from '@state/oppgave';
import { useFetchPersonQuery } from '@state/person';
import { DateString } from '@typer/shared';
import { TimelinePeriod } from '@typer/timeline';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useTotrinnsvurderingQuery = () => {
    const { personPseudoId } = useParams<{ personPseudoId?: string }>();
    return useGetTotrinnsvurderingForPerson(personPseudoId!, { query: { enabled: !!personPseudoId } });
};

export const useTotrinnsvurdering = (): ApiTotrinnsvurdering | null =>
    useTotrinnsvurderingQuery().data?.totrinnsvurdering ?? null;

// Som i saksbildet: totrinnsvurderingen vises bare på perioden med aktiv oppgave
export const useTotrinnsvurderingForPeriode = (periode?: TimelinePeriod | null): ApiTotrinnsvurdering | null => {
    const totrinnsvurdering = useTotrinnsvurdering();
    const periodeIdMedAktivOppgave = usePeriodeIdMedAktivOppgave();
    return isBeregnetPeriode(periode) && periode.id === periodeIdMedAktivOppgave ? totrinnsvurdering : null;
};

export const useHarBeslutteroppgave = (): boolean => {
    const totrinnsvurdering = useTotrinnsvurdering();
    const periodeIdMedAktivOppgave = usePeriodeIdMedAktivOppgave();
    return periodeIdMedAktivOppgave !== null && (totrinnsvurdering?.erBeslutteroppgave ?? false);
};

export const useHarBeslutteroppgaveForSkjæringstidspunkt = (skjæringstidspunkt: DateString): boolean => {
    const { data: person = null } = useFetchPersonQuery();
    const totrinnsvurdering = useTotrinnsvurdering();
    const periodeIdMedAktivOppgave = usePeriodeIdMedAktivOppgave();
    return harBeslutteroppgaveForSkjæringstidspunkt(
        person,
        periodeIdMedAktivOppgave,
        totrinnsvurdering,
        skjæringstidspunkt,
    );
};

export const harBeslutteroppgaveForSkjæringstidspunkt = (
    person: ApiSaksbildePerson | null,
    periodeIdMedAktivOppgave: string | null,
    totrinnsvurdering: ApiTotrinnsvurdering | null,
    skjæringstidspunkt: DateString,
): boolean => {
    if (!totrinnsvurdering?.erBeslutteroppgave || !periodeIdMedAktivOppgave) return false;
    const periodeMedAktivOppgave = finnAlleInntektsforhold(person)
        .flatMap((inntektsforhold) => inntektsforhold.behandlinger[0]?.perioder ?? [])
        .find((periode) => periode.id === periodeIdMedAktivOppgave);
    return periodeMedAktivOppgave?.skjaeringstidspunkt === skjæringstidspunkt;
};
