import { useContext } from 'react';
import { PersonContext } from '../context/PersonContext';

export const useMaksdato = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);

    const maksdato = aktivVedtaksperiode?.vilkår?.dagerIgjen?.maksdato;

    return { maksdato };
};
