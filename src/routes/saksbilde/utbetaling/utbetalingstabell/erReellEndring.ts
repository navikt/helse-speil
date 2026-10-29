import { ApiGraderteAndreYtelserDag } from '@io/rest/generated/spesialist.schemas';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

export function erReellEndring(
    tilDag: Partial<Utbetalingstabelldag>,
    fraDag: Utbetalingstabelldag,
    lagretGradertDag?: ApiGraderteAndreYtelserDag,
): boolean {
    if (tilDag.gradertAnnenYtelse) return erEndretGradertAnnenYtelse(tilDag, lagretGradertDag);
    return (
        (typeof tilDag.grad === 'number' && tilDag.grad !== fraDag.grad) ||
        tilDag.dag?.speilDagtype !== fraDag.dag.speilDagtype
    );
}

// sammenligner alle detaljene istedenfor hele fraGrad
function erEndretGradertAnnenYtelse(
    { dag, gradertAnnenYtelse }: Partial<Utbetalingstabelldag>,
    lagretGradertDag?: ApiGraderteAndreYtelserDag,
): boolean {
    if (!lagretGradertDag || !dag?.gradertAnnenYtelsetype || !gradertAnnenYtelse) return true;
    const { andreYtelserGrader, sykdomsgrad } = lagretGradertDag;
    return (
        sykdomsgrad !== gradertAnnenYtelse.sykdomsgrad ||
        Object.keys(andreYtelserGrader).length !== 1 ||
        andreYtelserGrader[dag.gradertAnnenYtelsetype] !== gradertAnnenYtelse.andreYtelseGrad
    );
}
