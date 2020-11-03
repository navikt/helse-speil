import React from 'react';
import styled from '@emotion/styled';
import { LoggListe as EksternLoggliste } from '@navikt/helse-frontend-logg';
import { speilV2 } from '../featureToggles';

const Container = styled.div`
    flex: 1;
    width: 314px;
    max-width: 314px;
    border-left: 1px solid #c6c2bf;
    box-sizing: border-box;

    > ul {
        border-top: none;
    }

    .Sykmelding:before,
    .Søknad:before,
    .Inntektsmelding:before {
        position: absolute;
        font-size: 14px;
        border: 1px solid #59514b;
        color: #59514b;
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

const LoggListe = speilV2 ? EksternLoggliste : styled(EksternLoggliste)``;

export const Høyremeny = () => (
    <Container>
        <LoggListe />
    </Container>
);
