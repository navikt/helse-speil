import dayjs from 'dayjs';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { sortTimestampDesc } from '@components/endringslogg/endringsloggUtils';
import { Inntektoverstyring } from '@io/graphql';
import { NORSK_DATOFORMAT, getFormattedDateString } from '@utils/date';
import { somPenger } from '@utils/locale';

import { ModalProps } from '../Modal';
import { TableModal } from '../TableModal';

import styles from './Endringslogg.module.css';

interface EndringsloggInntektProps extends ModalProps {
    endringer: Array<Inntektoverstyring>;
}

export const EndringsloggInntekt = ({ endringer, ...modalProps }: EndringsloggInntektProps) => (
    <TableModal {...modalProps} title="Endringslogg" contentLabel="Endringslogg">
        <thead>
            <tr>
                <th>Dato</th>
                <th>Månedsbeløp</th>
                <th>Skjæringstidspunkt</th>
                <th>Begrunnelse</th>
                <th>Forklaring</th>
                <th>Kilde</th>
            </tr>
        </thead>
        <tbody>
            {endringer
                .sort((a, b) => sortTimestampDesc(a.timestamp, b.timestamp))
                .map((endring, i) => (
                    <tr key={i}>
                        <td>{dayjs(endring.timestamp).format(NORSK_DATOFORMAT)}</td>
                        <td>
                            <span className={styles.PreviousValue}>
                                {somPenger(endring.inntekt.fraManedligInntekt)}
                            </span>{' '}
                            {somPenger(endring.inntekt.manedligInntekt)}
                        </td>
                        <td>{getFormattedDateString(endring.inntekt.skjaeringstidspunkt)}</td>
                        <td>
                            <BodyShort className={styles.Begrunnelse}>{endring.inntekt.begrunnelse}</BodyShort>
                        </td>
                        <td>
                            <BodyShort className={styles.Begrunnelse}>{endring.inntekt.forklaring}</BodyShort>
                        </td>
                        <td>{endring.saksbehandler.ident ?? endring.saksbehandler.navn}</td>
                    </tr>
                ))}
        </tbody>
    </TableModal>
);
