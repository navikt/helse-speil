import styled from '@emotion/styled';

import { Varsel } from '@navikt/helse-frontend-varsel';

export const Saksbildevarsel = styled(Varsel)`
    border-top: none;
    border-left: none;
    border-right: none;
    > svg {
        margin-right: var(--navds-spacing-3);
    }
`;
