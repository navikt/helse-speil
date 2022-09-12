import styled from '@emotion/styled';
import { AnimatePresence } from 'framer-motion';
import React from 'react';
import { useRecoilValue } from 'recoil';

import { toastsState } from '@state/toasts';

import { AnimatedToast } from '@components/toasts/AnimatedToast';

const Container = styled.div`
    position: fixed;
    bottom: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    height: auto;
`;

export const Toasts = () => {
    const toasts = useRecoilValue(toastsState);

    return (
        <Container>
            <AnimatePresence>
                {toasts.map((it) => (
                    <AnimatedToast variant={it.variant} key={it.key} toastKey={it.key}>
                        {it.message}
                    </AnimatedToast>
                ))}
            </AnimatePresence>
        </Container>
    );
};
