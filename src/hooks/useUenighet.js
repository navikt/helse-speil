import { useContext, useMemo } from 'react';
import { InnrapporteringContext } from '../context/InnrapporteringContext';

export const useUenighet = id => {
    const innrapportering = useContext(InnrapporteringContext);

    const value = useMemo(
        () => innrapportering.uenigheter.find(uenighet => uenighet.id === id),
        [innrapportering.uenigheter]
    )?.value;

    return {
        remove: () => innrapportering.removeUenighet(id),
        create: label => innrapportering.addUenighet(id, label),
        update: value => innrapportering.updateUenighet(id, value),
        value
    };
};
