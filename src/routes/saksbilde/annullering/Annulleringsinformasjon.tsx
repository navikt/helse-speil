import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Maybe, PersonFragment } from '@io/graphql';
import { NORSK_DATOFORMAT } from '@utils/date';
import { somPenger } from '@utils/locale';

import { useTotaltUtbetaltForSykefraværstilfellet } from './annullering';

import styles from './Annulleringsmodal.module.scss';

export const Annulleringsinformasjon = ({ person }: { person: PersonFragment }): Maybe<ReactElement> => {
    const { totalbeløp, førsteUtbetalingsdag, sisteUtbetalingsdag } = useTotaltUtbetaltForSykefraværstilfellet(person);

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
