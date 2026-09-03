import { ReactElement, ReactNode } from 'react';

import { EyeIcon } from '@navikt/aksel-icons';
import { Tag, VStack } from '@navikt/ds-react';

export function VisesIVedtakTag({ label }: { label?: ReactNode }): ReactElement {
    return (
        <VStack gap="space-2" align="start">
            {label && <label>{label}</label>}
            <Tag size="xsmall" variant="outline" data-color="meta-lime" icon={<EyeIcon aria-hidden />}>
                Vises i vedtaket
            </Tag>
        </VStack>
    );
}
