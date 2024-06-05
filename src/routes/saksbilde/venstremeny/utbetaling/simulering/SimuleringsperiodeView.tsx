import React from 'react';

import { Simuleringsperiode } from '@io/graphql';
import { getFormattedDateString } from '@utils/date';

import { SimuleringsperiodeValue } from './SimuleringsperiodeValue';
import { SimuleringsutbetalingView } from './SimuleringsutbetalingView';

import styles from './SimuleringsperiodeView.module.css';

interface SimuleringsperiodeProps {
    periode: Simuleringsperiode;
}

export const SimuleringsperiodeView: React.FC<SimuleringsperiodeProps> = ({ periode }) => {
    return (
        <div className={styles.Simuleringsperiode}>
            <SimuleringsperiodeValue
                label="Periode"
                value={`${getFormattedDateString(periode.fom)} - ${getFormattedDateString(periode.tom)}`}
            />
            {periode.utbetalinger.map((utbetaling, i) => (
                <SimuleringsutbetalingView utbetaling={utbetaling} key={i} />
            ))}
        </div>
    );
};
