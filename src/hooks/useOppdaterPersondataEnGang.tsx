import { useEffect, useRef } from 'react';

import {
    oppdatererPersondataToastKey,
    useOppdaterPersondata,
} from '@saksbilde/saksbildeMenu/dropdown/useOppdaterPersondata';
import { useFetchPersonQuery } from '@state/person';
import { useRemoveToast } from '@state/toasts';

export const useOppdaterPersondataEnGang = () => {
    const { data } = useFetchPersonQuery();
    const fødselsnummer = data?.person?.fodselsnummer;
    const [forespørPersonoppdatering] = useOppdaterPersondata();
    const removeToast = useRemoveToast();

    const forespørPersonoppdateringRef = useRef(forespørPersonoppdatering);
    forespørPersonoppdateringRef.current = forespørPersonoppdatering;

    const removeToastRef = useRef(removeToast);
    removeToastRef.current = removeToast;

    useEffect(() => {
        if (fødselsnummer != undefined) {
            void forespørPersonoppdateringRef.current(fødselsnummer);
        }
        return () => {
            removeToastRef.current(oppdatererPersondataToastKey);
        };
    }, [fødselsnummer]);
};
