import { ReactElement } from 'react';

import { useGetBruker } from '@io/rest/generated/saksbehandlere/saksbehandlere';
import { ApiBruker, ApiBrukerrolle } from '@io/rest/generated/spesialist.schemas';
import { usePollEtterOpptegnelser } from '@io/rest/polling';
import { useAbonnerPåEndringer } from '@io/sse/useAbonnerPåEndringer';

const harBrukerrolle = (data: ApiBruker, rolle: ApiBrukerrolle) => {
    return data?.brukerroller?.includes(rolle) ?? false;
};

export interface LyttPåEndringerProviderProps {
    personPseudoId?: string;
}

export const LyttPåEndringer = ({ personPseudoId }: LyttPåEndringerProviderProps) => {
    const { isLoading, data } = useGetBruker();
    if (!personPseudoId || isLoading || !data) return null;
    const erUtvikler = harBrukerrolle(data, ApiBrukerrolle.UTVIKLER);
    const harTilgangTilNæringsdrivende = harBrukerrolle(data, ApiBrukerrolle.SELVSTENDIG_NÆRINGSDRIVENDE_BETA);
    const betaBruker = erUtvikler || harTilgangTilNæringsdrivende;

    return betaBruker ? (
        <MottaEndringerOverStrøm personPseudoId={personPseudoId} />
    ) : (
        <PollEtterEndringer personPseudoId={personPseudoId} />
    );
};

export function PollEtterEndringer({ personPseudoId }: LyttPåEndringerProviderProps): ReactElement {
    usePollEtterOpptegnelser(personPseudoId);
    return <></>;
}

export function MottaEndringerOverStrøm({ personPseudoId }: LyttPåEndringerProviderProps): ReactElement {
    useAbonnerPåEndringer(personPseudoId);
    return <></>;
}
