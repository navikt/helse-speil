import styled from '@emotion/styled';
import React from 'react';

import { BehandletAvInfotrygdVarsel } from '@navikt/helse-frontend-varsel';

import { Inntektskilderinnhold } from './Inntektskilderinnhold';
import { SykepengegrunnlagInfotrygd } from './SykepengegrunnlagInfotrygd';

const OversiktContainer = styled.div`
    display: flex;
    margin-top: 1rem;
    align-content: space-between;
`;

const Strek = styled.span`
    border-right: 1px solid var(--navds-color-border);
    height: inherit;
    display: inline-block;
    margin: 0 2.5rem;
`;

interface SykepengegrunnlagFraInfogtrygdProps {
    inntektsgrunnlag: Inntektsgrunnlag;
    inntekt: Arbeidsgiverinntekt;
    anonymiseringEnabled: boolean;
}

export const SykepengegrunnlagFraInfogtrygd = ({
    inntektsgrunnlag,
    inntekt,
    anonymiseringEnabled,
}: SykepengegrunnlagFraInfogtrygdProps) => (
    <BehandletAvInfotrygdVarsel tittel="Sykepengegrunnlag satt i Infotrygd">
        <OversiktContainer>
            <Inntektskilderinnhold inntekt={inntekt!} anonymiseringEnabled={anonymiseringEnabled} />
            <Strek />
            <SykepengegrunnlagInfotrygd inntektsgrunnlag={inntektsgrunnlag} />
        </OversiktContainer>
    </BehandletAvInfotrygdVarsel>
);
