import { ApiGraderteAndreYtelserDag } from '@io/rest/generated/andre-ytelser/andre-ytelser.schemas';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import { harFordeling } from './graderteAndreYtelserRequest';

export function erReellEndring(
    tilDag: Partial<Utbetalingstabelldag>,
    fraDag: Utbetalingstabelldag,
    lagretGradertDag?: ApiGraderteAndreYtelserDag,
): boolean {
    if (tilDag.gradertAnnenYtelse) return erEndretGradertAnnenYtelse(tilDag, lagretGradertDag);
    return harFordeling(lagretGradertDag) || erEndretITidslinjen(tilDag, fraDag);
}

export function erEndretITidslinjen(tilDag: Partial<Utbetalingstabelldag>, fraDag: Utbetalingstabelldag): boolean {
    return (
        (typeof tilDag.grad === 'number' && tilDag.grad !== fraDag.grad) ||
        tilDag.dag?.speilDagtype !== fraDag.dag.speilDagtype
    );
}

// sammenligner alle detaljene istedenfor hele fraGrad
function erEndretGradertAnnenYtelse(
    { gradertAnnenYtelse }: Partial<Utbetalingstabelldag>,
    lagretGradertDag?: ApiGraderteAndreYtelserDag,
): boolean {
    if (!lagretGradertDag || !gradertAnnenYtelse) return true;
    return (
        lagretGradertDag.sykdomsgradFørFordeling !== gradertAnnenYtelse.sykdomsgradFørFordeling ||
        lagretGradertDag.sykdomsgrad !== gradertAnnenYtelse.sykdomsgrad ||
        lagretGradertDag.begrunnelse !== gradertAnnenYtelse.begrunnelse ||
        !erLikeGrader(lagretGradertDag.andreYtelserGrader, gradertAnnenYtelse.andreYtelserGrader)
    );
}

function erLikeGrader(lagrede: Record<string, number | undefined>, endrede: Record<string, number | undefined>) {
    const ytelser = Object.keys(lagrede);
    return (
        ytelser.length === Object.keys(endrede).length && ytelser.every((ytelse) => lagrede[ytelse] === endrede[ytelse])
    );
}
