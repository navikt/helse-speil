import { BeregnetPeriode, Periode, Person, Refusjon } from '@io/graphql';

const onlyBeregnedePerioder = (periode: Periode): periode is BeregnetPeriode =>
    (periode as BeregnetPeriode).beregningId !== null;

export const selectRefusjon = (person: Person, beregningId: string): Refusjon | null =>
    person.arbeidsgivere
        .flatMap((it) => it.generasjoner)
        .flatMap((it) => it.perioder)
        .filter(onlyBeregnedePerioder)
        .find((it) => it.beregningId === beregningId)?.refusjon ?? null;
