import { useParams } from 'next/navigation';

import { useGetAktivOppgaveForPerson } from '@io/rest/generated/personer/personer';
import { ApiAktivOppgave, ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
import { finnAlleInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { useFetchPersonQuery } from '@state/person';
import { TimelinePeriod } from '@typer/timeline';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useAktivOppgaveQuery = () => {
    const { personPseudoId } = useParams<{ personPseudoId?: string }>();
    return useGetAktivOppgaveForPerson(personPseudoId!, { query: { enabled: !!personPseudoId } });
};

export const useAktivOppgave = (): ApiAktivOppgave | null => useAktivOppgaveQuery().data?.aktivOppgave ?? null;

export const useAktivOppgaveForPeriode = (periode?: TimelinePeriod | null): ApiAktivOppgave | null => {
    const aktivOppgave = useAktivOppgave();
    const periodeIdMedAktivOppgave = usePeriodeIdMedAktivOppgave();
    return isBeregnetPeriode(periode) && periode.id === periodeIdMedAktivOppgave ? aktivOppgave : null;
};

export const usePeriodeIdMedAktivOppgave = (): string | null => {
    const { data: person = null } = useFetchPersonQuery();
    const aktivOppgave = useAktivOppgave();
    return finnPeriodeIdMedAktivOppgave(person, aktivOppgave);
};

// Som i Spesialist: oppgaven hører til den beregnede perioden i nyeste behandling av vedtaksperioden
export const finnPeriodeIdMedAktivOppgave = (
    person: ApiSaksbildePerson | null,
    aktivOppgave: ApiAktivOppgave | null,
): string | null => {
    if (!aktivOppgave || !person) return null;
    const periode = finnAlleInntektsforhold(person)
        .flatMap((inntektsforhold) => inntektsforhold.behandlinger[0]?.perioder ?? [])
        .find((p) => isBeregnetPeriode(p) && p.vedtaksperiodeId === aktivOppgave.vedtaksperiodeId);
    return periode?.id ?? null;
};
