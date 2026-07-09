import { ReactElement } from 'react';

import { EyeClosedIcon } from '@navikt/aksel-icons';
import { Tag } from '@navikt/ds-react';

export function VisesIkkeIVedtakTag(): ReactElement {
    return (
        <Tag size="xsmall" variant="outline" data-color="meta-purple" icon={<EyeClosedIcon aria-hidden />}>
            Vises ikke i vedtaket
        </Tag>
    );
}
