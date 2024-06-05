import classNames from 'classnames';
import dayjs from 'dayjs';
import React from 'react';

import { CaseworkerFilled } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';

import { Endringstrekant } from '@components/Endringstrekant';
import { Kilde } from '@components/Kilde';
import { Kildetype } from '@io/graphql';
import { NORSK_DATOFORMAT } from '@utils/date';
import { somPenger } from '@utils/locale';

import styles from './Refusjonslinje.module.css';

interface RefusjonslinjeProps extends React.HTMLAttributes<HTMLTableRowElement> {
    dato: string;
    beløp?: number | null;
    kilde: string;
    lokalEndring: boolean;
}

export const Refusjonslinje: React.FC<RefusjonslinjeProps> = ({
    className,
    dato,
    beløp,
    kilde,
    lokalEndring,
    ...rest
}) => {
    return (
        <tr className={classNames(styles.Refusjonslinje, className)} {...rest}>
            <td>
                <BodyShort>{dayjs(dato).format(NORSK_DATOFORMAT)}</BodyShort>
                {lokalEndring && (
                    <Endringstrekant text="Endringene vil oppdateres og kalkuleres etter du har trykket på kalkuler" />
                )}
            </td>
            <td>
                <BodyShort>{beløp ? somPenger(beløp) : 'Ingen refusjon'}</BodyShort>
            </td>
            <td>
                {kilde === Kildetype.Inntektsmelding && <Kilde type={kilde}>IM</Kilde>}
                {kilde === Kildetype.Saksbehandler && (
                    <Kilde type={kilde} className={styles.Ikon}>
                        <CaseworkerFilled title="Caseworker-ikon" />
                    </Kilde>
                )}
            </td>
        </tr>
    );
};
