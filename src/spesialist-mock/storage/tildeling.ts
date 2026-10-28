import { ApiTildeling } from '@io/rest/generated/spesialist.schemas';

export class TildelingMock {
    private static tildelinger: Map<string, ApiTildeling> = new Map();

    static getTildeling = (personPseudoId: string): ApiTildeling | undefined =>
        TildelingMock.tildelinger.get(personPseudoId);

    static harTildeling = (personPseudoId: string): boolean => TildelingMock.tildelinger.has(personPseudoId);

    static setTildeling = (personPseudoId: string, tildeling: ApiTildeling) =>
        TildelingMock.tildelinger.set(personPseudoId, tildeling);

    static fjernTildeling = (personPseudoId: string) => TildelingMock.tildelinger.delete(personPseudoId);

    static nullstill = (): void => {
        TildelingMock.tildelinger.clear();
    };
}
