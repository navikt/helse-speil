import React, { Dispatch, SetStateAction } from 'react';

import { ShrinkIcon } from '@navikt/aksel-icons';
import { Button, HStack, Heading, Modal, VStack } from '@navikt/ds-react';

import { BegrunnelseInput } from '@saksbilde/venstremeny/individuellBegrunnelse/BegrunnelseInput';

interface BegrunnelseModalProps {
    modalÅpen: boolean;
    lukkModal: () => void;
    vedtakBegrunnelseTekst: string;
    setVedtakBegrunnelseTekst: Dispatch<SetStateAction<string>>;
}

export const BegrunnelseModal = ({
    modalÅpen,
    lukkModal,
    vedtakBegrunnelseTekst,
    setVedtakBegrunnelseTekst,
}: BegrunnelseModalProps) => (
    <Modal aria-label="Modal" portal closeOnBackdropClick open={modalÅpen} onClose={lukkModal} width="800px">
        <Modal.Header closeButton={false}>
            <HStack justify="space-between" align="center">
                <Heading level="1" size="medium">
                    Individuell begrunnelse
                </Heading>
                <Button size="small" variant="tertiary-neutral" onClick={lukkModal} icon={<ShrinkIcon />} />
            </HStack>
        </Modal.Header>
        <Modal.Body>
            <VStack gap="space-16">
                <BegrunnelseInput
                    vedtakBegrunnelseTekst={vedtakBegrunnelseTekst}
                    setVedtakBegrunnelseTekst={setVedtakBegrunnelseTekst}
                    minRows={8}
                />
                <HStack gap="space-8">
                    <Button size="xsmall" variant="secondary" onClick={lukkModal}>
                        Lukk
                    </Button>
                </HStack>
            </VStack>
        </Modal.Body>
    </Modal>
);
