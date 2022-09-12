import styled from '@emotion/styled';
import React from 'react';

import { useVarsler } from '@state/varsler';
import { SpeilError } from '@utils/error';

import { Varsel } from './Varsel';

const Separator = styled.span`
    margin-left: 1rem;
    margin-right: 1rem;
`;

const Container = styled.div`
    position: relative;
    height: max-content;
    z-index: 1000;
`;

interface TechnicalVarselProps {
    severity: SpeilError['severity'];
    message: string;
    technical?: boolean;
}

const TechnicalVarsel = ({ severity, message, technical }: TechnicalVarselProps) => (
    <Varsel variant={severity}>
        {message}
        {technical && (
            <>
                <Separator>|</Separator>
                {technical}
            </>
        )}
    </Varsel>
);

export const Varsler = () => {
    const varsler = useVarsler();

    return (
        <Container>
            {varsler.map(({ name, severity, message }) => (
                <TechnicalVarsel key={name} severity={severity} message={message} technical={false} />
            ))}
        </Container>
    );
};
