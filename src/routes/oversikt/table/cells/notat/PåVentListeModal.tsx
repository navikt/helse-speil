import React, { ReactElement, useRef, useState } from 'react';

import { Heading, Modal, Table } from '@navikt/ds-react';

import { LinkButton } from '@components/LinkButton';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { NotatType, Personnavn } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { Notat } from '@typer/notat';
import { getFormatertNavn } from '@utils/string';

import { NotatListeRad } from './NotatListeRad';
import { NyttNotatModal } from './NyttNotatModal';

import styles from './PåVentModal.module.scss';

type PåVentListeModalProps = {
    setShowModal: (visModal: boolean) => void;
    showModal: boolean;
    notater: Notat[];
    vedtaksperiodeId: string;
    navn: Personnavn;
    erPåVent?: boolean;
};

export const PåVentListeModal = ({
    setShowModal,
    showModal,
    notater,
    vedtaksperiodeId,
    navn,
    erPåVent,
}: PåVentListeModalProps): ReactElement => {
    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const søkernavn = getFormatertNavn(navn);
    const [showNyttNotatModal, setShowNyttNotatModal] = useState(false);
    const ref = useRef<HTMLDialogElement>(null);

    const toggleShowNyttNotatModal = () => {
        setShowNyttNotatModal((prevState) => !prevState);
    };

    return showNyttNotatModal ? (
        <NyttNotatModal
            setShowModal={setShowNyttNotatModal}
            showModal={showNyttNotatModal}
            navn={navn}
            vedtaksperiodeId={vedtaksperiodeId}
            notattype={NotatType.PaaVent}
        />
    ) : (
        <Modal
            ref={ref}
            aria-label="Legg på vent notater modal"
            portal
            closeOnBackdropClick
            open={showModal}
            onClose={() => setShowModal(false)}
        >
            <Modal.Header>
                <Heading level="1" size="medium" className={styles.tittel}>
                    Lagt på vent - notater
                </Heading>
                <AnonymizableText size="small">{`Søker: ${søkernavn}`}</AnonymizableText>
            </Modal.Header>
            <Modal.Body>
                <Table zebraStripes>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Dato</Table.HeaderCell>
                            <Table.HeaderCell>Saksbehandler</Table.HeaderCell>
                            <Table.HeaderCell>Kommentar</Table.HeaderCell>
                            <Table.DataCell />
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {notater.map((notat) => (
                            <NotatListeRad
                                key={notat.id}
                                notat={notat}
                                innloggetSaksbehandler={innloggetSaksbehandler}
                            />
                        ))}
                    </Table.Body>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                {erPåVent && <LinkButton onClick={toggleShowNyttNotatModal}>Legg til nytt notat</LinkButton>}
            </Modal.Footer>
        </Modal>
    );
};
