import { OverstyrtDag } from 'internal-types';
import { SpesialistOverstyringDag } from 'external-types';
import { sykdomstidslinjedag } from './dag';
import dayjs from 'dayjs';

export const tilOverstyrtDag = (dag: SpesialistOverstyringDag): OverstyrtDag => ({
    dato: dayjs(dag.dato),
    type: sykdomstidslinjedag(dag.dagtype),
    grad: dag.grad,
});
