import React from 'react';
import { useRecoilValue } from 'recoil';
import { toastsState } from '../state/toastsState';
import { Toast } from './toasts/Toast';
import styled from '@emotion/styled';
import { AnimatePresence } from 'framer-motion';
import { TimeoutToast } from './toasts/TimeoutToast';

const Container = styled.div`
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
`;

export const Toasts = () => {
    const toasts = useRecoilValue(toastsState);

    return (
        <Container>
            <AnimatePresence>
                {toasts.map((it) =>
                    it.timeToLiveMs !== undefined ? (
                        <TimeoutToast {...it}>{it.message}</TimeoutToast>
                    ) : (
                        <Toast key={it.key} isShowing={true}>
                            {it.message}
                        </Toast>
                    )
                )}
            </AnimatePresence>
        </Container>
    );
};
