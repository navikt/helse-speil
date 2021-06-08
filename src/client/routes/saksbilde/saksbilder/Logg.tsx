import styled from '@emotion/styled';

import { LoggHeader as EksternLoggheader, LoggListe as EksternLoggliste } from '@navikt/helse-frontend-logg';

export const LoggContainer = styled.div`
    border-left: 1px solid var(--navds-color-border);
`;

export const LoggHeader = styled(EksternLoggheader)`
    width: 312px;
    box-sizing: border-box;
    box-shadow: inset 0 -1px 0 0 var(--navds-color-border);
    height: 75px;

    & > button {
        min-height: 75px;
    }
`;

export const LoggListe = styled(EksternLoggliste)`
    width: 312px;
    box-sizing: border-box;
    border-top: none;

    .Sykmelding:before,
    .Søknad:before,
    .Inntektsmelding:before {
        position: absolute;
        font-size: 14px;
        border: 1px solid var(--navds-color-text-primary);
        color: var(--navds-color-text-primary);
        border-radius: 4px;
        width: 28px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 4px;
        box-sizing: border-box;
        left: 0;
    }

    .Sykmelding:before {
        content: 'SM';
    }

    .Søknad:before {
        content: 'SØ';
    }

    .Inntektsmelding:before {
        content: 'IM';
    }
`;
