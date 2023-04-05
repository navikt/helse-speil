import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Arbeidsforholdoverstyring } from '@io/graphql';
import { getFormattedDateString } from '@utils/date';

import { ModalProps } from '../Modal';
import { TableModal } from '../TableModal';

import styles from './Endringslogg.module.css';

interface EndringsloggArbeidsforholdProps extends ModalProps {
    endringer: Array<Arbeidsforholdoverstyring>;
}

export const EndringsloggArbeidsforhold: React.FC<EndringsloggArbeidsforholdProps> = ({ endringer, ...modalProps }) => {
    return (
        <TableModal {...modalProps} title="Endringslogg" contentLabel="Endringslogg">
            <thead>
                <tr>
                    <th>Dato</th>
                    <th />
                    <th>Skjæringstidspunkt</th>
                    <th>Begrunnelse</th>
                    <th>Forklaring</th>
                    <th>Kilde</th>
                </tr>
            </thead>
            <tbody>
                {endringer.map((endring, i) => (
                    <tr key={i}>
                        <td>{getFormattedDateString(endring.timestamp)}</td>
                        <td>{endring.deaktivert ? 'Brukes ikke i beregningen' : 'Brukes i beregningen'}</td>
                        <td>{getFormattedDateString(endring.skjaeringstidspunkt)}</td>
                        <td>
                            <BodyShort className={styles.Begrunnelse}>{endring.begrunnelse}</BodyShort>
                        </td>
                        <td>
                            <BodyShort className={styles.Begrunnelse}>{endring.forklaring}</BodyShort>
                        </td>
                        <td>{endring.saksbehandler.ident ?? endring.saksbehandler.navn}</td>
                    </tr>
                ))}
            </tbody>
        </TableModal>
    );
};
