import { ApiVeilederStans } from '@io/rest/generated/spesialist.schemas';

const getDefaultVeilederStans = (): ApiVeilederStans => ({
    erStanset: false,
    årsaker: [],
    tidspunkt: null,
});

export class VeilederStansMock {
    private static veilederStans: Map<string, ApiVeilederStans> = new Map();

    static getVeilederStans = (fødselsnummer: string): ApiVeilederStans | null => {
        return VeilederStansMock.veilederStans.get(fødselsnummer) ?? null;
    };

    static addVeilederStans = (fødselsnummer: string, nyVeilederStans: Partial<ApiVeilederStans>): void => {
        VeilederStansMock.veilederStans.set(fødselsnummer, {
            ...getDefaultVeilederStans(),
            ...VeilederStansMock.veilederStans.get(fødselsnummer),
            ...nyVeilederStans,
        });
    };
}
