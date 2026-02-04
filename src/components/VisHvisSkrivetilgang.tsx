import { ReactElement, ReactNode } from 'react';

import { useHarSkrivetilgang } from '@hooks/brukerrolleHooks';

interface VisHvisSkrivetilgangProps {
    children: ReactNode;
}

export const VisHvisSkrivetilgang = ({ children }: VisHvisSkrivetilgangProps): ReactElement | null => {
    const harSkrivetilgang = useHarSkrivetilgang();

    if (!harSkrivetilgang) {
        return null;
    }

    return <>{children}</>;
};
