import { ApiVeilederStans } from '@io/rest/generated/spesialist.schemas';

export class VeilederStansMock {
    private static veilederStans: Map<string, ApiVeilederStans> = new Map();

    static getVeilederStans = (pseudoId: string): ApiVeilederStans | null => {
        return VeilederStansMock.veilederStans.get(pseudoId) ?? null;
    };

    static seedVeilederStans = (pseudoId: string, veilederStans: ApiVeilederStans): void => {
        VeilederStansMock.veilederStans.set(pseudoId, veilederStans);
    };

    static opphevStans = (pseudoId: string): void => {
        const eksisterendeStans = VeilederStansMock.veilederStans.get(pseudoId);

        if (!eksisterendeStans) {
            return;
        }

        VeilederStansMock.veilederStans.set(pseudoId, {
            ...eksisterendeStans,
            erStanset: false,
        });
    };
}
