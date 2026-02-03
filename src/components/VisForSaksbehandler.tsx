import { ReactElement, ReactNode } from 'react';

import { useErSaksbehandler } from '@hooks/brukerrolleHooks';

interface VisForSaksbehandlerProps {
    children: ReactNode;
}

export const VisForSaksbehandler = ({ children }: VisForSaksbehandlerProps): ReactElement | null => {
    const erSaksbehandler = useErSaksbehandler();

    if (!erSaksbehandler) {
        return null;
    }

    return <>{children}</>;
};
