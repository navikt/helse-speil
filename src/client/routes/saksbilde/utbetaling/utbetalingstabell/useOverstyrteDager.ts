import { Dag, OverstyrtDag } from 'internal-types';
import { useState } from 'react';

type UseOverstyrteDagerResult = {
    dager: Dag[];
    addDag: (dag: OverstyrtDag) => void;
};

export const useOverstyrteDager = (originaleDager?: Dag[]): UseOverstyrteDagerResult => {
    const [dager, setDager] = useState<Dag[]>([]);

    const equalsOriginal = (other: Dag) => {
        const originalDag = originaleDager?.find((dag) => dag.dato.isSame(other.dato));
        return originalDag && originalDag.type == other.type && originalDag.gradering == other.gradering;
    };

    const addDag = (nyDag: Dag) => {
        setDager((dager) => {
            const andreDager = [...dager].filter((dag) => !dag.dato.isSame(nyDag.dato));
            return [...andreDager, nyDag].filter((dag) => !equalsOriginal(dag));
        });
    };

    return { dager, addDag };
};
