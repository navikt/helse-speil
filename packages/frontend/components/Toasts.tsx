import styled from '@emotion/styled';
import { AnimatePresence } from 'framer-motion';
import React from 'react';
import { useRecoilValue } from 'recoil';

import { toastsState } from '../state/toasts';

import { TimeoutToast } from './toasts/TimeoutToast';
import { Toast } from './toasts/Toast';

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
                        <TimeoutToast
                            key={it.key}
                            toastKey={it.key}
                            callback={it.callback}
                            timeToLiveMs={it.timeToLiveMs}
                        >
                            {it.message}
                        </TimeoutToast>
                    ) : (
                        <Toast key={it.key} toastKey={it.key} isShowing={true}>
                            {it.message}
                        </Toast>
                    )
                )}
            </AnimatePresence>
        </Container>
    );
};
