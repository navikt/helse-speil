import { SelvstendigNaering } from '@io/graphql';
import { ActivePeriod } from '@typer/shared';

/**
 * Finn selvstendig næringsdrivende som eier en gitt periode. Om det finnes selvstendig næringsforhold og dette inneholder gitt periode
 *
 * @param periode Aktiv periode som skal finnes på `selvstendig`.
 * @param selvstendig Selvstendig næringsforhold som skal inneholde perioden.
 * @returns `selvstendig` hvis perioden finnes, ellers `null`.
 */
export const findSelvstendigWithPeriode = (
    periode: ActivePeriod,
    selvstendig: SelvstendigNaering | null,
): SelvstendigNaering | null =>
    selvstendig?.generasjoner
        .flatMap((generasjon) => generasjon.perioder)
        .some((enPeriode) => enPeriode.id === periode.id)
        ? selvstendig
        : null;
