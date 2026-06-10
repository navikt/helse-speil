import React, { ReactElement } from 'react';

import { BodyShort, HStack } from '@navikt/ds-react';

import { ApiDialogmelding } from '@io/rest/generated/sporhund.schemas';
import { erFraNav, erFraSystem } from '@utils/typeguards';

interface Props {
    melding: ApiDialogmelding;
    behandlerNavn: string;
}

export function AvsenderInfo({ melding, behandlerNavn }: Props): ReactElement {
    if (erFraNav(melding)) {
        return (
            <HStack gap="space-16">
                <BodyShort className="text-ax-text-neutral-subtle">
                    <span className="font-bold">Fra:</span> {melding.saksbehandler}
                </BodyShort>
                <BodyShort className="text-ax-text-neutral-subtle">
                    <span className="font-bold">Til:</span> {behandlerNavn}
                </BodyShort>
            </HStack>
        );
    } else if (erFraSystem(melding)) {
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
