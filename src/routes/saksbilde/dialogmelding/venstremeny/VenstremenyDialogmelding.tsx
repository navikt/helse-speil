import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { NotePencilIcon } from '@navikt/aksel-icons';
import { Button, VStack } from '@navikt/ds-react';

import { DialogmeldingListe } from '@saksbilde/dialogmelding/venstremeny/DialogmeldingListe';

export function VenstremenyDialogmelding(): ReactElement {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();

    return (
        <VStack
            as="section"
            gap="space-16"
            paddingInline="space-16"
            paddingBlock="space-16"
            className="w-[366px] border-r border-r-ax-border-neutral-subtle [grid-area:venstremeny]"
        >
            <Button
                as={Link}
                href={`/person/${personPseudoId}/dialogmelding/ny`}
                variant="primary"
                size="small"
                icon={<NotePencilIcon />}
            >
                Ny dialogmelding
            </Button>
            <DialogmeldingListe />
        </VStack>
    );
}
