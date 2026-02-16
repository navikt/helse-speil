import { ReactElement } from 'react';

import { useHarFeilsøkingsrolle } from '@hooks/brukerrolleHooks';
import { usePollEtterOpptegnelser } from '@io/rest/polling';
import { useAbonnerPåEndringer } from '@io/sse/polling';

export interface LyttPåEndringerProviderProps {
    personPseudoId?: string;
}

export const LyttPåEndringer = ({ personPseudoId }: LyttPåEndringerProviderProps) => {
    const erUtvikler = useHarFeilsøkingsrolle();
    if (!personPseudoId) return null;
    return erUtvikler ? (
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
