import React, { ReactElement } from 'react';

import { BodyShort, Heading } from '@navikt/ds-react';

import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { Simulering } from '@io/graphql';
import { somPenger } from '@utils/locale';
import { cn } from '@utils/tw';

import { SimuleringsperiodeView } from './SimuleringsperiodeView';

import styles from './SimuleringView.module.css';

interface SimuleringValueProps {
    label: string;
    value: string | number;
}

const SimuleringValue = ({ label, value }: SimuleringValueProps): ReactElement => {
    return (
        <div className={styles.SimuleringValue}>
            <BodyShort size="small">{label}</BodyShort>
            <BodyShort size="small" className={cn(typeof value === 'number' && value < 0 && styles.NegativtBeløp)}>
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
                {simulering.totalbelop && <SimuleringValue label="Totalbeløp" value={simulering.totalbelop} />}
                {utbetalesTil && (
                    <AnonymizableContainer>
                        <SimuleringValue label="Utbetales til" value={utbetalesTil} />
                    </AnonymizableContainer>
                )}
                <SimuleringValue label="Utbetaling-ID" value={utbetalingId} />
            </div>
            {simulering.perioder?.map((periode, i) => (
                <SimuleringsperiodeView periode={periode} key={i} />
            ))}
        </article>
    );
};
