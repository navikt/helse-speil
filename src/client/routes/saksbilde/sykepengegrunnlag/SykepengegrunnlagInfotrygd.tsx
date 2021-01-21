import { Element } from 'nav-frontend-typografi';
import { somPenger } from '../../../utils/locale';
import React from 'react';
import styled from '@emotion/styled';

interface SykepengegrunnlagInfotrygdProps {
    årsinntektFraInntektsmelding?: number;
    className?: string;
}

const Innhold = styled.div`
    margin-top: 2rem;
    display: grid;
    grid-template-columns: 15rem max-content;

    > * {
        margin-bottom: 1rem;
    }
`;

const SykepengegrunnlagInfotrygd = ({ årsinntektFraInntektsmelding, className }: SykepengegrunnlagInfotrygdProps) => (
    <Innhold className={className}>
        <Element>Sykepengegrunnlag</Element>
        <Element>{somPenger(årsinntektFraInntektsmelding as number)}</Element>
    </Innhold>
);

export default SykepengegrunnlagInfotrygd;
