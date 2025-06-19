import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { AnonymizableText } from '@components/anonymizable/AnonymizableText';

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

export const DokumentFragmentAnonymisert = ({ overskrift, children }: EnBlokkProps): ReactElement => {
    return (
        <>
            <BodyShort weight="semibold" size="small">
                {overskrift}
            </BodyShort>
            <AnonymizableText size="small">{children}</AnonymizableText>
        </>
    );
};
