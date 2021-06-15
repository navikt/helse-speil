import styled from '@emotion/styled';

import { LoggHeader as EksternLoggheader } from '@navikt/helse-frontend-logg';

export const LoggHeader = styled(EksternLoggheader)`
    width: 312px;
    box-sizing: border-box;
    box-shadow: inset 0 -1px 0 0 var(--navds-color-border);
    height: 75px;

    & > button {
        min-height: 75px;
    }
`;
