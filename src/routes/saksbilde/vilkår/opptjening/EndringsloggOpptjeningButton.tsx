import React, { ReactElement } from 'react';

import { EndringsloggKildeButton } from '@components/endringslogg/EndringsloggKildeButton';
import { EndringsloggOpptjening } from '@components/endringslogg/EndringsloggOpptjening';

import { Opptjeningsendring } from './useOpptjeningshistorikk';

interface EndringsloggOpptjeningButtonProps {
    endringer: Opptjeningsendring[];
}

export function EndringsloggOpptjeningButton({ endringer }: EndringsloggOpptjeningButtonProps): ReactElement | null {
    if (endringer.length === 0) {
        return null;
    }

    return (
        <EndringsloggKildeButton
            aria-label="Vis endringslogg for opptjeningstid"
            renderEndringslogg={(onOpenChange) => (
                <EndringsloggOpptjening endringer={endringer} onOpenChange={onOpenChange} />
            )}
        />
    );
}
