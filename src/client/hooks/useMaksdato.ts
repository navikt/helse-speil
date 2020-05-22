import { useContext } from 'react';
import { PersonContext } from '../context/PersonContext';

export const useMaksdato = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);

    const maksdato = aktivVedtaksperiode?.vilkår?.dagerIgjen?.maksdato;

    const maksdatoOverskrides =
        maksdato &&
        aktivVedtaksperiode?.utbetalingstidslinje.find((dag) => dag.dato.isSameOrAfter(maksdato)) !== undefined;

    return { maksdato, maksdatoOverskrides };
};
