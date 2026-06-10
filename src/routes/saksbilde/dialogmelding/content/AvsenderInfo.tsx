import React, { ReactElement } from 'react';

import { BodyShort, HStack } from '@navikt/ds-react';

import { ApiDialogmeldingAvsender } from '@io/rest/generated/sporhund.schemas';

interface Props {
    avsender: ApiDialogmeldingAvsender;
    brukerNavn: string;
    behandlerNavn: string;
}

export function AvsenderInfo({ avsender, brukerNavn, behandlerNavn }: Props): ReactElement {
    if (avsender === ApiDialogmeldingAvsender.NAV) {
        return (
            <HStack gap="space-16">
                <BodyShort className="text-ax-text-neutral-subtle">
                    <span className="font-bold">Fra:</span> {brukerNavn}
                </BodyShort>
                <BodyShort className="text-ax-text-neutral-subtle">
                    <span className="font-bold">Til:</span> {behandlerNavn}
                </BodyShort>
            </HStack>
        );
    } else if (avsender === ApiDialogmeldingAvsender.SYSTEM) {
        return (
            <BodyShort className="text-ax-text-neutral-subtle">
                <span className="font-bold">Til:</span> {behandlerNavn}
            </BodyShort>
        );
    } else {
        return (
            <BodyShort className="text-ax-text-neutral-subtle">
                <span className="font-bold">Fra:</span> {behandlerNavn}
            </BodyShort>
        );
    }
}
