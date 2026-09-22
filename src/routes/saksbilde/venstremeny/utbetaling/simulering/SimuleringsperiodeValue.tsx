import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { somPenger } from '@utils/locale';
import { cn } from '@utils/tw';

interface SimuleringsperiodeValueProps extends React.HTMLAttributes<HTMLElement> {
    label: string;
    value: string | number;
    isSensitive?: boolean;
}

export function SimuleringsperiodeValue({
    label,
    value,
    isSensitive,
    ...props
}: SimuleringsperiodeValueProps): ReactElement {
    return (
        <>
            <BodyShort size="small" {...props}>
                {label}
            </BodyShort>
            <BodyShort
                size="small"
                data-sensitive={isSensitive || undefined}
                className={cn(
                    'font-semibold',
                    typeof value === 'number' && value < 0 && 'text-ax-text-danger-subtle italic',
                )}
            >
                {typeof value === 'number' ? somPenger(value) : value}
            </BodyShort>
        </>
    );
}
