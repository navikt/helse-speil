import React from 'react';
import { BodyShort } from '@navikt/ds-react';

import { Dagoverstyring, Dagtype } from '@io/graphql';
import { getFormattedDateString } from '@utils/date';

import { ModalProps } from './Modal';
import { TableModal } from './TableModal';

import styles from './Endringslogg.module.css';

type Overstyring = {
    begrunnelse: string;
    saksbehandler: {
        ident?: Maybe<string>;
        navn: string;
    };
    timestamp: DateString;
    type: Dagtype;
    dato: DateString;
    grad?: Maybe<number>;
    fraType?: Maybe<Dagtype>;
    fraGrad?: Maybe<number>;
};

const getDisplayTextForDagtype = (type: Dagtype): string => {
    switch (type) {
        case Dagtype.Egenmeldingsdag:
            return 'Egenmelding';
        case Dagtype.Feriedag:
            return 'Ferie';
        case Dagtype.Permisjonsdag:
            return 'Permisjon';
        case Dagtype.Sykedag:
            return 'Syk';
    }
};

const getOverstyringerPrDag = (endringer: Array<Dagoverstyring>): Array<Overstyring> => {
    const overstyringer: Array<Overstyring> = [];

    for (const endring of endringer) {
        for (const dag of endring.dager) {
            overstyringer.push({
                begrunnelse: endring.begrunnelse,
                saksbehandler: endring.saksbehandler,
                timestamp: endring.timestamp,
                type: dag.type,
                grad: dag.grad,
                dato: dag.dato,
            });
        }
    }

    return overstyringer;
};

interface EndringsloggDagerProps extends ModalProps {
    endringer: Array<OverstyringerPrDag>;
}

export const EndringsloggDager: React.FC<EndringsloggDagerProps> = ({ endringer, ...modalProps }) => {
    return (
        <TableModal {...modalProps} title="Endringslogg" contentLabel="Endringslogg">
            <thead>
                <tr>
                    <th>Dato</th>
                    <th>Dagtype</th>
                    <th>Grad</th>
                    <th>Begrunnelse</th>
                    <th>Kilde</th>
                    <th>Endret dato</th>
                </tr>
            </thead>
            <tbody>
                {endringer.map(({ begrunnelse, saksbehandler, timestamp, grad, type, dato }, i) => (
                    <tr key={i}>
                        <td>{getFormattedDateString(dato)}</td>
                        <td>{type}</td>
                        <td>{typeof grad === 'number' && `${grad} %`}</td>
                        <td>
                            <BodyShort className={styles.Begrunnelse}>{begrunnelse}</BodyShort>
                        </td>
                        <td>{saksbehandler.ident ?? saksbehandler.navn}</td>
                        <td>{getFormattedDateString(timestamp)}</td>
                    </tr>
                ))}
            </tbody>
        </TableModal>
    );
};
