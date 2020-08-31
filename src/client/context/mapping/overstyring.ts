import { Overstyring, OverstyrtDag } from '../types.internal';
import { SpesialistOverstyring, SpesialistOverstyringDag } from './types.external';
import { sykdomstidslinjedag } from './dag';
import dayjs from 'dayjs';

export const tilOverstyrtDag = (dag: SpesialistOverstyringDag): OverstyrtDag => ({
    dato: dayjs(dag.dato),
    type: sykdomstidslinjedag(dag.dagtype),
    grad: dag.grad,
});

export const tilOverstyringMap = (
    map: Map<string, Overstyring>,
    overstyring: SpesialistOverstyring
): Map<string, Overstyring> =>
    map.set(overstyring.hendelseId, {
        begrunnelse: overstyring.begrunnelse,
        timestamp: overstyring.timestamp,
        unntaFraInnsyn: overstyring.unntaFraInnsyn,
        hendelseId: overstyring.hendelseId,
        overstyrteDager: overstyring.overstyrteDager.map(tilOverstyrtDag),
    });
