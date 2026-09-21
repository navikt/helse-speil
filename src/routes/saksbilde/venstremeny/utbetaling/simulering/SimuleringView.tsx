import React, { ReactElement } from 'react';

import { BodyShort, Heading } from '@navikt/ds-react';

import { Simulering } from '@io/graphql';
import { somPenger } from '@utils/locale';
import { cn } from '@utils/tw';
import { isNumber } from '@utils/typeguards';

import { SimuleringsperiodeView } from './SimuleringsperiodeView';

import styles from './SimuleringView.module.css';

interface SimuleringValueProps {
    label: string;
    value: string | number;
    isSensitive?: boolean;
}

const SimuleringValue = ({ label, value, isSensitive }: SimuleringValueProps): ReactElement => {
    return (
        <div className={styles.SimuleringValue}>
            <BodyShort size="small">{label}</BodyShort>
            <BodyShort
                size="small"
                data-sensitive={isSensitive || undefined}
                className={cn(typeof value === 'number' && value < 0 && styles.NegativtBeløp)}
            >
                {typeof value === 'number' ? somPenger(value) : value}
            </BodyShort>
        </div>
    );
};

interface SimuleringViewProps {
    simulering: Simulering;
    utbetalingId: string;
}

export const SimuleringView = ({ simulering, utbetalingId }: SimuleringViewProps): ReactElement => {
    const utbetalesTil = (() => {
        const utbetaling = simulering.perioder?.[0]?.utbetalinger[0] ?? null;
        return utbetaling ? `${utbetaling.mottakerId} ${utbetaling.mottakerNavn}` : null;
    })();

    return (
        <article className={styles.SimuleringView}>
            <Heading size="large">Simulering</Heading>
            <div className={styles.SimuleringValueContainer}>
                {isNumber(simulering.totalbelop) && (
                    <SimuleringValue label="Totalbeløp" value={simulering.totalbelop} />
                )}
                {utbetalesTil && <SimuleringValue label="Utbetales til" value={utbetalesTil} isSensitive />}
                <SimuleringValue label="Utbetaling-ID" value={utbetalingId} />
            </div>
            {simulering.perioder?.map((periode, i) => (
                <SimuleringsperiodeView periode={periode} key={i} />
            ))}
        </article>
    );
};
