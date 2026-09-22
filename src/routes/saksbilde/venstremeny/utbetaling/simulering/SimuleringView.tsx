import React, { ReactElement } from 'react';

import { BodyShort, Heading, VStack } from '@navikt/ds-react';

import { Simulering } from '@io/graphql';
import { somPenger } from '@utils/locale';
import { cn } from '@utils/tw';
import { isNumber } from '@utils/typeguards';

import { SimuleringsperiodeView } from './SimuleringsperiodeView';

interface SimuleringViewProps {
    simulering: Simulering;
    utbetalingId: string;
}

export function SimuleringView({ simulering, utbetalingId }: SimuleringViewProps): ReactElement {
    const førsteUtbetaling = simulering.perioder?.[0]?.utbetalinger[0];
    const utbetalesTil = førsteUtbetaling
        ? `${førsteUtbetaling.mottakerId} ${førsteUtbetaling.mottakerNavn}`
        : undefined;

    return (
        <VStack as="article" gap="space-24" paddingInline="space-32" paddingBlock="space-20 space-32">
            <Heading size="large">Simulering</Heading>
            <VStack gap="space-16">
                {isNumber(simulering.totalbelop) && (
                    <SimuleringValue label="Totalbeløp" value={simulering.totalbelop} />
                )}
                {utbetalesTil && <SimuleringValue label="Utbetales til" value={utbetalesTil} isSensitive />}
                <SimuleringValue label="Utbetaling-ID" value={utbetalingId} />
            </VStack>
            {simulering.perioder?.map((periode) => (
                <SimuleringsperiodeView periode={periode} key={`${periode.fom}-${periode.tom}`} />
            ))}
        </VStack>
    );
}

interface SimuleringValueProps {
    label: string;
    value: string | number;
    isSensitive?: boolean;
}

function SimuleringValue({ label, value, isSensitive }: SimuleringValueProps): ReactElement {
    return (
        <div>
            <BodyShort size="small" weight="semibold">
                {label}
            </BodyShort>
            <BodyShort
                size="small"
                data-sensitive={isSensitive || undefined}
                className={cn(typeof value === 'number' && value < 0 && 'text-ax-text-danger-subtle italic')}
            >
                {typeof value === 'number' ? somPenger(value) : value}
            </BodyShort>
        </div>
    );
}
