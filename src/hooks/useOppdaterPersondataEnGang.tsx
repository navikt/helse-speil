import { useEffect } from 'react';

import { useFetchPersonQuery } from '@/state/person';
import { useBrukerGrupper } from '@auth/brukerContext';
import { useOppdaterPersondata } from '@saksbilde/saksbildeMenu/dropdown/useOppdaterPersondata';
import { erUtviklingEllerErPåTeamBømlo } from '@utils/featureToggles';

export const useOppdaterPersondataEnGang = () => {
    const { data } = useFetchPersonQuery();
    const fødselsnummer = data?.person?.fodselsnummer;
    const [forespørPersonoppdatering] = useOppdaterPersondata();
    const brukergrupper = useBrukerGrupper();

    useEffect(() => {
        if (fødselsnummer != undefined && erUtviklingEllerErPåTeamBømlo(brukergrupper)) {
            void forespørPersonoppdatering(fødselsnummer);
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps --
          Kan ikke bruke forespørPersonoppdatering som dependency, da blir det dobble kall
         */
    }, [fødselsnummer]);
};
