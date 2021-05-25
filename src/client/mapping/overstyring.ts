import dayjs from 'dayjs';
import { SpesialistOverstyringDag } from 'external-types';
import { OverstyrtDag } from 'internal-types';

import { sykdomstidslinjedag } from './dag';

export const tilOverstyrtDag = (dag: SpesialistOverstyringDag): OverstyrtDag => ({
    dato: dayjs(dag.dato),
    type: sykdomstidslinjedag(dag.dagtype),
    grad: dag.grad,
});
