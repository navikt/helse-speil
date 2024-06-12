import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';

interface EnBlokkProps extends React.HTMLAttributes<HTMLDivElement> {
    overskrift: string;
}

export const DokumentFragment = ({ overskrift, children }: EnBlokkProps): ReactElement => {
    return (
        <>
            <Bold size="small">{overskrift}</Bold>
            <BodyShort size="small">{children}</BodyShort>
        </>
    );
};
