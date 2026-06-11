import { ComponentPropsWithRef, ReactElement } from 'react';

import { BodyShort, BodyShortProps } from '@navikt/ds-react';

interface BodyShortWithPreWrapProps extends ComponentPropsWithRef<'p'>, Omit<BodyShortProps, 'children'> {}

export const BodyShortWithPreWrap = ({ children, ref, style, ...props }: BodyShortWithPreWrapProps): ReactElement => {
    return (
        <BodyShort ref={ref} style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word', ...style }} {...props}>
            {children}
        </BodyShort>
    );
};
