import React, { PropsWithChildren, ReactElement } from 'react';

import { BodyShort, HStack, Heading, Modal, VStack } from '@navikt/ds-react';

import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { OppgaveProjeksjonPaaVent, Personnavn } from '@io/graphql';
import { getFormattedDatetimeString, somNorskDato } from '@utils/date';
import { getFormatertNavn } from '@utils/string';

import styles from './PåVentListeModal.module.scss';

type PåVentListeModalProps = {
    closeModal: () => void;
    showModal: boolean;
    navn: Personnavn;
    påVentInfo: OppgaveProjeksjonPaaVent;
};

export const PåVentListeModal = ({ closeModal, showModal, navn, påVentInfo }: PåVentListeModalProps): ReactElement => {
    const søkernavn = getFormatertNavn(navn);

    return (
        <Modal
            aria-label="Legg på vent notater modal"
            portal
            closeOnBackdropClick
            open={showModal}
            onClose={closeModal}
        >
            <Modal.Header>
                <Heading level="1" size="medium" className={styles.tittel}>
                    Lagt på vent
                </Heading>
            </Modal.Header>
            <Modal.Body>
                <VStack gap="6">
                    <HStack gap="12">
                        <Innhold tittel="Søker" anonymize>
                            {søkernavn}
                        </Innhold>
                        <Innhold tittel="Dato">{getFormattedDatetimeString(påVentInfo.opprettet)}</Innhold>
                        <Innhold tittel="Frist">{somNorskDato(påVentInfo.tidsfrist)}</Innhold>
                        <Innhold tittel="Saksbehandler">{påVentInfo.saksbehandler}</Innhold>
                    </HStack>
                    {påVentInfo.arsaker.length > 0 && (
                        <Innhold tittel="Årsak">
                            <ul>
                                {påVentInfo.arsaker.map((årsak) => (
                                    <li key={årsak}>{årsak}</li>
                                ))}
                            </ul>
                        </Innhold>
                    )}
                    {!!påVentInfo.tekst && <Innhold tittel="Notat">{påVentInfo.tekst}</Innhold>}
                    {påVentInfo.kommentarer.length > 0 && (
                        <Innhold tittel="Kommentarer">
                            {påVentInfo.kommentarer.map((kommentar) => (
                                <HStack gap="6" wrap={false} key={kommentar.id}>
                                    <BodyShort className={styles.kommentardato}>
                                        {getFormattedDatetimeString(kommentar.opprettet)}
                                    </BodyShort>
                                    <BodyShort>{kommentar.tekst}</BodyShort>
                                </HStack>
                            ))}
                        </Innhold>
                    )}
                </VStack>
            </Modal.Body>
        </Modal>
    );
};

interface TingProps {
    tittel: string;
    anonymize?: boolean;
}

const Innhold = ({ tittel, children, anonymize = false }: PropsWithChildren<TingProps>): ReactElement => (
    <VStack>
        <Heading level="2" size="xsmall">
            {tittel}
        </Heading>
        {anonymize ? <AnonymizableText>{children}</AnonymizableText> : <BodyShort>{children}</BodyShort>}
    </VStack>
);
