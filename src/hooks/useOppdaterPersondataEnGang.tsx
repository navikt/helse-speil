import { useEffect } from 'react';

import { useFetchPersonQuery } from '@/state/person';
import { useOppdaterPersondata } from '@saksbilde/saksbildeMenu/dropdown/useOppdaterPersondata';

export const useOppdaterPersondataEnGang = () => {
    const { data } = useFetchPersonQuery();
    const fødselsnummer = data?.person?.fodselsnummer;
    const [forespørPersonoppdatering] = useOppdaterPersondata();

    useEffect(() => {
        if (fødselsnummer != undefined) {
            void forespørPersonoppdatering(fødselsnummer);
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps --
          Kan ikke oppgi forespørPersonoppdatering som avhengighet, da blir det doble kall
         */
    }, [fødselsnummer]);
};
