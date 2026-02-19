import { ReactElement } from 'react';

import { useBrukerrolle } from '@hooks/brukerrolleHooks';
import { ApiBrukerrolle } from '@io/rest/generated/spesialist.schemas';
import { usePollEtterOpptegnelser } from '@io/rest/polling';
import { useAbonnerPåEndringer } from '@io/sse/useAbonnerPåEndringer';

export interface LyttPåEndringerProviderProps {
    personPseudoId?: string;
}

export const LyttPåEndringer = ({ personPseudoId }: LyttPåEndringerProviderProps) => {
    const { isLoading, harRolle } = useBrukerrolle(ApiBrukerrolle.UTVIKLER);
    if (!personPseudoId) return null;
    if (isLoading) return null;
    return harRolle ? (
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
