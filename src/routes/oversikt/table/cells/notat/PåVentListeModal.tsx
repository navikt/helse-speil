import React, { PropsWithChildren, ReactElement, useState } from 'react';

import { BodyShort, HStack, Heading, Modal, VStack } from '@navikt/ds-react';

import { NotatType, PaVentInfo, Personnavn } from '@io/graphql';
import { getFormattedDatetimeString, somNorskDato } from '@utils/date';
import { getFormatertNavn } from '@utils/string';

import { NyttNotatModal } from './NyttNotatModal';

import styles from './PåVentModal.module.scss';

type PåVentListeModalProps = {
    onClose: () => void;
    showModal: boolean;
    vedtaksperiodeId: string;
    navn: Personnavn;
    påVentInfo: PaVentInfo;
};

export const PåVentListeModal = ({
    onClose,
    showModal,
    vedtaksperiodeId,
    navn,
    påVentInfo,
}: PåVentListeModalProps): ReactElement => {
    const søkernavn = getFormatertNavn(navn);
    const [showNyttNotatModal, setShowNyttNotatModal] = useState(false);

    return showNyttNotatModal ? (
        <NyttNotatModal
            onClose={() => setShowNyttNotatModal(false)}
            showModal={showNyttNotatModal}
            navn={navn}
            vedtaksperiodeId={vedtaksperiodeId}
            notattype={NotatType.PaaVent}
        />
    ) : (
        <Modal aria-label="Legg på vent notater modal" portal closeOnBackdropClick open={showModal} onClose={onClose}>
            <Modal.Header>
                <Heading level="1" size="medium" className={styles.tittel}>
                    Lagt på vent
                </Heading>
            </Modal.Header>
            <Modal.Body>
                <VStack gap="6">
                    <HStack gap="12">
                        <Ting tittel="Søker">{søkernavn}</Ting>
                        <Ting tittel="Dato">{getFormattedDatetimeString(påVentInfo.opprettet)}</Ting>
                        <Ting tittel="Frist">{somNorskDato(påVentInfo.tidsfrist)}</Ting>
                        <Ting tittel="Saksbehandler">{påVentInfo.saksbehandler}</Ting>
                    </HStack>
                    {påVentInfo.arsaker.length > 0 && (
                        <Ting tittel="Årsak">
                            <ul>
                                {påVentInfo.arsaker.map((årsak) => (
                                    <li key={årsak}>{årsak}</li>
                                ))}
                            </ul>
                        </Ting>
                    )}
                    {!!påVentInfo.tekst && <Ting tittel="Notat">{påVentInfo.tekst}</Ting>}
                    {påVentInfo.kommentarer.length > 0 && (
                        <Ting tittel="Kommentarer">
                            {påVentInfo.kommentarer.map((kommentar) => (
                                <HStack gap="6" wrap={false} key={kommentar.id}>
                                    <BodyShort className={styles.kommentardato}>
                                        {getFormattedDatetimeString(kommentar.opprettet)}
                                    </BodyShort>
                                    <BodyShort>{kommentar.tekst}</BodyShort>
                                </HStack>
                            ))}
                        </Ting>
                    )}
                </VStack>
            </Modal.Body>
            {/*<Modal.Footer>*/}
            {/*    <Button variant="primary" onClick={() => setShowNyttNotatModal((prevState) => !prevState)}>*/}
            {/*        Legg til nytt notat*/}
            {/*    </Button>*/}
            {/*</Modal.Footer>*/}
        </Modal>
    );
};

interface TingProps {
    tittel: string;
}

const Ting = ({ tittel, children }: PropsWithChildren<TingProps>) => (
    <VStack>
        <Heading level="2" size="xsmall">
            {tittel}
        </Heading>
        <BodyShort>{children}</BodyShort>
    </VStack>
);
