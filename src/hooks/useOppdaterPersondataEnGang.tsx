import { useEffect } from 'react';

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

    useEffect(() => {
        if (fødselsnummer != undefined) {
            void forespørPersonoppdatering(fødselsnummer);
        }
        return () => {
            removeToast(oppdatererPersondataToastKey);
        };
    }, [fødselsnummer]);
};
