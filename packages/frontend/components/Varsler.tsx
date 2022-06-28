import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'framer-motion';
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

const DisappearingVarslerContainer = styled.div`
    position: absolute;
    overflow-y: hidden;
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
    const constant = varsler.filter((it) => typeof it.timeToLiveMS !== 'number');
    const disappearing = varsler.filter((it) => typeof it.timeToLiveMS === 'number');

    return (
        <Container>
            {constant.map(({ name, severity, message }) => (
                <TechnicalVarsel key={name} severity={severity} message={message} technical={false} />
            ))}
            <DisappearingVarslerContainer>
                <AnimatePresence>
                    {disappearing.map(({ name, severity, message }) => (
                        <motion.div
                            key={name}
                            initial={{ y: -100 }}
                            animate={{ y: 0 }}
                            exit={{ y: -100 }}
                            transition={{
                                type: 'tween',
                                ease: 'easeInOut',
                            }}
                        >
                            <TechnicalVarsel key={name} severity={severity} message={message} technical={false} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </DisappearingVarslerContainer>
        </Container>
    );
};
