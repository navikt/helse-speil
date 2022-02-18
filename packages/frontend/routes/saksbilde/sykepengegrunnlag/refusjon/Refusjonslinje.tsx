import React from 'react';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { BodyShort } from '@navikt/ds-react';

import { NORSK_DATOFORMAT } from '@utils/date';
import { somPenger } from '@utils/locale';

import styles from './Refusjonslinje.module.css';
import { Infotrekant } from '@components/Infotrekant';

interface RefusjonslinjeProps extends React.HTMLAttributes<HTMLTableRowElement> {
    dato: string;
    beløp?: number | null;
    overlapperMedAG?: boolean;
}

export const Refusjonslinje: React.VFC<RefusjonslinjeProps> = ({
    className,
    dato,
    beløp,
    overlapperMedAG,
    ...rest
}) => {
    return (
        <tr
            className={classNames(styles.Refusjonslinje, overlapperMedAG && styles.overlapperMedAG, className)}
            {...rest}
        >
            <td>
                {overlapperMedAG && (
                    <Infotrekant className={styles.Infotrekant} text="Refusjonsbeløpet er oppgitt før NAV utbetaler" />
                )}
                <BodyShort>{dayjs(dato).format(NORSK_DATOFORMAT)}</BodyShort>
            </td>
            <td>
                <BodyShort>{beløp ? somPenger(beløp) : 'Ingen refusjon'}</BodyShort>
            </td>
        </tr>
    );
};
