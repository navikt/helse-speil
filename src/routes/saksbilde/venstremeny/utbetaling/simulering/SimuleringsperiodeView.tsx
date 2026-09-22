import React, { ReactElement } from 'react';

import { HGrid } from '@navikt/ds-react';

import { Simuleringsperiode } from '@io/graphql';
import { getFormattedDateString } from '@utils/date';

import { SimuleringsperiodeValue } from './SimuleringsperiodeValue';
import { SimuleringsutbetalingView } from './SimuleringsutbetalingView';

interface SimuleringsperiodeProps {
    periode: Simuleringsperiode;
}

export function SimuleringsperiodeView({ periode }: SimuleringsperiodeProps): ReactElement {
    return (
        <HGrid
            columns="1fr 1fr"
            gap="space-0 space-16"
            paddingBlock="space-16 space-0"
            className="border-t border-ax-border-neutral"
        >
            <SimuleringsperiodeValue
                label="Periode"
                value={`${getFormattedDateString(periode.fom)} - ${getFormattedDateString(periode.tom)}`}
            />
            {periode.utbetalinger.map((utbetaling, i) => (
                <SimuleringsutbetalingView utbetaling={utbetaling} key={i} />
            ))}
        </HGrid>
    );
}
