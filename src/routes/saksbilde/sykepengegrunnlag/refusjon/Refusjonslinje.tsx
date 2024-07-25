import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { Endringstrekant } from '@components/Endringstrekant';
import { Kilde } from '@components/Kilde';
import { Kildetype, Maybe } from '@io/graphql';
import { NORSK_DATOFORMAT } from '@utils/date';
import { somPenger } from '@utils/locale';

import styles from './Refusjonslinje.module.css';

interface RefusjonslinjeProps extends React.HTMLAttributes<HTMLTableRowElement> {
    dato: string;
    beløp?: Maybe<number>;
    kilde: string;
    lokalEndring: boolean;
}

export const Refusjonslinje = ({
    className,
    dato,
    beløp,
    kilde,
    lokalEndring,
    ...rest
}: RefusjonslinjeProps): ReactElement => {
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
                        <PersonPencilFillIcon title="Saksbehandler ikon" />
                    </Kilde>
                )}
            </td>
        </tr>
    );
};
