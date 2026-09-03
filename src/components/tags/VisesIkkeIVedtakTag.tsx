import { ReactElement, ReactNode } from 'react';

import { EyeClosedIcon } from '@navikt/aksel-icons';
import { Tag, VStack } from '@navikt/ds-react';

export function VisesIkkeIVedtakTag({ label }: { label?: ReactNode }): ReactElement {
    return (
        <VStack gap="space-2" align="start">
            {label && <label>{label}</label>}
            <Tag size="xsmall" variant="outline" data-color="meta-purple" icon={<EyeClosedIcon aria-hidden />}>
                Vises ikke i vedtaket
            </Tag>
        </VStack>
    );
}
