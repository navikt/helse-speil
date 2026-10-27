import React, { ReactElement, useState } from 'react';

import {
    BodyLong,
    Button,
    Dialog,
    HStack,
    Heading,
    InlineMessage,
    Label,
    Popover,
    Tag,
    VStack,
} from '@navikt/ds-react';

import { OpphevStansAutomatiskBehandlingDialogInnhold } from '@saksbilde/saksbildeMenu/dropdown/stansAutomatiskBehandling/OpphevStansAutomatiskBehandlingDialogInnhold';
import { somNorskDato } from '@utils/date';

interface AutomatiskBehandlingStansetTagProps {
    erStanset: boolean;
    dato: string;
    begrunnelse: string | null | undefined;
    fødselsnummer: string;
}

export function AutomatiskBehandlingStansetTag({
    erStanset,
    dato,
    begrunnelse,
    fødselsnummer,
}: AutomatiskBehandlingStansetTagProps): ReactElement | null {
    const [anker, setAnker] = useState<HTMLButtonElement | null>(null);
    const [popoverÅpen, setPopoverÅpen] = useState(false);
    const [dialogÅpen, setDialogÅpen] = useState(false);

    if (!erStanset) return null;

    function åpneOpphevDialog() {
        setPopoverÅpen(false);
        setDialogÅpen(true);
    }

    return (
        <>
            <button
                ref={setAnker}
                type="button"
                aria-expanded={popoverÅpen}
                aria-haspopup="dialog"
                onClick={() => setPopoverÅpen((åpen) => !åpen)}
                className="rounded-ax-radius-4 cursor-pointer"
            >
                <Tag variant="outline" data-color="danger" size="small">
                    {`Automatisk behandling stanset ${somNorskDato(dato)}`}
                </Tag>
            </button>
            <Popover anchorEl={anker} open={popoverÅpen} onClose={() => setPopoverÅpen(false)} placement="bottom-start">
                <Popover.Content className="whitespace-normal">
                    <VStack gap="space-16" className="max-w-96">
                        <Heading size="small" level="2">
                            Automatisk behandling er stanset
                        </Heading>
                        <VStack gap="space-4">
                            <Label as="p" size="small">
                                Begrunnelse
                            </Label>
                            <BodyLong size="small" className="whitespace-pre-wrap">
                                {begrunnelse || 'Ingen begrunnelse'}
                            </BodyLong>
                        </VStack>
                        <InlineMessage status="info" size="small">
                            Når du opphever stansen, kan sykepengene behandles automatisk igjen
                        </InlineMessage>
                        <HStack gap="space-8">
                            <Button size="xsmall" variant="primary" onClick={åpneOpphevDialog}>
                                Opphev stans
                            </Button>
                            <Button size="xsmall" variant="tertiary" onClick={() => setPopoverÅpen(false)}>
                                Avbryt
                            </Button>
                        </HStack>
                    </VStack>
                </Popover.Content>
            </Popover>
            {dialogÅpen && (
                <Dialog open={dialogÅpen} onOpenChange={setDialogÅpen}>
                    <OpphevStansAutomatiskBehandlingDialogInnhold
                        fødselsnummer={fødselsnummer}
                        onSuccess={() => setDialogÅpen(false)}
                    />
                </Dialog>
            )}
        </>
    );
}
