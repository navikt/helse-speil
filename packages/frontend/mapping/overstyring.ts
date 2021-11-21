import dayjs from 'dayjs';

import { sykdomstidslinjedag } from './dag';

export const tilOverstyrtDag = (dag: ExternalOverstyringsdag): OverstyrtDag => ({
    dato: dayjs(dag.dato),
    type: sykdomstidslinjedag(dag.dagtype),
    grad: dag.grad,
});
