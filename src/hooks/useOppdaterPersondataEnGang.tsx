import { useEffect } from 'react';

import { useFetchPersonQuery } from '@/state/person';
import {
    oppdatererPersondataToastKey,
    useOppdaterPersondata,
} from '@saksbilde/saksbildeMenu/dropdown/useOppdaterPersondata';
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
        /* eslint-disable-next-line react-hooks/exhaustive-deps --
          Kan ikke oppgi forespørPersonoppdatering eller removeToast som avhengigheter, da gjøres kallene i loop
         */
    }, [fødselsnummer]);
};
