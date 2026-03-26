import { Tildeling } from '../schemaTypes';

export class TildelingMock {
    private static tildelinger: Map<string, Tildeling> = new Map();

    static getTildelingerFor = (oid: string): Tildeling[] =>
        Array.from(TildelingMock.tildelinger.values()).filter((tildeling) => tildeling.oid === oid);

    static getTildeling = (personPseudoId: string): Tildeling | undefined =>
        TildelingMock.tildelinger.get(personPseudoId);

    static harTildeling = (personPseudoId: string): boolean => TildelingMock.tildelinger.has(personPseudoId);

    static setTildeling = (personPseudoId: string, tildeling: Tildeling) =>
        TildelingMock.tildelinger.set(personPseudoId, tildeling);

    static fjernTildeling = (personPseudoId: string) => TildelingMock.tildelinger.delete(personPseudoId);
}
