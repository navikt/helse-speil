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
    vilkårsgrunnlag: ExternalInfotrygdVilkårsgrunnlag;
    organisasjonsnummer: string;
}

export const SykepengegrunnlagFraInfogtrygd = ({
    vilkårsgrunnlag,
    organisasjonsnummer,
}: SykepengegrunnlagFraInfogtrygdProps) => {
    const inntekt = vilkårsgrunnlag.inntekter.find(
        (it) => it.organisasjonsnummer === organisasjonsnummer
    ) as ExternalArbeidsgiverinntekt;

    return (
        <BehandletAvInfotrygdVarsel tittel="Sykepengegrunnlag satt i Infotrygd">
            <OversiktContainer>
                <Inntektskilderinnhold inntekt={inntekt} />
                <Strek />
                <SykepengegrunnlagInfotrygd
                    vilkårsgrunnlag={vilkårsgrunnlag}
                    organisasjonsnummer={organisasjonsnummer}
                />
            </OversiktContainer>
        </BehandletAvInfotrygdVarsel>
    );
};
