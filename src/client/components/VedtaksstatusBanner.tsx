import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { toastsState, useRemoveToast } from '../state/toastsState';
import { vedtaksstatusToastKey } from '../routes/oversikt/VedtaksstatusToast';
import { AnimatePresence, motion } from 'framer-motion';
import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';
import styled from '@emotion/styled';
import { useTimeout } from '../hooks/useTimeout';

const StyledVarsel = styled(Varsel)`
    position: absolute;
    box-sizing: border-box;
    width: 100%;
`;

export const VedtaksstatusBanner = () => {
    const [showing, setShowing] = useState(true);
    const vedtaksstatusToast = useRecoilValue(toastsState)
        .filter((toast) => toast.key === vedtaksstatusToastKey)
        .pop();

    const fjernToast = useRemoveToast();

    useTimeout({
        trigger: vedtaksstatusToast !== undefined,
        timeout: vedtaksstatusToast?.timeToLiveMs ?? 0,
        callback: () => setShowing(false),
        cleanup: () => fjernToast(vedtaksstatusToastKey),
    });

    return (
        <AnimatePresence onExitComplete={() => fjernToast(vedtaksstatusToastKey)}>
            {showing && vedtaksstatusToast && (
                <motion.div
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    exit={{ y: -100 }}
                    transition={{
                        type: 'tween',
                        ease: 'easeInOut',
                    }}
                >
                    <StyledVarsel type={Varseltype.Suksess}>{vedtaksstatusToast.message}</StyledVarsel>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
