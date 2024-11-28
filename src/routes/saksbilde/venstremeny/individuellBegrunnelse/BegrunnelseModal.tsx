import React, { Dispatch, SetStateAction } from 'react';

import { ShrinkIcon } from '@navikt/aksel-icons';
import { Button, HStack, Heading, Modal, VStack } from '@navikt/ds-react';

import { AvslagInput, Avslagstype, Maybe } from '@io/graphql';
import { BegrunnelseInput } from '@saksbilde/venstremeny/individuellBegrunnelse/BegrunnelseInput';
import { knappetekst } from '@saksbilde/venstremeny/individuellBegrunnelse/IndividuellBegrunnelse';

interface BegrunnelseModalProps {
    modalÅpen: boolean;
    lukkModal: () => void;
    avslagstype: Avslagstype.Avslag | Avslagstype.DelvisAvslag;
    preutfyltVerdi: string;
    setAvslag: Dispatch<SetStateAction<Maybe<AvslagInput>>>;
}

export const BegrunnelseModal = ({
    modalÅpen,
    lukkModal,
    avslagstype,
    preutfyltVerdi,
    setAvslag,
}: BegrunnelseModalProps) => (
    <Modal aria-label="Modal" portal closeOnBackdropClick open={modalÅpen} onClose={lukkModal} width="800px">
        <Modal.Header closeButton={false}>
            <HStack justify="space-between" align="center">
                <Heading level="1" size="medium">
                    {knappetekst(avslagstype)}
                </Heading>
                <Button size="small" variant="tertiary-neutral" onClick={lukkModal} icon={<ShrinkIcon />} />
            </HStack>
        </Modal.Header>
        <Modal.Body>
            <VStack gap="4">
                <BegrunnelseInput
                    begrunnelsestype={avslagstype}
                    preutfyltVerdi={preutfyltVerdi}
                    minRows={8}
                    setAvslag={(verdi) => setAvslag(verdi)}
                    focus={true}
                />
                <HStack gap="2">
                    <Button size="xsmall" variant="secondary" onClick={lukkModal}>
                        Lagre
                    </Button>
                </HStack>
            </VStack>
        </Modal.Body>
    </Modal>
);
