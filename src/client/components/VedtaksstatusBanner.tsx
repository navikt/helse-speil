import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { toastsState, useFjernEnToast } from '../state/toastsState';
import { vedtaksstatusToastKey } from '../routes/Oversikt/VedtaksstatusToast';
import { AnimatePresence, motion } from 'framer-motion';
import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';
import styled from '@emotion/styled';

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

    const fjernToast = useFjernEnToast();

    useEffect(() => {
        if (vedtaksstatusToast) {
            const timeoutId = setTimeout(() => setShowing(false), vedtaksstatusToast.timeToLiveMs);
            return () => {
                clearTimeout(timeoutId);
            };
        }
        return () => {
            fjernToast(vedtaksstatusToastKey);
        };
    }, [vedtaksstatusToast]);

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
