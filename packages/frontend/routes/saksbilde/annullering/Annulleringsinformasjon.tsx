import dayjs from 'dayjs';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Utbetaling } from '@io/graphql';
import { NORSK_DATOFORMAT } from '@utils/date';
import { somPenger } from '@utils/locale';

import {
    finnFørsteUtbetalingsdag,
    finnSisteUtbetalingsdag,
    finnTotalBruttoUtbetaltForSykefraværstilfellet,
} from './annullering';

interface AnnulleringsinformasjonProps {
    utbetaling: Maybe<Utbetaling>;
}

export const Annulleringsinformasjon = ({ utbetaling }: AnnulleringsinformasjonProps) => {
    const totalBruttoUtbetaltForSykefraværstilfellet = finnTotalBruttoUtbetaltForSykefraværstilfellet(utbetaling);
    const førsteUtbetalingsdag = finnFørsteUtbetalingsdag(utbetaling);
    const sisteUtbetalingsdag = finnSisteUtbetalingsdag(utbetaling);

    return (
        <ul>
            {utbetaling?.arbeidsgiversimulering?.perioder && (
                <li>
                    <BodyShort>
                        {dayjs(førsteUtbetalingsdag).format(NORSK_DATOFORMAT)} -{' '}
                        {dayjs(sisteUtbetalingsdag).format(NORSK_DATOFORMAT)}
                        {totalBruttoUtbetaltForSykefraværstilfellet
                            ? ` - ${somPenger(totalBruttoUtbetaltForSykefraværstilfellet)}`
                            : null}
                    </BodyShort>
                </li>
            )}
        </ul>
    );
};
