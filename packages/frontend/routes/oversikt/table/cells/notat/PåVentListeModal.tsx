import React, { useState } from 'react';

import { LinkButton } from '@components/LinkButton';
import { TableModal } from '@components/TableModal';
import { NotatType, Personnavn } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { getFormatertNavn } from '@utils/string';

import { NotatListeRad } from './NotatListeRad';
import { NyttNotatModal } from './NyttNotatModal';

import styles from './NotatListeModal.module.css';

interface PåVentListeModalProps {
    notater: Notat[];
    vedtaksperiodeId: string;
    navn: Personnavn;
    onClose: (event: React.SyntheticEvent) => void;
    erPåVent?: boolean;
}

export const PåVentListeModal = ({ notater, vedtaksperiodeId, navn, onClose, erPåVent }: PåVentListeModalProps) => {
    const [showNyttNotatModal, setShowNyttNotatModal] = useState(false);
    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const søkernavn = getFormatertNavn(navn);

    const closeModal = (event: React.SyntheticEvent) => {
        onClose(event);
    };

    const toggleShowNyttNotatModal = () => {
        setShowNyttNotatModal((prevState) => !prevState);
    };

    return showNyttNotatModal ? (
        <NyttNotatModal
            onClose={toggleShowNyttNotatModal}
            navn={navn}
            vedtaksperiodeId={vedtaksperiodeId}
            notattype={NotatType.PaaVent}
        />
    ) : (
        <TableModal
            title={
                <div className={styles.Title}>
                    <p>Lagt på vent - notater</p>
                    <p>Søker: {søkernavn}</p>
                </div>
            }
            contentLabel="Lagt på vent - notater"
            isOpen
            onRequestClose={closeModal}
        >
            <thead>
                <tr>
                    <th>Dato</th>
                    <th>Saksbehandler</th>
                    <th>Kommentar</th>
                    <td />
                </tr>
            </thead>
            <tbody>
                {notater.map((notat) => (
                    <NotatListeRad key={notat.id} notat={notat} innloggetSaksbehandler={innloggetSaksbehandler} />
                ))}
            </tbody>
            {erPåVent && (
                <tfoot>
                    <tr>
                        <td colSpan={4} style={{ textAlign: 'right', paddingTop: '1.5rem' }}>
                            <LinkButton onClick={toggleShowNyttNotatModal}>Legg til nytt notat</LinkButton>
                        </td>
                    </tr>
                </tfoot>
            )}
        </TableModal>
    );
};
