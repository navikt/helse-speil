import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

interface EnBlokkProps extends React.HTMLAttributes<HTMLDivElement> {
    overskrift: string;
}

export const DokumentFragment = ({ overskrift, children }: EnBlokkProps): ReactElement => {
    return (
        <>
            <BodyShort weight="semibold">{overskrift}</BodyShort>
            <BodyShort>{children}</BodyShort>
        </>
    );
};

export const DokumentFragmentAnonymisert = ({ overskrift, children }: EnBlokkProps): ReactElement => {
    return (
        <>
            <BodyShort weight="semibold">{overskrift}</BodyShort>
            <BodyShort data-sensitive>{children}</BodyShort>
        </>
    );
};
