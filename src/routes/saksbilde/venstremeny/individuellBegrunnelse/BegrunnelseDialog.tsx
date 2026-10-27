import React, { Dispatch, ReactElement, SetStateAction } from 'react';

import { ShrinkIcon } from '@navikt/aksel-icons';
import { Button, Dialog, HStack, Tooltip } from '@navikt/ds-react';

import { BegrunnelseInput } from '@saksbilde/venstremeny/individuellBegrunnelse/BegrunnelseInput';

interface BegrunnelseDialogProps {
    vedtakBegrunnelseTekst: string;
    setVedtakBegrunnelseTekst: Dispatch<SetStateAction<string>>;
}

export function BegrunnelseDialog({
    vedtakBegrunnelseTekst,
    setVedtakBegrunnelseTekst,
}: BegrunnelseDialogProps): ReactElement {
    return (
        <Dialog.Popup width="large">
            <Dialog.Header withClosebutton={false}>
                <HStack justify="space-between" align="center">
                    <Dialog.Title>Individuell begrunnelse</Dialog.Title>
                    <Tooltip content="Lukk modal">
                        <Dialog.CloseTrigger>
                            <Button
                                data-color="neutral"
                                size="small"
                                variant="tertiary"
                                icon={<ShrinkIcon aria-hidden />}
                            />
                        </Dialog.CloseTrigger>
                    </Tooltip>
                </HStack>
            </Dialog.Header>
            <Dialog.Body>
                <BegrunnelseInput
                    vedtakBegrunnelseTekst={vedtakBegrunnelseTekst}
                    setVedtakBegrunnelseTekst={setVedtakBegrunnelseTekst}
                    minRows={8}
                />
            </Dialog.Body>
            <Dialog.Footer>
                <Dialog.CloseTrigger>
                    <Button size="xsmall" variant="secondary">
                        Lukk
                    </Button>
                </Dialog.CloseTrigger>
            </Dialog.Footer>
        </Dialog.Popup>
    );
}
