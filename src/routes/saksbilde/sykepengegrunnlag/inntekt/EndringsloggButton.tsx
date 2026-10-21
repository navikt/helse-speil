import React, { ReactElement } from 'react';

import { EndringsloggArbeidsforhold } from '@components/endringslogg/EndringsloggArbeidsforhold';
import { EndringsloggDager } from '@components/endringslogg/EndringsloggDager';
import { EndringsloggInntekt } from '@components/endringslogg/EndringsloggInntekt';
import { EndringsloggKildeButton } from '@components/endringslogg/EndringsloggKildeButton';
import { ApiOverstyring } from '@io/rest/generated/spesialist.schemas';
import { isArbeidsforholdoverstyringer, isInntektoverstyringer, isOverstyringerPrDag } from '@utils/typeguards';

interface EndringsloggButtonProps<T extends ApiOverstyring> extends React.HTMLAttributes<HTMLButtonElement> {
    endringer: T[];
}

export function EndringsloggButton<T extends ApiOverstyring>({
    endringer,
    ...buttonProps
}: EndringsloggButtonProps<T>): ReactElement | null {
    if (endringer.length === 0) {
        return null;
    }

    return (
        <EndringsloggKildeButton
            {...buttonProps}
            renderEndringslogg={(onOpenChange) => (
                <>
                    {isArbeidsforholdoverstyringer(endringer) && (
                        <EndringsloggArbeidsforhold endringer={endringer} onOpenChange={onOpenChange} />
                    )}
                    {isInntektoverstyringer(endringer) && (
                        <EndringsloggInntekt endringer={endringer} onOpenChange={onOpenChange} />
                    )}
                    {isOverstyringerPrDag(endringer) && (
                        <EndringsloggDager endringer={endringer} onOpenChange={onOpenChange} />
                    )}
                </>
            )}
        />
    );
}
