import styles from './Annulleringsmodal.module.scss';
import dayjs from 'dayjs';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { NORSK_DATOFORMAT } from '@utils/date';
import { somPenger } from '@utils/locale';

import { useTotaltUtbetaltForSykefraværstilfellet } from './annullering';

export const Annulleringsinformasjon = () => {
    const { totalbeløp, førsteUtbetalingsdag, sisteUtbetalingsdag } = useTotaltUtbetaltForSykefraværstilfellet();

    return (
        <div className={styles.gruppe}>
            <BodyShort>Følgende utbetalinger annulleres:</BodyShort>
            <ul>
                <li>
                    <BodyShort>
                        {dayjs(førsteUtbetalingsdag).format(NORSK_DATOFORMAT)} -{' '}
                        {dayjs(sisteUtbetalingsdag).format(NORSK_DATOFORMAT)}
                        {totalbeløp ? ` - ${somPenger(totalbeløp)}` : null}
                    </BodyShort>
                </li>
            </ul>
        </div>
    );
};
