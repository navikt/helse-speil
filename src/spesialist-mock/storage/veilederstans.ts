import fs from 'fs';
import path from 'path';
import { cwd } from 'process';

import { ApiVeilederStans } from '@io/rest/generated/spesialist.schemas';
import { PersonMock } from '@spesialist-mock/storage/person';

type VeilederStansMockFil = {
    fodselsnummer: string;
    data: {
        veilederStans: ApiVeilederStans;
    };
};

export class VeilederStansMock {
    private static veilederStans: Map<string, ApiVeilederStans> = new Map();

    static {
        const url = path.join(cwd(), 'src/spesialist-mock/data/veilederstans');
        const filenames = fs.readdirSync(url);
        const veilederStansMockFiler: VeilederStansMockFil[] = filenames.map((filename) => {
            const raw = fs.readFileSync(path.join(url, filename), { encoding: 'utf-8' });
            return JSON.parse(raw);
        });

        veilederStansMockFiler.forEach((veilederStansMockFil) => {
            VeilederStansMock.veilederStans.set(
                veilederStansMockFil.fodselsnummer,
                veilederStansMockFil.data.veilederStans,
            );
        });
    }

    static getVeilederStans = (pseudoId: string): ApiVeilederStans | null => {
        const fødselsnummer = PersonMock.findFødselsnummerForPersonPseudoId(pseudoId);

        if (fødselsnummer === null) {
            return null;
        }

        return VeilederStansMock.veilederStans.get(fødselsnummer) ?? null;
    };

    static opphevStans = (pseudoId: string): void => {
        const fødselsnummer = PersonMock.findFødselsnummerForPersonPseudoId(pseudoId);

        if (fødselsnummer === null) {
            return;
        }

        const eksisterendeStans = VeilederStansMock.veilederStans.get(fødselsnummer);

        if (!eksisterendeStans) {
            return;
        }

        VeilederStansMock.veilederStans.set(fødselsnummer, {
            ...eksisterendeStans,
            erStanset: false,
        });
    };
}
