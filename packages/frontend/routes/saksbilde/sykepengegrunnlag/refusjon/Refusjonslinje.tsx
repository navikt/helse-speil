import classNames from 'classnames';
import dayjs from 'dayjs';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { NORSK_DATOFORMAT } from '@utils/date';
import { somPenger } from '@utils/locale';

import styles from './Refusjonslinje.module.css';

interface RefusjonslinjeProps extends React.HTMLAttributes<HTMLTableRowElement> {
    dato: string;
    beløp?: number | null;
}

export const Refusjonslinje: React.VFC<RefusjonslinjeProps> = ({ className, dato, beløp, ...rest }) => {
    return (
        <tr className={classNames(styles.Refusjonslinje, className)} {...rest}>
            <td>
                <BodyShort>{dayjs(dato).format(NORSK_DATOFORMAT)}</BodyShort>
            </td>
            <td>
                <BodyShort>{beløp ? somPenger(beløp) : 'Ingen refusjon'}</BodyShort>
            </td>
        </tr>
    );
};
