import { useParams } from 'next/navigation';

import { useGetPaVentForPerson } from '@io/rest/generated/personer/personer';
import { ApiPaVent } from '@io/rest/generated/spesialist.schemas';
import { usePeriodeIdMedAktivOppgave } from '@state/oppgave';
import { useQueryClient } from '@tanstack/react-query';
import { TimelinePeriod } from '@typer/timeline';
import { isBeregnetPeriode } from '@utils/typeguards';

export const usePåVentQuery = () => {
    const { personPseudoId } = useParams<{ personPseudoId?: string }>();
    return useGetPaVentForPerson(personPseudoId!, { query: { enabled: !!personPseudoId } });
};

export const usePåVent = (): ApiPaVent | null => usePåVentQuery().data?.paVent ?? null;

// PåVent hører til den aktive oppgaven, og vises derfor bare på perioden med aktiv oppgave
export const usePåVentForPeriode = (periode?: TimelinePeriod | null): ApiPaVent | null => {
    const påVent = usePåVent();
    const periodeIdMedAktivOppgave = usePeriodeIdMedAktivOppgave();
    return isBeregnetPeriode(periode) && periode.id === periodeIdMedAktivOppgave ? påVent : null;
};

const påVentnøkkel = /^\/api\/spesialist\/personer\/[^/]+\/pa-vent$/;

// Oppgavelista vet ikke hvilken person oppgaven gjelder, så alle påVent-nøkler invalideres
export const useInvaliderPåVent = () => {
    const queryClient = useQueryClient();
    return () =>
        queryClient.invalidateQueries({
            predicate: (query) => typeof query.queryKey[0] === 'string' && påVentnøkkel.test(query.queryKey[0]),
        });
};
