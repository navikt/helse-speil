import classNames from 'classnames';
import dayjs from 'dayjs';
import React from 'react';

import { CaseworkerFilled } from '@navikt/ds-icons';
import { BodyShort, Tooltip } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { Kildetype } from '@io/graphql';
import { NORSK_DATOFORMAT } from '@utils/date';
import { somPenger } from '@utils/locale';

import { getKildeTypeTooltip } from '../../utbetaling/utbetalingstabell/KildeCell';

import styles from './Refusjonslinje.module.css';

interface RefusjonslinjeProps extends React.HTMLAttributes<HTMLTableRowElement> {
    dato: string;
    beløp?: number | null;
    kilde: string;
}

export const Refusjonslinje: React.FC<RefusjonslinjeProps> = ({ className, dato, beløp, kilde, ...rest }) => {
    return (
        <tr className={classNames(styles.Refusjonslinje, className)} {...rest}>
            <td>
                <BodyShort>{dayjs(dato).format(NORSK_DATOFORMAT)}</BodyShort>
            </td>
            <td>
                <BodyShort>{beløp ? somPenger(beløp) : 'Ingen refusjon'}</BodyShort>
            </td>
            <td>
                {kilde === Kildetype.Inntektsmelding && (
                    <Tooltip content={getKildeTypeTooltip(kilde)}>
                        <Kilde type={kilde}>IM</Kilde>
                    </Tooltip>
                )}
                {kilde === Kildetype.Saksbehandler && (
                    <Tooltip content={getKildeTypeTooltip(kilde)}>
                        <Kilde type={kilde} className={styles.Ikon}>
                            <CaseworkerFilled height={12} width={12} />
                        </Kilde>
                    </Tooltip>
                )}
            </td>
        </tr>
    );
};
