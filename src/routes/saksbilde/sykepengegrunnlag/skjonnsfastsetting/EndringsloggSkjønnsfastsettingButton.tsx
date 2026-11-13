import React, { ReactElement } from 'react';

import { ClockDashedIcon } from '@navikt/aksel-icons';

import { EndringsloggKildeButton } from '@components/endringslogg/EndringsloggKildeButton';
import { EndringsloggSykepengegrunnlagskjønnsfastsetting } from '@components/endringslogg/EndringsloggSykepengegrunnlagskjønnsfastsetting';
import { SykepengegrunnlagskjonnsfastsettingMedArbeidsgiverInfo } from '@saksbilde/sykepengegrunnlag/skjonnsfastsetting/SkjønnsfastsettingHeader';

interface EndringsloggSkjønnsfastsettingButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    endringer: SykepengegrunnlagskjonnsfastsettingMedArbeidsgiverInfo[];
}

export function EndringsloggSkjønnsfastsettingButton({
    endringer,
    ...buttonProps
}: EndringsloggSkjønnsfastsettingButtonProps): ReactElement | null {
    if (endringer.length === 0) {
        return null;
    }

    return (
        <EndringsloggKildeButton
            {...buttonProps}
            ikon={<ClockDashedIcon aria-hidden />}
            renderEndringslogg={(onOpenChange) => (
                <EndringsloggSykepengegrunnlagskjønnsfastsetting endringer={endringer} onOpenChange={onOpenChange} />
            )}
        />
    );
}
