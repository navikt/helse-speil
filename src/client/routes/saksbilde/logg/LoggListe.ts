import styled from '@emotion/styled';

import { LoggListe as EksternLoggliste } from '@navikt/helse-frontend-logg';

export const LoggListe = styled(EksternLoggliste)`
    width: 258px;
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
