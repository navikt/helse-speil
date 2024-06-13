import React, { PropsWithChildren } from 'react';

import { Tooltip } from '@navikt/ds-react';

import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { Maybe } from '@io/graphql';
import { useIsAnonymous } from '@state/anonymization';

interface ArbeidsgiverikonMedTooltipProps {
    tooltipTekst?: Maybe<string>;
    className?: string;
    onClick?: () => void;
}

export const ArbeidsgiverikonMedTooltip = ({
    className,
    tooltipTekst = null,
    onClick,
    children,
}: PropsWithChildren<ArbeidsgiverikonMedTooltipProps>) => {
    const erAnonymisert = useIsAnonymous();

    return (
        <Tooltip content={tooltipTekst && !erAnonymisert ? tooltipTekst : 'Arbeidsgiver'}>
            <div className={className} onClick={onClick}>
                <Arbeidsgiverikon alt="Arbeidsgiver" />
                {children}
            </div>
        </Tooltip>
    );
};
