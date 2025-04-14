import { ComponentPropsWithRef, ReactElement } from 'react';

import { BodyShort, BodyShortProps } from '@navikt/ds-react';

interface BodyShortWithPreWrapProps extends ComponentPropsWithRef<'p'>, Omit<BodyShortProps, 'children'> {}

export const BodyShortWithPreWrap = ({ children, ref, ...props }: BodyShortWithPreWrapProps): ReactElement => {
    return (
        <BodyShort style={{ whiteSpace: 'pre-wrap' }} {...props}>
            {children}
        </BodyShort>
    );
};
