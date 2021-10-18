import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useRecoilValue } from 'recoil';

import { Varsel } from '@navikt/helse-frontend-varsel';

import { VarselObject, varslerForScope } from '../state/varsler';

const Separator = styled.span`
    margin-left: 1rem;
    margin-right: 1rem;
`;

const Container = styled.div`
    position: relative;
    height: max-content;
    z-index: 1000;
`;

const EphemeralContainer = styled.div`
    position: absolute;
    overflow-y: hidden;
`;

const TechnicalVarsel = ({ type, message, technical }: VarselObject) => (
    <Varsel type={type}>
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
    const varsler = useRecoilValue(varslerForScope).filter((it) => it);
    const constant = varsler.filter((it) => !it.ephemeral);
    const ephemeral = varsler.filter((it) => it.ephemeral);
    return (
        <Container>
            {constant.map(({ key, type, message, technical }) => (
                <TechnicalVarsel key={key} type={type} message={message} technical={technical} />
            ))}
            <EphemeralContainer>
                <AnimatePresence>
                    {ephemeral.map(({ key, type, message, technical }) => (
                        <motion.div
                            key={key}
                            initial={{ y: -100 }}
                            animate={{ y: 0 }}
                            exit={{ y: -100 }}
                            transition={{
                                type: 'tween',
                                ease: 'easeInOut',
                            }}
                        >
                            <TechnicalVarsel key={key} type={type} message={message} technical={technical} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </EphemeralContainer>
        </Container>
    );
};
