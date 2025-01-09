import { ReactElement, forwardRef } from 'react';

import { BodyLong, BodyLongProps } from '@navikt/ds-react';

export const BodyLongWithPreWrap = forwardRef<HTMLParagraphElement, BodyLongProps>(
    ({ children, ...props }, ref): ReactElement => {
        return (
            <BodyLong style={{ whiteSpace: 'pre-wrap' }} ref={ref} {...props}>
                {children}
            </BodyLong>
        );
    },
);
