import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Table } from '@navikt/ds-react';

import { Endringstrekant } from '@components/Endringstrekant';
import { Kilde } from '@components/Kilde';
import { Kildetype, Maybe } from '@io/graphql';
import { NORSK_DATOFORMAT } from '@utils/date';
import { somPenger } from '@utils/locale';

import styles from './Refusjonslinje.module.css';

interface RefusjonslinjeProps {
    fom: string;
    tom?: string;
    beløp?: Maybe<number>;
    kilde: string;
    lokalEndring: boolean;
}

export const Refusjonslinje = ({ fom, tom, beløp, kilde, lokalEndring }: RefusjonslinjeProps): ReactElement => {
    return (
        <Table.Row>
            <Table.DataCell>
                <BodyShort>{dayjs(fom).format(NORSK_DATOFORMAT)}</BodyShort>
                {lokalEndring && (
                    <Endringstrekant text="Endringene vil oppdateres og kalkuleres etter du har trykket på kalkuler" />
                )}
            </Table.DataCell>
            <Table.DataCell>
                <BodyShort>{tom == undefined ? '-' : dayjs(tom).format(NORSK_DATOFORMAT)}</BodyShort>
            </Table.DataCell>
            <Table.DataCell align="right">
                <BodyShort>{beløp ? somPenger(beløp) : 'Ingen refusjon'}</BodyShort>
            </Table.DataCell>
            <Table.DataCell>
                {kilde === Kildetype.Inntektsmelding && <Kilde type={kilde}>IM</Kilde>}
                {kilde === Kildetype.Saksbehandler && (
                    <Kilde type={kilde} className={styles.Ikon}>
                        <PersonPencilFillIcon title="Saksbehandler ikon" />
                    </Kilde>
                )}
            </Table.DataCell>
        </Table.Row>
    );
};
