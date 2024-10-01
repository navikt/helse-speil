import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

interface EnBlokkProps extends React.HTMLAttributes<HTMLDivElement> {
    overskrift: string;
}

export const DokumentFragment = ({ overskrift, children }: EnBlokkProps): ReactElement => {
    return (
        <>
            <BodyShort weight="semibold" size="small">
                {overskrift}
            </BodyShort>
            <BodyShort size="small">{children}</BodyShort>
        </>
    );
};
