import classNames from 'classnames';
import React from 'react';

import { BodyShort, Heading } from '@navikt/ds-react';

import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { Simulering } from '@io/graphql';
import { somPenger } from '@utils/locale';

import { SimuleringsperiodeView } from './SimuleringsperiodeView';

import styles from './SimuleringView.module.css';

interface SimuleringValueProps {
    label: string;
    value: string | number;
}

const SimuleringValue: React.FC<SimuleringValueProps> = ({ label, value }) => {
    return (
        <div className={styles.SimuleringValue}>
            <BodyShort size="small">{label}</BodyShort>
            <BodyShort
                size="small"
                className={classNames(typeof value === 'number' && value < 0 && styles.NegativtBeløp)}
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

export const SimuleringView: React.FC<SimuleringViewProps> = ({ simulering, utbetalingId }) => {
    const utbetalesTil = (() => {
        const utbetaling = simulering.perioder?.[0].utbetalinger[0] ?? null;
        return utbetaling ? `${utbetaling.mottakerId} ${utbetaling.mottakerNavn}` : null;
    })();

    return (
        <div className={styles.SimuleringView}>
            <Heading as="h1" size="large">
                Simulering
            </Heading>
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
        </div>
    );
};
