import { Dag } from 'internal-types';
import { useState } from 'react';

type UseOverstyrteDagerResult = {
    dager: Dag[];
    addDag: (dag: Dag, delAvDag: Omit<Partial<Dag>, 'dato'>) => void;
};

export const useOverstyrteDager = (originaleDager?: Dag[]): UseOverstyrteDagerResult => {
    const [dager, setDager] = useState<Dag[]>([]);

    const equalsOriginal = (other: Dag) => {
        const originalDag = originaleDager?.find((dag) => dag.dato.isSame(other.dato));
        return originalDag && originalDag.type == other.type && originalDag.gradering == other.gradering;
    };

    const addDag = (dag: Dag, delAvDag: Omit<Partial<Dag>, 'dato'>) => {
        setDager((dager) => {
            const andreDager = dager.filter((it) => !it.dato.isSame(dag.dato));
            const gammelDag = dager.find((it) => it.dato.isSame(dag.dato));
            if (gammelDag) return [...andreDager, { ...gammelDag, ...delAvDag }].filter((dag) => !equalsOriginal(dag));
            else return [...andreDager, { ...dag, ...delAvDag }].filter((dag) => !equalsOriginal(dag));
        });
    };

    return { dager, addDag };
};
