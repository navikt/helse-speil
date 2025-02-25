import { ReactElement, forwardRef } from 'react';

import { BodyLongProps, BodyShort } from '@navikt/ds-react';

export const BodyShortWithPreWrap = forwardRef<HTMLParagraphElement, BodyLongProps>(
    ({ children, ...props }, ref): ReactElement => {
        return (
            <BodyShort style={{ whiteSpace: 'pre-wrap' }} ref={ref} {...props}>
                {children}
            </BodyShort>
        );
    },
);
