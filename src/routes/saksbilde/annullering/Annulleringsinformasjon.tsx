import styles from './Annulleringsmodal.module.scss';
import dayjs from 'dayjs';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { NORSK_DATOFORMAT } from '@utils/date';
import { somPenger } from '@utils/locale';

import { useTotaltUtbetaltForSykefraværstilfellet } from './annullering';

export const Annulleringsinformasjon = () => {
    const { totalbeløp, førsteUtbetalingsdag, sisteUtbetalingsdag } = useTotaltUtbetaltForSykefraværstilfellet();

    if (!førsteUtbetalingsdag && !sisteUtbetalingsdag && !totalbeløp) return null;

    return (
        <div className={styles.gruppe}>
            <BodyShort>Følgende utbetalinger annulleres:</BodyShort>
            <ul>
                <li>
                    <BodyShort>
                        {førsteUtbetalingsdag !== undefined && dayjs(førsteUtbetalingsdag).format(NORSK_DATOFORMAT)} -{' '}
                        {sisteUtbetalingsdag !== undefined && dayjs(sisteUtbetalingsdag).format(NORSK_DATOFORMAT)}
                        {totalbeløp ? ` - ${somPenger(totalbeløp)}` : null}
                    </BodyShort>
                </li>
            </ul>
        </div>
    );
};
