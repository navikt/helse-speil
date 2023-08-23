import React, { PropsWithChildren } from 'react';

import { Tooltip } from '@navikt/ds-react';

import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { useIsAnonymous } from '@state/anonymization';

interface ArbeidsgiverikonMedTooltipProps {
    tooltipTekst?: Maybe<string>;
    className?: string;
}

export const ArbeidsgiverikonMedTooltip = ({
    className,
    tooltipTekst = null,
    children,
}: PropsWithChildren<ArbeidsgiverikonMedTooltipProps>) => {
    const erAnonymisert = useIsAnonymous();

    return (
        <Tooltip content={tooltipTekst && !erAnonymisert ? tooltipTekst : 'Arbeidsgiver'}>
            <div className={className}>
                <Arbeidsgiverikon alt="Arbeidsgiver" />
                {children}
            </div>
        </Tooltip>
    );
};
