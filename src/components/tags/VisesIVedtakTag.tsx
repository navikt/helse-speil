import { ReactElement } from 'react';

import { EyeIcon } from '@navikt/aksel-icons';
import { Tag } from '@navikt/ds-react';

export function VisesIVedtakTag(): ReactElement {
    return (
        <Tag size="xsmall" variant="outline" data-color="meta-lime" icon={<EyeIcon aria-hidden />}>
            Vises i vedtaket
        </Tag>
    );
}
