import styled from '@emotion/styled';
import React, { useState } from 'react';

import { InntektsgrunnlagTable } from './InntektsgrunnlagTable';
import { Inntektskilderinnhold } from './Inntektskilderinnhold';

const Container = styled.div`
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

export interface UbehandletSykepengegrunnlagProps {
    inntektsgrunnlag: Inntektsgrunnlag;
    inntektskilde?: Arbeidsgiverinntekt;
    anonymiseringEnabled: boolean;
}

export const UbehandletSykepengegrunnlag = ({
    inntektsgrunnlag,
    inntektskilde,
    anonymiseringEnabled,
}: UbehandletSykepengegrunnlagProps) => {
    const [aktivInntektskilde, setAktivInntektskilde] = useState<Arbeidsgiverinntekt>(inntektskilde!);
    return (
        <Container>
            <Inntektskilderinnhold inntektskilde={aktivInntektskilde} anonymiseringEnabled={anonymiseringEnabled} />
            <Strek />
            <InntektsgrunnlagTable
                inntektsgrunnlag={inntektsgrunnlag}
                anonymiseringEnabled={anonymiseringEnabled}
                aktivInntektskilde={aktivInntektskilde}
                setAktivInntektskilde={setAktivInntektskilde}
            />
        </Container>
    );
};
