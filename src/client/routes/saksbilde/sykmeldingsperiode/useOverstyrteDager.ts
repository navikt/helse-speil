import { useState } from 'react';
import { Sykdomsdag } from 'internal-types';

export const useOverstyrteDager = () => {
    const [overstyrteDager, setOverstyrteDager] = useState<Sykdomsdag[]>([]);

    const leggTilOverstyrtDag = (nyDag: Sykdomsdag) => {
        const finnesFraFør = overstyrteDager.find((dag) => dag.dato.isSame(nyDag.dato));
        if (!finnesFraFør) {
            setOverstyrteDager((dager) => [...dager, nyDag]);
        } else {
            setOverstyrteDager((dager) =>
                dager.map((gammelDag) => (gammelDag.dato.isSame(nyDag.dato) ? nyDag : gammelDag))
            );
        }
    };

    const fjernOverstyrtDag = (dagen: Sykdomsdag) => {
        setOverstyrteDager((dager) => dager.filter((overstyrtDag) => !overstyrtDag.dato.isSame(dagen.dato)));
    };

    return { overstyrteDager, leggTilOverstyrtDag, fjernOverstyrtDag };
};
