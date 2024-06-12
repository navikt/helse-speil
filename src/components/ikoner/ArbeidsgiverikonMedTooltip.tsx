import React, { PropsWithChildren } from 'react';

import { Tooltip } from '@navikt/ds-react';

import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { useIsAnonymous } from '@state/anonymization';
import { Maybe } from '@utils/ts';

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
