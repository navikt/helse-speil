import { Sykdomsdag } from 'internal-types';
import { useState } from 'react';

export const useOverstyrteDager = (originaleDager?: Sykdomsdag[]) => {
    const [overstyrteDager, setOverstyrteDager] = useState<Sykdomsdag[]>([]);

    const erLikOriginal = (other: Sykdomsdag) => {
        const originalDag = originaleDager?.find((dag) => dag.dato.isSame(other.dato));
        return originalDag && originalDag.type == other.type && originalDag.gradering == other.gradering;
    };

    const leggTilOverstyrtDag = (nyDag: Sykdomsdag) => {
        setOverstyrteDager((dager) => {
            const andreDager = [...dager].filter((dag) => !dag.dato.isSame(nyDag.dato));
            return [...andreDager, nyDag].filter((dag) => !erLikOriginal(dag));
        });
    };

    return { overstyrteDager, leggTilOverstyrtDag };
};
