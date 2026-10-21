import { ApiSaksbildeTildeling } from '@io/rest/generated/spesialist.schemas';

export class TildelingMock {
    private static tildelinger: Map<string, ApiSaksbildeTildeling> = new Map();

    static getTildeling = (personPseudoId: string): ApiSaksbildeTildeling | undefined =>
        TildelingMock.tildelinger.get(personPseudoId);

    static harTildeling = (personPseudoId: string): boolean => TildelingMock.tildelinger.has(personPseudoId);

    static setTildeling = (personPseudoId: string, tildeling: ApiSaksbildeTildeling) =>
        TildelingMock.tildelinger.set(personPseudoId, tildeling);

    static fjernTildeling = (personPseudoId: string) => TildelingMock.tildelinger.delete(personPseudoId);

    static nullstill = (): void => {
        TildelingMock.tildelinger.clear();
    };
}
